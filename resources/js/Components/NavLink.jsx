import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-600 text-black focus:border-indigo-700'
                    : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300 focus:text-black focus:border-gray-300') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
