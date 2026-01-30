"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/services/auth';
import AuthNavbar from '@/components/AuthNavbar';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await registerUser(formData);
      alert("Account created! Please log in.");
      router.push('/login');
    } catch (err: any) {
      if (typeof err === 'string') {
        setError(err);
      } else if (err.response?.data) {
        const data = err.response.data;
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
          setError(`${firstKey}: ${data[firstKey][0]}`);
        } else {
          setError(JSON.stringify(data));
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />

      {/* Background Gradients */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md card">
          <div className="text-center mb-8">
            <h1 className="heading-xl bg-gradient-to-br from-white to-gray-400">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Start managing your projects like a pro
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
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="Create a password"
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

            <p className="text-center text-sm text-neutral-500">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
