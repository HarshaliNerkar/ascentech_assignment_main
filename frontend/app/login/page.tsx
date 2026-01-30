"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '../../services/auth';
import AuthNavbar from '../../components/AuthNavbar';

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await loginUser(formData);
            router.push('/dashboard');
        } catch (err: any) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthNavbar />

            {/* Background Gradients */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
            </div>

            <div className="min-h-screen flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md card">
                    <div className="text-center mb-8">
                        <h1 className="heading-xl bg-gradient-to-br from-white to-gray-400">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-sm text-neutral-400">
                            Enter your credentials to access your workspace
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="input-field"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        <p className="text-center text-sm text-neutral-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}