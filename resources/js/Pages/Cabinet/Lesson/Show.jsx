import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, FileText, Download, CheckCircle2, PlayCircle, Music, Loader2, List, BookOpen, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Show({ lesson, course, is_completed, completedLessonIds = [] }) {
    const [processing, setProcessing] = useState(false);

    // Поиск следующего и предыдущего урока
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    const prevLesson = allLessons[currentIndex - 1];
    const nextLesson = allLessons[currentIndex + 1];

    const isVideoFile = lesson.video_url && !lesson.video_url.includes('youtube.com') && !lesson.video_url.includes('vimeo.com');

    const audios = lesson.assets?.filter(a => a.type === 'audio') || [];
    const files = lesson.assets?.filter(a => a.type === 'file') || [];

    const toggleComplete = () => {
        if (is_completed) return;
        
        setProcessing(true);
        router.post(route('cabinet.lesson.complete', lesson.id), {}, {
            onSuccess: () => {
                if (nextLesson) {
                    router.visit(route('cabinet.lesson.show', nextLesson.id));
                } else {
                    router.visit(route('cabinet.course.show', course.id));
                }
            },
            onFinish: () => setProcessing(false),
        });
    };

    const allLessonIds = allLessons.map(l => l.id);
    const totalCount = allLessons.length;
    const completedCount = (completedLessonIds || []).filter(id => allLessonIds.includes(id)).length;
    const progressPercent = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('cabinet.course.show', course.id)} className="text-quantum-amber hover:text-quantum-amber/80 transition-colors">
                            <ChevronLeft size={24} />
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-quantum-ivory font-syne uppercase tracking-tight text-white">
                                {lesson.title}
                            </h2>
                            <p className="text-[10px] text-quantum-ivory/40 uppercase tracking-widest font-bold">
                                {course.title}
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-quantum-amber uppercase tracking-widest">Прогресс курса</span>
                            <span className="text-xs font-bold text-quantum-ivory/60">{progressPercent}% пройдено</span>
                        </div>
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-quantum-amber rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`${lesson.title} - ${course.title}`} />

            <div className="py-8 px-4">
                <div className="mx-auto max-w-[1400px]">
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                        
                        {/* Левая колонка: Контент (70%) */}
                        <div className="lg:col-span-7 space-y-8">
                            
                            {/* Видео плеер */}
                            {(lesson.video_url || isVideoFile) && (
                                <div className="bg-black rounded-[32px] shadow-2xl border border-white/5 aspect-video relative group text-white overflow-hidden">
                                    {isVideoFile ? (
                                        <video 
                                            controls 
                                            className="w-full h-full object-contain"
                                            key={lesson.video_url}
                                            controlsList="nodownload"
                                            onContextMenu={e => e.preventDefault()}
                                            style={{ display: 'block' }}
                                        >
                                            <source src={`/stream/${lesson.video_url}`} type="video/mp4" />
                                            Ваш браузер не поддерживает видео.
                                        </video>
                                    ) : (
                                        <iframe
                                            src={lesson.video_url}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                            )}

                            {/* Описание урока */}
                            <div className="bg-quantum-graphite/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-quantum-amber/10 text-quantum-amber flex items-center justify-center">
                                        <BookOpen size={20} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-quantum-ivory font-syne uppercase">Описание урока</h3>
                                </div>
                                <div className="prose prose-invert max-w-none prose-p:text-quantum-ivory/80 prose-p:font-light prose-headings:font-syne prose-headings:uppercase prose-headings:text-quantum-ivory">
                                    <div 
                                        className="rich-text-content leading-relaxed text-quantum-ivory/80"
                                        dangerouslySetInnerHTML={{ __html: lesson.content || 'В этом уроке нет текстового описания.' }}
                                    />
                                </div>
                            </div>

                            {/* Аудио и Материалы в один ряд */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Аудио-практики */}
                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-xl flex flex-col h-[500px]">
                                    <h4 className="text-lg font-bold text-quantum-ivory uppercase tracking-wider mb-6 flex items-center gap-3 text-white shrink-0">
                                        <Music className="text-quantum-rose" size={20} />
                                        Аудио-практики
                                    </h4>
                                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                        {audios.length > 0 ? audios.map((audio, idx) => (
                                            <div key={audio.id} className="bg-quantum-rose/5 border border-quantum-rose/10 rounded-2xl p-4 space-y-3">
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-quantum-rose/60">Практика #{idx + 1}: {audio.name}</p>
                                                <audio controls className="w-full h-8 custom-audio-player" key={audio.path}>
                                                    <source src={`/stream/${audio.path}`} type="audio/mpeg" />
                                                </audio>
                                            </div>
                                        )) : (
                                            <div className="h-full flex flex-col items-center justify-center text-quantum-ivory/20 space-y-2">
                                                <Music size={40} />
                                                <p className="text-xs uppercase font-bold tracking-widest">Нет аудио</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Дополнительные материалы */}
                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-xl flex flex-col h-[500px]">
                                    <h4 className="text-lg font-bold text-quantum-ivory uppercase tracking-wider mb-6 flex items-center gap-3 text-white shrink-0">
                                        <FileText className="text-quantum-amber" size={20} />
                                        Материалы
                                    </h4>
                                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                        {files.length > 0 ? files.map(file => (
                                            <a 
                                                key={file.id}
                                                href={`/storage/${file.path}`} 
                                                download
                                                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-quantum-amber/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-8 h-8 rounded-lg bg-quantum-amber/10 text-quantum-amber flex items-center justify-center shrink-0">
                                                        <FileText size={16} />
                                                    </div>
                                                    <span className="text-xs font-medium text-quantum-ivory/80 group-hover:text-quantum-amber transition-colors truncate">
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <Download size={16} className="text-white/20 group-hover:text-quantum-amber transition-all shrink-0" />
                                            </a>
                                        )) : (
                                            <div className="h-full flex flex-col items-center justify-center text-quantum-ivory/20 space-y-2">
                                                <FileText size={40} />
                                                <p className="text-xs uppercase font-bold tracking-widest">Нет файлов</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Правая колонка: Сайдбар (30%) */}
                        <div className="lg:col-span-3 space-y-6">
                            
                            {/* Блок прогресса и завершения */}
                            <div className="bg-quantum-amber/10 border border-quantum-amber/20 rounded-[32px] p-6 shadow-2xl">
                                <button 
                                    onClick={() => {
                                        if (is_completed) {
                                            if (nextLesson) router.visit(route('cabinet.lesson.show', nextLesson.id));
                                            else router.visit(route('cabinet.course.show', course.id));
                                            return;
                                        }
                                        toggleComplete();
                                    }}
                                    disabled={processing}
                                    className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${
                                        is_completed 
                                            ? 'bg-green-600 text-white hover:bg-green-700' 
                                            : 'bg-quantum-amber text-quantum-emerald hover:bg-quantum-amber/90'
                                    } ${processing ? 'opacity-50' : ''}`}
                                >
                                    {processing ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : is_completed ? (
                                        <>
                                            <CheckCircle2 size={20} />
                                            <span>{nextLesson ? 'Следующий урок' : 'К списку курсов'}</span>
                                        </>
                                    ) : (
                                        <span>Завершить урок</span>
                                    )}
                                </button>

                                <div className="mt-6 pt-6 border-t border-quantum-amber/10 flex justify-between items-center px-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-quantum-amber" />
                                        <span className="text-xs font-bold text-quantum-ivory/60 uppercase">{completedCount} / {totalCount}</span>
                                    </div>
                                    <div className="text-xs font-bold text-quantum-amber uppercase">{Math.min(100, progressPercent)}%</div>
                                </div>
                            </div>

                            {/* Список уроков (Udemy Style) */}
                            <div className="bg-quantum-graphite/60 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl h-[calc(100vh-400px)] sticky top-8">
                                <div className="p-6 bg-white/5 border-b border-white/10 flex items-center gap-3">
                                    <List size={18} className="text-quantum-amber" />
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-white">Содержание курса</h4>
                                </div>
                                
                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                    {course.modules.map((module, mIdx) => (
                                        <div key={module.id} className="border-b border-white/5 last:border-0">
                                            <div className="px-6 py-4 bg-white/2 backdrop-blur-sm">
                                                <p className="text-[9px] uppercase font-bold text-quantum-ivory/30 tracking-tighter mb-1">Модуль {mIdx + 1}</p>
                                                <h5 className="text-[11px] font-bold text-quantum-ivory/80 uppercase">{module.title}</h5>
                                            </div>
                                            <div className="divide-y divide-white/5">
                                                {module.lessons.map((l, lIdx) => {
                                                    const isCurrent = l.id === lesson.id;
                                                    const isDone = completedLessonIds.includes(l.id);
                                                    return (
                                                        <Link 
                                                            key={l.id}
                                                            href={route('cabinet.lesson.show', l.id)}
                                                            className={`flex items-start gap-4 px-6 py-5 transition-all group hover:bg-white/5 ${isCurrent ? 'bg-quantum-amber/10 border-l-2 border-quantum-amber' : ''}`}
                                                        >
                                                            <div className="shrink-0 mt-0.5">
                                                                {isDone ? (
                                                                    <CheckCircle2 size={16} className="text-green-500" />
                                                                ) : isCurrent ? (
                                                                    <PlayCircle size={16} className="text-quantum-amber animate-pulse" />
                                                                ) : (
                                                                    <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-quantum-amber transition-colors"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-[11px] font-medium leading-tight transition-colors ${isCurrent ? 'text-quantum-amber font-bold' : 'text-quantum-ivory/60 group-hover:text-quantum-ivory'}`}>
                                                                    {lIdx + 1}. {l.title}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <div className="flex items-center gap-1 text-[8px] text-quantum-ivory/30 uppercase font-bold tracking-tighter">
                                                                        <PlayCircle size={8} /> 10:00
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
