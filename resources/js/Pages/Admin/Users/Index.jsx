import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ users }) {
    const { post, delete: destroy } = useForm();

    const toggleBlock = (id) => {
        if (confirm('Изменить статус блокировки пользователя?')) {
            post(route('admin.users.toggle-block', id));
        }
    };

    const deleteUser = (id) => {
        if (confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
            destroy(route('admin.users.destroy', id));
        }
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-200">
                    Зарегистрированные пользователи
                </h2>
            }
        >
            <Head title="Пользователи" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-gray-800 shadow-sm sm:rounded-lg border border-gray-700">
                        <div className="p-6 text-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-700 bg-gray-900/50 text-xs uppercase text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">ФИО</th>
                                            <th className="px-6 py-4 font-medium">Почта</th>
                                            <th className="px-6 py-4 font-medium">Дата регистрации</th>
                                            <th className="px-6 py-4 font-medium text-right">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                    Пользователей пока нет
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-200">{user.name}</div>
                                                        {user.is_blocked && (
                                                            <span className="mt-1 inline-flex items-center rounded-full bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-400 border border-red-800/50">
                                                                Заблокирован
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">
                                                        {user.created_at}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => toggleBlock(user.id)}
                                                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                                                                user.is_blocked
                                                                    ? 'bg-green-600 text-white hover:bg-green-500 focus:ring-green-500'
                                                                    : 'bg-yellow-600 text-white hover:bg-yellow-500 focus:ring-yellow-500'
                                                            }`}
                                                        >
                                                            {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                                        >
                                                            Удалить
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
