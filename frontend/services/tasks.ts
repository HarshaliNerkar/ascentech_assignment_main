import api from '../utils/api';

export const getTasks = async () => {
    const response = await api.get('tasks/');
    return response.data;
};

// Create a new task inside a project
export const createTask = async (taskData: { title: string; description: string; status: string; project: number }) => {
    const response = await api.post('tasks/', taskData);
    return response.data;
};

// Update task status (e.g., move from "TODO" to "DONE")
export const updateTaskStatus = async (id: number, status: string) => {
    const response = await api.patch(`tasks/${id}/`, { status });
    return response.data;
};

// Delete a task
export const deleteTask = async (id: number) => {
    await api.delete(`tasks/${id}/`);
};