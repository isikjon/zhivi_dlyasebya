import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (flash?.message) {
            setNotification({ type: 'success', text: flash.message });
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setNotification({ type: 'error', text: flash.error });
            const timer = setTimeout(() => setNotification(null), 7000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 relative">
            {/* Глобальные уведомления */}
            {notification && (
                <div className="fixed top-20 right-4 z-[9999] animate-in slide-in-from-right-full duration-300">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
                        notification.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    } backdrop-blur-md`}>
                        {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-sm font-medium">{notification.text}</span>
                        <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/admin/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('admin.dashboard')}
                                    active={route().current('admin.dashboard')}
                                    className="text-gray-800 hover:text-black font-semibold"
                                >
                                    Дашборд
                                </NavLink>
                                <NavLink
                                    href={route('admin.courses.index')}
                                    active={route().current('admin.courses.*')}
                                    className="text-gray-800 hover:text-black font-semibold"
                                >
                                    Курсы
                                </NavLink>
                                <NavLink
                                    href={route('admin.users.index')}
                                    active={route().current('admin.users.*')}
                                    className="text-gray-800 hover:text-black font-semibold"
                                >
                                    Пользователи
                                </NavLink>
                                <NavLink
                                    href={route('admin.content.index')}
                                    active={route().current('admin.content.*')}
                                    className="text-gray-800 hover:text-black font-semibold"
                                >
                                    Контент
                                </NavLink>
                                <NavLink
                                    href={route('admin.seo.index')}
                                    active={route().current('admin.seo.*')}
                                    className="text-gray-800 hover:text-black font-semibold"
                                >
                                    SEO
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out hover:text-gray-900 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-white border border-gray-200 shadow-xl">
                                        <Dropdown.Link
                                            href={route('cabinet.profile.edit')}
                                            className="text-gray-800 hover:bg-gray-100"
                                        >
                                            Профиль
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="text-gray-800 hover:bg-gray-100"
                                        >
                                            Выйти
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden bg-white border-t border-gray-200 shadow-lg'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('admin.dashboard')}
                            active={route().current('admin.dashboard')}
                            className="text-gray-700"
                        >
                            Дашборд
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('admin.courses.index')}
                            active={route().current('admin.courses.*')}
                            className="text-gray-700"
                        >
                            Курсы
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('admin.users.index')}
                            active={route().current('admin.users.*')}
                            className="text-gray-700"
                        >
                            Пользователи
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('admin.content.index')}
                            active={route().current('admin.content.*')}
                            className="text-gray-700"
                        >
                            Контент
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-900">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-600">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('cabinet.profile.edit')} className="text-gray-700">
                                Профиль
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="text-gray-700"
                            >
                                Выйти
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
