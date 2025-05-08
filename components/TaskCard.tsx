import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../storage/TaskStorage';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface Props {
    task: Task;
    onPress?: () => void;
}

const TaskCard: React.FC<Props> = ({ task, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View>
                <Text style={styles.title}>{task.title}</Text>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={16} color={Colors.mutedText} />
                    <Text style={styles.meta}>{task.location}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="time-outline" size={16} color={Colors.mutedText} />
                    <Text style={styles.meta}>{new Date(task.dateTime).toLocaleString()}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="flag-outline" size={16} color={Colors.mutedText} />
                    <Text style={[styles.status, getStatusStyle(task.status)]}>{task.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const getStatusStyle = (status: Task['status']) => {
    switch (status) {
        case 'Completed':
            return { color: Colors.success };
        case 'In Progress':
            return { color: Colors.warning };
        case 'Cancelled':
            return { color: Colors.danger };
        default:
            return { color: Colors.text };
    }
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: Colors.text,
    },
    meta: {
        fontSize: 13,
        color: Colors.mutedText,
        marginLeft: 6,
    },
    status: {
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
});

export default TaskCard;
