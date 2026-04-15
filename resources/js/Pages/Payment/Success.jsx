import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';

export default function Success({ payment, courseId }) {
    return (
        <AuthenticatedLayout>
            <Head title="Оплата прошла успешно" />

            <div className="py-16 relative z-10">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 rounded-[32px] p-10 text-center space-y-6">
                        <div className="w-20 h-20 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={40} className="text-green-400" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-display font-bold text-quantum-ivory mb-2">
                                Оплата прошла успешно!
                            </h1>
                            <p className="text-quantum-ivory/60">
                                Курс «{payment.course?.title}» добавлен в ваш личный кабинет
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-quantum-ivory/50">Заказ</span>
                                <span className="text-quantum-ivory font-mono text-xs">{payment.order_id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-quantum-ivory/50">Сумма</span>
                                <span className="text-quantum-ivory font-bold">{payment.amount} ₽</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <Link
                                href={route('cabinet.course.show', courseId)}
                                className="w-full py-4 bg-quantum-amber text-quantum-emerald rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-quantum-amber/90 transition-all flex items-center justify-center gap-2"
                            >
                                <BookOpen size={16} />
                                Перейти к курсу
                            </Link>

                            <Link
                                href={route('cabinet.index')}
                                className="w-full py-3 bg-white/5 border border-white/10 text-quantum-ivory rounded-2xl text-sm hover:border-quantum-amber/30 transition-all flex items-center justify-center gap-2"
                            >
                                Личный кабинет
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
