import AsyncStorage from '@react-native-async-storage/async-storage';
// import { v4 as uuidv4 } from 'uuid'; // UUID kullanmak istersen bunu aç

/**
 * Status values a task can have
 */
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

/**
 * Task model structure
 */
export interface Task {
    id: string;
    title: string;
    description?: string;
    dateTime: string;
    location: string;
    status: TaskStatus;
    createdAt: string;
}

/** Storage key used in AsyncStorage */
const TASKS_KEY = 'TASKS_STORAGE_KEY';

/**
 * Generates a unique ID (fallback method if UUID not used)
 */
const generateId = (): string => {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
};

/**
 * Retrieves all tasks stored locally
 */
export const getTasks = async (): Promise<Task[]> => {
    try {
        const json = await AsyncStorage.getItem(TASKS_KEY);
        return json != null ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
};

/**
 * Adds a new task to local storage
 */
export const addTask = async (
    taskData: Omit<Task, 'id' | 'status' | 'createdAt'>
): Promise<void> => {
    if (__DEV__) console.log('taskData:', taskData);

    try {
        // const id = uuidv4(); // Or use UUID if preferred
        const id = generateId();
        if (__DEV__) console.log('Generated ID:', id);

        const tasks = await getTasks();
        if (__DEV__) console.log('Existing task count:', tasks.length);

        const newTask: Task = {
            id,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            title: taskData.title.trim(),
            location: taskData.location.trim(),
            dateTime: taskData.dateTime,
            description: taskData.description?.trim() || '',
        };

        const updatedTasks = [...tasks, newTask];
        if (__DEV__) console.log('New task added:', newTask);

        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
        if (__DEV__) console.log('Task saved to storage');
    } catch (error) {
        console.error('Failed to add a task:', error);
        throw error;
    }
};

/**
 * Updates the status of a specific task
 */
export const updateTaskStatus = async (
    taskId: string,
    status: TaskStatus
): Promise<void> => {
    const tasks = await getTasks();
    const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status } : task
    );
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
};

/**
 * Deletes a specific task from storage
 */
export const deleteTask = async (taskId: string): Promise<void> => {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
};

/**
 * Retrieves a task by its ID
 */
export const getTaskById = async (
    taskId: string
): Promise<Task | undefined> => {
    const tasks = await getTasks();
    return tasks.find(task => task.id === taskId);
};

/**
 * Clears all stored tasks (use with caution, for debug only)
 */
export const clearTasks = async (): Promise<void> => {
    await AsyncStorage.removeItem(TASKS_KEY);
};
