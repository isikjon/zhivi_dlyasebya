import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { CreditCard, CheckCircle2, XCircle, Clock, RefreshCw, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

const statusConfig = {
    success: { label: 'Оплачено', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    pending: { label: 'Ожидание', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
    fail: { label: 'Ошибка', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    refund: { label: 'Возврат', icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
};

export default function Index({ payments, stats }) {
    return (
        <AdminLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Платежи</h2>}
        >
            <Head title="Платежи — Админ" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Статистика */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center">
                                <DollarSign size={22} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Общая выручка</p>
                                <p className="text-xl font-bold text-gray-900">{Number(stats.total).toLocaleString('ru-RU')} ₽</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center">
                                <ShoppingCart size={22} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Успешных оплат</p>
                                <p className="text-xl font-bold text-gray-900">{stats.count}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-center">
                                <Clock size={22} className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ожидают оплаты</p>
                                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center">
                                <RefreshCw size={22} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Возвратов</p>
                                <p className="text-xl font-bold text-gray-900">{stats.refunds}</p>
                            </div>
                        </div>
                    </div>

                    {/* Таблица платежей */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <CreditCard size={20} />
                                Все платежи
                            </h3>
                        </div>

                        {payments.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                Платежей пока нет
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Заказ</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Пользователь</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Курс</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Сумма</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Статус</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Дата</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {payments.map(payment => {
                                            const status = statusConfig[payment.status] || statusConfig.pending;
                                            const StatusIcon = status.icon;
                                            return (
                                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-mono text-gray-700">{payment.order_id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{payment.user?.name}</div>
                                                        <div className="text-xs text-gray-500">{payment.user?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">{payment.course?.title}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{payment.amount} ₽</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${status.bg} ${status.color}`}>
                                                            <StatusIcon size={12} />
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(payment.created_at).toLocaleDateString('ru-RU', {
                                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
