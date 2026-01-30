import api from '../utils/api';

// Get all projects for the dashboard
export const getProjects = async () => {
    const response = await api.get('projects/');
    return response.data;
};

// Get a SINGLE project (for the Details Page)
export const getProjectById = async (id: string) => {
    const response = await api.get(`projects/${id}/`);
    return response.data;
};

export const createProject = async (data: { name: string; description: string }) => {
    const response = await api.post('projects/', data);
    return response.data;
};

export const deleteProject = async (id: number) => {
    await api.delete(`projects/${id}/`);
};