'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { MenuIcon, Button, LoadingSpinner } from '@/components';
import { useSearchParams } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function Navbar({ isAdmin }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, loading, fullName } = useAuth();
    const searchParams = useSearchParams();
    const view = searchParams.get('view');
    const menuRef = useRef(null);

    const handleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    return (
        <ThemeProvider attribute="class">
            <header className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-700 shrink-0 bg-white dark:bg-neutral-900 shadow-sm">
                <nav className="flex flex-row items-center gap-6 md:gap-8 text-sm md:text-base font-medium">
                    <Link href="/" className="flex items-center gap-3 text-lg font-bold">
                        <MenuIcon
                            className={
                                !view
                                    ? 'h-7 w-7 text-primary-600 dark:text-primary-400'
                                    : 'h-6 w-6 text-neutral-600 dark:text-neutral-400'
                            }
                        />
                        <span className="hidden md:inline text-neutral-900 dark:text-neutral-50">Restaurant Pro</span>
                        <span className="sr-only">Restaurant Dashboard</span>
                    </Link>
                    {!isAdmin && (
                        <>
                            <Link
                                href="?view=menu"
                                className={
                                    view === 'menu'
                                        ? 'font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1 transition-all'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-all'
                                }
                            >
                                Menu
                            </Link>
                            <Link
                                href="?view=tables"
                                className={
                                    view === 'tables'
                                        ? 'font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1 transition-all'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-all'
                                }
                            >
                                Tables
                            </Link>
                            <Link
                                href="?view=orders"
                                className={
                                    view === 'orders'
                                        ? 'font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1 transition-all'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-all'
                                }
                            >
                                Orders
                            </Link>
                            <Link
                                href="?view=reservations"
                                className={
                                    view === 'reservations'
                                        ? 'font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1 transition-all'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-all'
                                }
                            >
                                Reservations
                            </Link>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <Link
                                href="?view=restaurants"
                                className={
                                    view === 'restaurants'
                                        ? 'font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1 transition-all'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-all'
                                }
                            >
                                Restaurants
                            </Link>
                            <Link
                                href="?view=create"
                                className={
                                    view === 'create'
                                        ? 'font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1 transition-all'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-all'
                                }
                            >
                                Create
                            </Link>
                        </>
                    )}
                </nav>
                {loading && <LoadingSpinner size="sm" />}
                {user && !loading && (
                    <div className="relative" ref={menuRef}>
                        <button
                            className="flex items-center gap-2 font-medium text-neutral-700 dark:text-neutral-300 text-sm md:text-base hover:text-neutral-900 dark:hover:text-neutral-50 transition-all"
                            onClick={handleUserMenu}
                        >
                            <div className="hidden md:flex w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 items-center justify-center font-semibold">
                                {fullName?.charAt(0)?.toUpperCase()}
                            </div>
                            <span>{fullName}</span>
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 top-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-medium p-2 min-w-[200px] z-50">
                                <ThemeToggle />
                                <Button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full mt-2 text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </header>
        </ThemeProvider>
    );
}
