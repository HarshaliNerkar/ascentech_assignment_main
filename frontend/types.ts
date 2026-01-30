export interface User {
    username: string;
    email?: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    project: number;
    created_at?: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    created_at: string;
    tasks?: Task[];
}
