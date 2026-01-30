"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjectById } from '../../../services/projects';
import { createTask, updateTaskStatus, deleteTask } from '../../../services/tasks';
import Navbar from '@/components/Navbar';

export default function ProjectDetails() {
    const { id } = useParams();
    const router = useRouter();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            const data = await getProjectById(id as string);
            setProject(data);
        } catch (error) {
            console.error("Failed to fetch project", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createTask({ ...newTask, project: Number(id) });
            setNewTask({ title: '', description: '', status: 'TODO' });
            setShowTaskModal(false);
            fetchProjectData();
        } catch (error) {
            alert("Failed to add task");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        // Optimistic update could go here, but strict fetch for now
        try {
            await updateTaskStatus(taskId, newStatus);
            fetchProjectData();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (confirm("Delete this task?")) {
            await deleteTask(taskId);
            fetchProjectData();
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            <div className="animate-pulse">Loading Project...</div>
        </div>
    );

    if (!project) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Project Not Found</h1>
                <Link href="/dashboard" className="text-indigo-400 hover:underline mt-4 block">Return to Dashboard</Link>
            </div>
        </div>
    );

    // Group tasks by status
    const tasksByStatus = {
        TODO: project.tasks?.filter((t: any) => t.status === 'TODO') || [],
        IN_PROGRESS: project.tasks?.filter((t: any) => t.status === 'IN_PROGRESS') || [],
        DONE: project.tasks?.filter((t: any) => t.status === 'DONE') || []
    };

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            {/* Background Gradients */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px]" />
            </div>

            <div className="max-w-[1400px] mx-auto p-6 pt-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-white mb-2 inline-flex items-center transition-colors">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-white mt-1">{project.name}</h1>
                        <p className="text-neutral-400 mt-2 max-w-2xl">{project.description}</p>
                    </div>
                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
                    >
                        + Add Task
                    </button>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
                    {/* Column: TODO */}
                    <KanbanColumn
                        title="To Do"
                        color="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        tasks={tasksByStatus.TODO}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                    />

                    {/* Column: IN PROGRESS */}
                    <KanbanColumn
                        title="In Progress"
                        color="bg-blue-500/10 text-blue-500 border-blue-500/20"
                        tasks={tasksByStatus.IN_PROGRESS}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                    />

                    {/* Column: DONE */}
                    <KanbanColumn
                        title="Done"
                        color="bg-green-500/10 text-green-500 border-green-500/20"
                        tasks={tasksByStatus.DONE}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                    />
                </div>
            </div>

            {/* Task Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    <div className="bg-[#171717] border border-[#262626] p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Add New Task</h2>
                            <button onClick={() => setShowTaskModal(false)} className="text-neutral-500 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleAddTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Title</label>
                                <input
                                    className="input-field"
                                    placeholder="Task title"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Description</label>
                                <textarea
                                    className="input-field min-h-[100px] resize-none"
                                    placeholder="Task details..."
                                    rows={3}
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Status</label>
                                <select
                                    className="input-field appearance-none"
                                    value={newTask.status}
                                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-medium shadow-lg shadow-indigo-500/20"
                            >
                                {isSubmitting ? 'Adding...' : 'Create Task'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Component for Kanban Columns
function KanbanColumn({ title, color, tasks, onStatusChange, onDelete }: any) {
    return (
        <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-3xl border ${color} flex justify-between items-center backdrop-blur-sm shadow-sm`}>
                <h3 className="font-bold text-sm tracking-wide uppercase">{title}</h3>
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white backdrop-blur-md">{tasks.length}</span>
            </div>

            <div className="flex flex-col gap-3">
                {tasks.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-neutral-800 rounded-xl text-neutral-600 text-sm">
                        No tasks
                    </div>
                )}
                {tasks.map((task: any) => (
                    <div key={task.id} className="card p-4 hover:border-neutral-700 group relative">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className={`font-semibold text-neutral-200 ${task.status === 'DONE' ? 'line-through text-neutral-500' : ''}`}>
                                {task.title}
                            </h4>
                            <div className="relative">
                                {/* Simple Dropdown for moving tasks */}
                                <select
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                    value={task.status}
                                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                                <button className="text-xs text-neutral-500 hover:text-white p-1 rounded hover:bg-neutral-800">
                                    Move ▾
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3 line-clamp-3">{task.description}</p>

                        <div className="flex justify-between items-center pt-3 border-t border-neutral-800/50">
                            <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-medium">
                                Task #{task.id}
                            </span>
                            <button
                                onClick={() => onDelete(task.id)}
                                className="text-xs text-red-400/0 group-hover:text-red-400 transition-all hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}