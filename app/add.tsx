import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addTask } from '../storage/TaskStorage';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

/**
 * Screen to create and save a new task
 */
const AddTaskScreen = () => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    /**
     * Handles saving task data to storage after validation
     */
    const handleSubmit = async () => {
        if (!title.trim() || !location.trim()) {
            Alert.alert('Missing Fields', 'Please fill in both title and location.');
            return;
        }

        try {
            await addTask({
                title,
                description,
                dateTime: date.toISOString(),
                location,
            });

            router.replace('/');
        } catch (error) {
            Alert.alert('Save Error', 'An unexpected error occurred while saving the task.');
        }
    };

    /**
     * Updates state when user confirms date selection
     */
    const handleConfirmDate = (selectedDate: Date) => {
        setShowPicker(false);
        setDate(selectedDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add New Task</Text>

            <TextInput
                placeholder="Task Title *"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                multiline
            />

            <TextInput
                placeholder="Location *"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
            />

            <Button
                title="Choose Date/Time"
                onPress={() => setShowPicker(true)}
                color={Colors.primary}
            />

            <Text style={styles.dateLabel}>Selected: {date.toLocaleString()}</Text>

            <DateTimePickerModal
                isVisible={showPicker}
                mode="datetime"
                onConfirm={handleConfirmDate}
                onCancel={() => setShowPicker(false)}
                minimumDate={new Date()}
                locale="tr"
            />

            <View style={styles.buttonWrapper}>
                <Button title="Save Task" onPress={handleSubmit} color={Colors.primary} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primary,
    },
    input: {
        backgroundColor: Colors.card,
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 14,
        color: Colors.text,
    },
    dateLabel: {
        marginTop: 10,
        marginBottom: 20,
        color: Colors.text,
    },
    buttonWrapper: {
        marginTop: 20,
    },
});

export default AddTaskScreen;
