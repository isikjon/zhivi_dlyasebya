import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, RefreshCw, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function Pending({ payment }) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['payment'] });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (payment.status === 'success') {
            router.visit(route('payment.success', payment.order_id));
        }
    }, [payment.status]);

    return (
        <AuthenticatedLayout>
            <Head title="Ожидание оплаты" />

            <div className="py-16 relative z-10">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 rounded-[32px] p-10 text-center space-y-6">
                        <div className="w-20 h-20 bg-quantum-amber/20 border border-quantum-amber/40 rounded-full flex items-center justify-center mx-auto">
                            <Clock size={40} className="text-quantum-amber animate-pulse" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-display font-bold text-quantum-ivory mb-2">
                                Ожидание подтверждения
                            </h1>
                            <p className="text-quantum-ivory/60">
                                Платёж обрабатывается. Страница обновится автоматически.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-quantum-ivory/50">Курс</span>
                                <span className="text-quantum-ivory">{payment.course?.title}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-quantum-ivory/50">Заказ</span>
                                <span className="text-quantum-ivory font-mono text-xs">{payment.order_id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-quantum-ivory/50">Сумма</span>
                                <span className="text-quantum-ivory font-bold">{payment.amount} ₽</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-quantum-ivory/50">Статус</span>
                                <span className="text-quantum-amber font-bold flex items-center gap-1">
                                    <RefreshCw size={12} className="animate-spin" />
                                    Ожидание
                                </span>
                            </div>
                        </div>

                        <Link
                            href={route('cabinet.index')}
                            className="w-full py-3 bg-white/5 border border-white/10 text-quantum-ivory rounded-2xl text-sm hover:border-quantum-amber/30 transition-all flex items-center justify-center gap-2"
                        >
                            Вернуться в кабинет
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
