import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Receipt, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

const statusConfig = {
    success: { label: 'Оплачено', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/40' },
    pending: { label: 'Ожидание', icon: Clock, color: 'text-quantum-amber', bg: 'bg-quantum-amber/20 border-quantum-amber/40' },
    fail: { label: 'Ошибка', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40' },
    refund: { label: 'Возврат', icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/40' },
};

export default function History({ payments }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-display font-bold leading-tight text-quantum-ivory">
                    История платежей
                </h2>
            }
        >
            <Head title="История платежей" />

            <div className="py-12 relative z-10">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {payments.length === 0 ? (
                        <div className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 rounded-[32px] p-12 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Receipt size={28} className="text-quantum-ivory/20" />
                            </div>
                            <p className="text-quantum-ivory/50 mb-2">Платежей пока нет</p>
                            <Link
                                href={route('cabinet.index')}
                                className="text-quantum-amber hover:underline text-sm"
                            >
                                Перейти к курсам
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map(payment => {
                                const status = statusConfig[payment.status] || statusConfig.pending;
                                const StatusIcon = status.icon;
                                return (
                                    <div key={payment.id} className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-xl border ${status.bg} flex items-center justify-center flex-shrink-0`}>
                                            <StatusIcon size={20} className={status.color} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-display font-bold text-quantum-ivory truncate">
                                                {payment.course?.title || 'Курс'}
                                            </h4>
                                            <p className="text-xs text-quantum-ivory/40 font-mono mt-1">
                                                {payment.order_id} &middot; {new Date(payment.created_at).toLocaleDateString('ru-RU', {
                                                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <div className="font-display font-bold text-lg text-quantum-ivory">
                                                {payment.amount} ₽
                                            </div>
                                            <div className={`text-xs font-bold uppercase ${status.color}`}>
                                                {status.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
