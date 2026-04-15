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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Зарегистрированные пользователи
                </h2>
            }
        >
            <Head title="Пользователи" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">ФИО</th>
                                            <th className="px-6 py-4 font-medium">Почта</th>
                                            <th className="px-6 py-4 font-medium">Дата регистрации</th>
                                            <th className="px-6 py-4 font-medium text-right">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                                                    Пользователей пока нет
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{user.name}</div>
                                                        {user.is_blocked && (
                                                            <span className="mt-1 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 border border-red-200">
                                                                Заблокирован
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {user.created_at}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => toggleBlock(user.id)}
                                                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                                user.is_blocked
                                                                    ? 'bg-green-600 text-white hover:bg-green-500 focus:ring-green-500'
                                                                    : 'bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500'
                                                            }`}
                                                        >
                                                            {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
