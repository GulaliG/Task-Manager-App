import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Button,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Task,
    getTaskById,
    updateTaskStatus,
    deleteTask,
} from '../storage/TaskStorage';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

/**
 * Screen to view details of a specific task
 */
const TaskDetailScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    /**
     * Fetches the task details from local storage
     */
    const loadTask = async () => {
        if (!id) return;
        try {
            const data = await getTaskById(id);
            setTask(data ?? null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTask();
    }, []);

    /**
     * Handles updating the status of the current task
     */
    const handleStatusUpdate = async (status: Task['status']) => {
        if (!id) return;
        await updateTaskStatus(id, status);
        await loadTask();
    };

    /**
     * Confirms and deletes the task
     */
    const handleDelete = async () => {
        if (!id) return;

        Alert.alert(
            'Delete Task',
            'Are you sure you want to permanently delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteTask(id);
                        router.replace('/');
                    },
                },
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
    }

    if (!task) {
        return <Text style={styles.empty}>Task not found</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{task.title}</Text>

            <View style={styles.row}>
                <Ionicons name="location-outline" size={18} color={Colors.mutedText} />
                <Text style={styles.meta}>{task.location}</Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="time-outline" size={18} color={Colors.mutedText} />
                <Text style={styles.meta}>
                    {new Date(task.dateTime).toLocaleString()}
                </Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="flag-outline" size={18} color={Colors.mutedText} />
                <Text style={[styles.status, getStatusStyle(task.status)]}>
                    {task.status}
                </Text>
            </View>

            <View style={styles.description}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.meta}>{task.description || '—'}</Text>
            </View>

            <View style={styles.buttonGroup}>
                <Button
                    title="Mark as Completed"
                    onPress={() => handleStatusUpdate('Completed')}
                    color={Colors.success}
                />
                <Button
                    title="Mark as In Progress"
                    onPress={() => handleStatusUpdate('In Progress')}
                    color={Colors.warning}
                />
                <Button
                    title="Cancel Task"
                    onPress={() => handleStatusUpdate('Cancelled')}
                    color={Colors.danger}
                />
                <View style={{ marginTop: 10 }}>
                    <Button title="Delete Task" color="crimson" onPress={handleDelete} />
                </View>
            </View>
        </View>
    );
};

/**
 * Dynamically assigns color to task status
 */
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
    container: {
        padding: 20,
        backgroundColor: Colors.background,
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colors.primary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    meta: {
        fontSize: 14,
        color: Colors.mutedText,
        marginLeft: 6,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 5,
        color: Colors.text,
    },
    description: {
        marginTop: 20,
    },
    buttonGroup: {
        marginTop: 30,
        gap: 10,
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: Colors.mutedText,
    },
});

export default TaskDetailScreen;
