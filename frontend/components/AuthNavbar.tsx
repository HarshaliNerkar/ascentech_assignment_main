"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/login';

    const handleNavigate = () => {
        if (isLoginPage) {
            router.push('/register');
        } else {
            router.push('/login');
        }
    };

    return (
        <nav className="glass-nav px-8 py-4 flex justify-center items-center relative">
            <Link href="/">
                <h1 className="text-2xl font-extrabold cursor-pointer text-white tracking-tight">ASCENTech<span className="text-indigo-500">Workspace</span></h1>
            </Link>
            <div className="absolute right-8 flex gap-4 items-center">
                <button
                    onClick={handleNavigate}
                    className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                >
                    {isLoginPage ? 'Create Account' : 'Sign In'}
                </button>
            </div>
        </nav>
    );
}
