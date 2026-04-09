import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ myCourses, availableCourses }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-display font-bold leading-tight text-quantum-ivory">
                    Личный кабинет
                </h2>
            }
        >
            <Head title="Мои курсы" />

            <div className="py-12 relative z-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-quantum-graphite/40 backdrop-blur-md border border-white/10 shadow-2xl sm:rounded-2xl p-8">
                        <h3 className="text-xl font-display font-bold mb-6 text-quantum-amber uppercase tracking-wider">Мои курсы</h3>
                        {myCourses.length === 0 ? (
                            <div className="bg-white/5 border border-white/5 rounded-xl p-8 text-center">
                                <p className="text-quantum-ivory/50">У вас пока нет купленных курсов.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {myCourses.map(course => (
                                    <Link 
                                        key={course.id} 
                                        href={route('cabinet.course.show', course.id)}
                                        className="group block p-6 bg-quantum-emerald/30 border border-white/5 rounded-xl hover:border-quantum-amber/30 hover:bg-quantum-emerald/50 transition-all duration-300"
                                    >
                                        <h4 className="font-display font-bold text-lg text-quantum-ivory group-hover:text-quantum-amber transition-colors">{course.title}</h4>
                                        <p className="text-sm text-quantum-ivory/60 mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
                                        <div className="mt-4 flex items-center text-quantum-amber text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Продолжить обучение →
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <h3 className="text-xl font-display font-bold mt-12 mb-6 text-quantum-amber uppercase tracking-wider border-t border-white/5 pt-12">Доступные программы</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {availableCourses.map(course => (
                                <div key={course.id} className="p-6 bg-quantum-emerald/20 border border-white/5 rounded-xl flex flex-col">
                                    <h4 className="font-display font-bold text-lg text-quantum-ivory">{course.title}</h4>
                                    <p className="text-sm text-quantum-ivory/60 mt-2 line-clamp-2 leading-relaxed flex-grow">{course.description}</p>
                                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="font-display font-bold text-quantum-rose">{course.price} ₽</span>
                                        <button className="bg-quantum-amber hover:bg-quantum-amber/90 text-quantum-emerald px-6 py-2 rounded-lg font-bold text-sm transition-colors">
                                            Купить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
