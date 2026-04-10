import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, PlayCircle, Clock, Sparkles, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function Dashboard({ myCourses, availableCourses }) {
    const enroll = (courseId) => {
        router.post(route('cabinet.course.enroll', courseId));
    };

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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Мои курсы */}
                    <div>
                        <h3 className="text-xl font-display font-bold mb-6 text-quantum-amber uppercase tracking-wider px-2">Мои курсы</h3>
                        {myCourses.length === 0 ? (
                            <div className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 rounded-[32px] p-12 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen size={28} className="text-quantum-ivory/20" />
                                </div>
                                <p className="text-quantum-ivory/50 mb-2">У вас пока нет курсов</p>
                                <p className="text-quantum-ivory/30 text-sm">Выберите курс из доступных программ ниже</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myCourses.map(course => {
                                    const isComplete = course.progress_percent === 100;
                                    return (
                                        <Link 
                                            key={course.id} 
                                            href={route('cabinet.course.show', course.id)}
                                            className="group block bg-quantum-graphite/40 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden hover:border-quantum-amber/30 transition-all duration-500 hover:-translate-y-1 shadow-xl"
                                        >
                                            {/* Обложка */}
                                            <div className="aspect-[16/9] relative overflow-hidden">
                                                {course.image_path ? (
                                                    <img src={`/storage/${course.image_path}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-quantum-amber/10 to-quantum-rose/10 flex items-center justify-center">
                                                        <BookOpen size={40} className="text-quantum-amber/30" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-quantum-graphite via-transparent to-transparent"></div>
                                                
                                                {/* Бейдж статуса */}
                                                <div className="absolute top-4 right-4">
                                                    {isComplete ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full backdrop-blur-md">
                                                            <CheckCircle2 size={14} className="text-green-400" />
                                                            <span className="text-[10px] font-bold uppercase text-green-400">Пройден</span>
                                                        </div>
                                                    ) : course.progress_percent > 0 ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-quantum-amber/20 border border-quantum-amber/40 rounded-full backdrop-blur-md">
                                                            <PlayCircle size={14} className="text-quantum-amber" />
                                                            <span className="text-[10px] font-bold uppercase text-quantum-amber">В процессе</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
                                                            <Clock size={14} className="text-quantum-ivory/60" />
                                                            <span className="text-[10px] font-bold uppercase text-quantum-ivory/60">Не начат</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Цена */}
                                                <div className="absolute top-4 left-4">
                                                    <div className={`px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-bold uppercase ${
                                                        course.price == 0 
                                                        ? 'bg-green-500/20 border border-green-500/40 text-green-400' 
                                                        : 'bg-white/10 border border-white/20 text-quantum-ivory/80'
                                                    }`}>
                                                        {course.price == 0 ? 'Бесплатно' : `${course.price} ₽`}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Контент */}
                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <h4 className="font-display font-bold text-lg text-quantum-ivory group-hover:text-quantum-amber transition-colors leading-tight">
                                                        {course.title}
                                                    </h4>
                                                    {course.description && (
                                                        <p className="text-sm text-quantum-ivory/50 mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
                                                    )}
                                                </div>

                                                {/* Прогресс-бар */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                                                        <span className="text-quantum-ivory/40">Прогресс</span>
                                                        <span className={isComplete ? 'text-green-400' : 'text-quantum-amber'}>
                                                            {course.progress_percent}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-green-500' : 'bg-quantum-amber'}`}
                                                            style={{ width: `${course.progress_percent}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-[10px] text-quantum-ivory/30">
                                                        <span>{course.completed_lessons} из {course.total_lessons} уроков</span>
                                                        <span className="flex items-center gap-1 text-quantum-amber opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {isComplete ? 'Повторить' : course.progress_percent > 0 ? 'Продолжить' : 'Начать'} <ChevronRight size={12} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Доступные программы */}
                    {availableCourses.length > 0 && (
                        <div>
                            <h3 className="text-xl font-display font-bold mb-6 text-quantum-amber uppercase tracking-wider border-t border-white/5 pt-12 px-2">Доступные программы</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {availableCourses.map(course => (
                                    <div key={course.id} className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-xl">
                                        {/* Обложка */}
                                        <div className="aspect-[16/9] relative overflow-hidden">
                                            {course.image_path ? (
                                                <img src={`/storage/${course.image_path}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-quantum-rose/10 to-quantum-amber/5 flex items-center justify-center">
                                                    <Sparkles size={40} className="text-quantum-rose/30" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-quantum-graphite via-transparent to-transparent"></div>
                                            
                                            {/* Цена */}
                                            <div className="absolute bottom-4 left-4">
                                                <div className={`px-4 py-2 rounded-xl backdrop-blur-md font-display font-bold text-lg ${
                                                    course.price == 0 
                                                    ? 'bg-green-500/20 border border-green-500/40 text-green-400' 
                                                    : 'bg-white/10 border border-white/20 text-quantum-ivory'
                                                }`}>
                                                    {course.price == 0 ? 'Бесплатно' : `${course.price} ₽`}
                                                </div>
                                            </div>

                                            {course.total_lessons > 0 && (
                                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-md text-[10px] font-bold text-quantum-ivory/60 uppercase">
                                                    {course.total_lessons} уроков
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <h4 className="font-display font-bold text-lg text-quantum-ivory leading-tight">{course.title}</h4>
                                            <p className="text-sm text-quantum-ivory/50 mt-2 line-clamp-2 leading-relaxed flex-grow">{course.description}</p>
                                            
                                            <button 
                                                onClick={() => enroll(course.id)}
                                                className={`mt-6 w-full py-4 rounded-2xl font-bold uppercase text-sm tracking-widest transition-all active:scale-[0.98] shadow-lg ${
                                                    course.price == 0 
                                                    ? 'bg-quantum-amber text-quantum-emerald hover:bg-quantum-amber/90 shadow-quantum-amber/10' 
                                                    : 'bg-white/5 border border-white/10 text-quantum-ivory hover:border-quantum-amber/30 hover:text-quantum-amber'
                                                }`}
                                            >
                                                {course.price == 0 ? 'Начать бесплатно' : 'Купить курс'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
