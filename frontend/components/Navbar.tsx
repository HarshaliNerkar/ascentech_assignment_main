"use client";

import { useEffect, useState } from 'react';
import { logoutUser, getUsername } from '../services/auth';
import Link from 'next/link';

export default function Navbar() {
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const name = getUsername();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (name) setUsername(name);
    }, []);

    return (
        <nav className="glass-nav px-8 py-4 flex justify-center items-center relative">
            <Link href="/dashboard">
                <h1 className="text-2xl font-extrabold cursor-pointer text-white tracking-tight">ASCENTech<span className="text-indigo-500">Workspace</span></h1>
            </Link>
            <div className="absolute right-8 flex gap-6 items-center">
                <span className="text-sm text-neutral-400 hidden md:inline">
                    Welcome back{username ? `, ${username}!` : '!'}
                </span>
                <button
                    onClick={logoutUser}
                    className="text-sm text-red-400 hover:text-red-300 font-medium hover:underline transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}