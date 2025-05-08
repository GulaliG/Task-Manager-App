import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getTasks, Task } from '../storage/TaskStorage';
import TaskCard from '../components/TaskCard';
import Colors from '@/constants/Colors';

type SortOption = 'date' | 'status';

const HomeScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('date');
    const router = useRouter();

    /**
     * Load and sort tasks on focus
     */
    useFocusEffect(
        useCallback(() => {
            const fetchAndSortTasks = async () => {
                const storedTasks = await getTasks();
                const sorted = sortTaskList(storedTasks, sortBy);
                setTasks(sorted);
            };

            fetchAndSortTasks();
        }, [sortBy])
    );

    /**
     * Sort task list by creation date or status
     */
    const sortTaskList = (list: Task[], criteria: SortOption): Task[] => {
        if (criteria === 'date') {
            return [...list].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }

        const statusPriority: Record<Task['status'], number> = {
            Pending: 1,
            'In Progress': 2,
            Completed: 3,
            Cancelled: 4,
        };

        return [...list].sort(
            (a, b) => statusPriority[a.status] - statusPriority[b.status]
        );
    };

    /**
     * Change sort option
     */
    const toggleSortOption = () => {
        setSortBy(prev => (prev === 'date' ? 'status' : 'date'));
    };

    /**
     * Navigate to add task screen
     */
    const goToAddTask = () => {
        router.push('/add');
    };

    /**
     * Navigate to task detail screen
     */
    const goToTaskDetail = (id: string) => {
        router.push(`/${id}`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Ionicons name="clipboard-outline" size={22} color={Colors.primary} style={styles.icon} />
                <Text style={styles.header}>Task List</Text>
            </View>

            {/* Sort Toggle */}
            <View style={styles.sortRow}>
                <Button
                    title={`Sort by: ${sortBy === 'date' ? 'Date Added' : 'Status'}`}
                    onPress={toggleSortOption}
                    color={Colors.primary}
                />
            </View>

            {/* Task List */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskCard task={item} onPress={() => goToTaskDetail(item.id)} />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>You don't have any tasks yet.</Text>
                }
            />

            {/* Add Task Button */}
            <View style={styles.buttonContainer}>
                <Button title="Add Task" onPress={goToAddTask} color={Colors.primary} />
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        marginRight: 5,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    sortRow: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    emptyMessage: {
        textAlign: 'center',
        marginVertical: 40,
        color: Colors.mutedText,
    },
    buttonContainer: {
        marginBottom: 20,
    },
});

export default HomeScreen;
