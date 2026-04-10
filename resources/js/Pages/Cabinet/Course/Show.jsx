import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlayCircle, Clock, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Show({ course, completedLessonIds = [] }) {
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedCount = completedLessonIds.length;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('cabinet.index')} className="text-quantum-amber hover:text-quantum-amber/80 transition-colors">
                        ← Назад
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-quantum-ivory font-syne uppercase tracking-tight text-white">
                        {course.title}
                    </h2>
                </div>
            }
        >
            <Head title={course.title} />

            <div className="py-12 px-4">
                <div className="mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* Левая колонка: Описание и структура */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-quantum-emerald/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
                                <h3 className="text-2xl font-bold text-quantum-amber mb-4 font-syne uppercase">О курсе</h3>
                                <p className="text-quantum-ivory/80 leading-relaxed font-light whitespace-pre-wrap">
                                    {course.description}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-quantum-ivory font-syne uppercase tracking-tight ml-4 text-white">Программа обучения</h3>
                                
                                {course.modules.map((module, mIdx) => (
                                    <div key={module.id} className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-xl">
                                        <div className="bg-white/5 px-8 py-5 border-b border-white/10 flex justify-between items-center">
                                            <div className="flex items-center gap-4 text-white">
                                                <span className="text-quantum-amber font-bold font-display text-xl">0{mIdx + 1}</span>
                                                <h4 className="text-lg font-bold uppercase tracking-wider">{module.title}</h4>
                                            </div>
                                            <span className="text-xs text-quantum-ivory/40 uppercase tracking-widest font-bold">
                                                {module.lessons.length} уроков
                                            </span>
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {module.lessons.map((lesson, lIdx) => {
                                                const isCompleted = completedLessonIds.includes(lesson.id);
                                                return (
                                                    <Link 
                                                        key={lesson.id} 
                                                        href={route('cabinet.lesson.show', lesson.id)}
                                                        className="flex items-center justify-between px-8 py-5 hover:bg-white/5 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                                                isCompleted 
                                                                    ? 'bg-green-500/20 text-green-500' 
                                                                    : 'bg-quantum-amber/10 text-quantum-amber group-hover:bg-quantum-amber group-hover:text-quantum-emerald'
                                                            }`}>
                                                                {isCompleted ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />}
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-bold transition-colors ${
                                                                    isCompleted ? 'text-quantum-ivory/50' : 'text-quantum-ivory group-hover:text-quantum-amber'
                                                                }`}>
                                                                    Урок {lIdx + 1}: {lesson.title}
                                                                </p>
                                                                {lesson.is_free && !isCompleted && (
                                                                    <span className="text-[10px] text-green-400 uppercase font-bold tracking-tighter">Бесплатный доступ</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={18} className="text-white/20 group-hover:text-quantum-amber group-hover:translate-x-1 transition-all" />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Правая колонка: Статистика и инфо */}
                        <div className="space-y-6">
                            <div className="bg-quantum-amber/10 border border-quantum-amber/20 rounded-[32px] p-8 shadow-2xl sticky top-24">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-quantum-amber rounded-full flex items-center justify-center text-quantum-emerald mx-auto mb-4 shadow-[0_0_30px_rgba(230,180,80,0.3)]">
                                        <BookOpen size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-quantum-ivory font-syne uppercase text-white">Твой прогресс</h4>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-quantum-ivory/60">
                                            <span>Завершено</span>
                                            <span>{progressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-quantum-amber h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                                            <p className="text-2xl font-display font-bold text-quantum-amber">{completedCount}</p>
                                            <p className="text-[10px] uppercase tracking-tighter text-quantum-ivory/40 font-bold text-white">Уроков пройдено</p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                                            <p className="text-2xl font-display font-bold text-quantum-ivory text-white">
                                                {totalLessons}
                                            </p>
                                            <p className="text-[10px] uppercase tracking-tighter text-quantum-ivory/40 font-bold text-white">Всего уроков</p>
                                        </div>
                                    </div>

                                    <Link 
                                        href={route('cabinet.lesson.show', course.modules[0]?.lessons[0]?.id || '')}
                                        className="w-full bg-quantum-amber text-quantum-emerald font-bold py-4 rounded-2xl uppercase tracking-widest text-sm hover:bg-quantum-amber/90 transition-all shadow-lg active:scale-[0.98] block text-center"
                                    >
                                        {completedCount > 0 ? 'Продолжить обучение' : 'Начать обучение'}
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
