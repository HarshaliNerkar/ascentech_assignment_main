"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProjects, createProject, deleteProject } from '../../services/projects';
import { getTasks } from '../../services/tasks';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';

export default function Dashboard() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalProjects: 0, totalTasks: 0, completedTasks: 0 });

    // Modal State for "New Project"
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsData, tasksData] = await Promise.all([
                getProjects(),
                getTasks()
            ]);

            setProjects(projectsData);

            const completed = tasksData.filter((t: any) => t.status === 'DONE').length;
            setStats({
                totalProjects: projectsData.length,
                totalTasks: tasksData.length,
                completedTasks: completed
            });

        } catch (error) {
            console.error("Failed to load data", error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProject(newProject);
            setShowModal(false);
            setNewProject({ name: '', description: '' });
            fetchData();
        } catch (error) {
            alert("Failed to create project");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure? This will delete all tasks in this project.")) {
            await deleteProject(id);
            fetchData();
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            <div className="animate-pulse">Loading Workspace...</div>
        </div>
    );

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            {/* Background Gradients */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px]" />
            </div>

            <main className="max-w-6xl mx-auto p-8 pt-28">

                {/* PDF 3.4: Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard label="Total Projects" value={stats.totalProjects} />
                    <StatCard label="Total Tasks" value={stats.totalTasks} />
                    <StatCard label="Completed Tasks" value={stats.completedTasks} />
                </div>

                {/* Projects Header */}
                <div className="flex justify-between items-end mb-8 border-b border-neutral-800 pb-4">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Your Projects</h2>
                        <p className="text-neutral-500 mt-1">Manage and track your ongoing work</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        + New Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-3 text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
                            <p className="text-neutral-500 mb-4">No projects yet</p>
                            <button onClick={() => setShowModal(true)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Create your first project &rarr;</button>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="card group relative hover:-translate-y-1 transition-transform duration-300">
                                <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" />

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                                    <span className="text-xs text-neutral-500 bg-neutral-800/50 px-2 py-1 rounded-md border border-neutral-800">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="text-neutral-400 text-sm mb-6 h-10 line-clamp-2 leading-relaxed">{project.description}</p>

                                <div className="flex justify-end pt-4 border-t border-neutral-800 relative z-20">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(project.id);
                                        }}
                                        className="text-neutral-500 hover:text-red-400 text-xs font-medium transition-colors px-2 py-1 hover:bg-red-500/10 rounded"
                                    >
                                        Delete Project
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    <div className="bg-[#171717] border border-[#262626] p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-white mb-1">New Project</h2>
                        <p className="text-neutral-400 text-sm mb-6">Create a space for your tasks</p>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Project Name</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. Website Redesign"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Description</label>
                                <textarea
                                    className="input-field min-h-[100px] resize-none"
                                    placeholder="What is this project about?"
                                    rows={3}
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-700 transition-colors font-medium border border-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-medium shadow-lg shadow-indigo-500/20"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

