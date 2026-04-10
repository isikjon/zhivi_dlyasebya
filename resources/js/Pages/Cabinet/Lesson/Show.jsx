import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, FileText, Download, CheckCircle2, PlayCircle, Music, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Show({ lesson, course, is_completed }) {
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
            onFinish: () => setProcessing(false),
        });
    };

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
                                {lesson.module.title}
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        {prevLesson && (
                            <Link href={route('cabinet.lesson.show', prevLesson.id)} className="p-2 text-quantum-ivory/40 hover:text-quantum-amber transition-colors">
                                <ChevronLeft size={20} />
                            </Link>
                        )}
                        <span className="text-xs font-bold text-quantum-ivory/20 px-2 tracking-tighter">
                            {currentIndex + 1} / {allLessons.length}
                        </span>
                        {nextLesson && (
                            <Link href={route('cabinet.lesson.show', nextLesson.id)} className="p-2 text-quantum-ivory/40 hover:text-quantum-amber transition-colors">
                                <ChevronRight size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`${lesson.title} - ${course.title}`} />

            <div className="py-12 px-4">
                <div className="mx-auto max-w-5xl space-y-8">
                    
                    {/* Видео плеер */}
                    {(lesson.video_url || isVideoFile) && (
                        <div className="bg-black rounded-[40px] shadow-2xl border border-white/5 aspect-video relative group text-white" style={{ overflow: 'visible' }}>
                            {isVideoFile ? (
                                <video 
                                    controls 
                                    className="w-full h-full object-contain rounded-[40px]"
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

                    {/* Аудио плееры */}
                    {audios.length > 0 && (
                        <div className="space-y-4">
                            {audios.map((audio, idx) => (
                                <div key={audio.id} className="bg-quantum-rose/10 backdrop-blur-xl border border-quantum-rose/20 rounded-[32px] p-6 shadow-xl flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-quantum-rose/20 text-quantum-rose flex items-center justify-center shrink-0">
                                        <Music size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-quantum-rose/60 mb-2">Аудио-практика {audios.length > 1 ? `#${idx + 1}` : ''}: {audio.name}</p>
                                        <audio controls className="w-full h-8 custom-audio-player" key={audio.path}>
                                            <source src={`/stream/${audio.path}`} type="audio/mpeg" />
                                        </audio>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Основной контент */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-quantum-emerald/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl">
                                <h3 className="text-2xl font-bold text-quantum-amber mb-6 font-syne uppercase">Материалы урока</h3>
                                <div className="prose prose-invert max-w-none prose-p:text-quantum-ivory/80 prose-p:font-light prose-headings:font-syne prose-headings:uppercase prose-headings:text-quantum-ivory">
                                    <div 
                                        className="rich-text-content leading-relaxed text-quantum-ivory/80"
                                        dangerouslySetInnerHTML={{ __html: lesson.content || 'В этом уроке нет текстового описания.' }}
                                    />
                                </div>
                            </div>

                            {/* Доп. файлы */}
                            {files.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-xl">
                                    <h4 className="text-lg font-bold text-quantum-ivory uppercase tracking-wider mb-6 flex items-center gap-3 text-white">
                                        <FileText className="text-quantum-amber" size={20} />
                                        Дополнительные материалы
                                    </h4>
                                    <div className="space-y-3">
                                        {files.map(file => (
                                            <a 
                                                key={file.id}
                                                href={`/storage/${file.path}`} 
                                                download
                                                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-quantum-amber/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-quantum-amber/10 text-quantum-amber flex items-center justify-center">
                                                        <FileText size={20} />
                                                    </div>
                                                    <span className="text-sm font-medium text-quantum-ivory/80 group-hover:text-quantum-amber transition-colors truncate max-w-[200px] md:max-w-md">
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <Download size={18} className="text-white/20 group-hover:text-quantum-amber transition-all shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Сайдбар действий */}
                        <div className="space-y-6">
                            <div className="bg-quantum-amber/10 border border-quantum-amber/20 rounded-[32px] p-8 shadow-2xl sticky top-24">
                                <button 
                                    onClick={toggleComplete}
                                    disabled={processing || is_completed}
                                    className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${
                                        is_completed 
                                            ? 'bg-green-600 text-white cursor-default' 
                                            : 'bg-quantum-amber text-quantum-emerald hover:bg-quantum-amber/90'
                                    } ${processing ? 'opacity-50' : ''}`}
                                >
                                    {processing ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : is_completed ? (
                                        <>
                                            <CheckCircle2 size={20} />
                                            <span>Урок пройден</span>
                                        </>
                                    ) : (
                                        <span>Завершить урок</span>
                                    )}
                                </button>

                                <div className="mt-8 space-y-4">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-quantum-ivory/40 text-center">Навигация</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {prevLesson ? (
                                            <Link 
                                                href={route('cabinet.lesson.show', prevLesson.id)}
                                                className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
                                            >
                                                <ChevronLeft size={20} className="text-quantum-ivory/20 group-hover:text-quantum-amber transition-colors" />
                                                <span className="text-[8px] uppercase font-bold text-quantum-ivory/40">Назад</span>
                                            </Link>
                                        ) : <div className="p-4 opacity-0"></div>}
                                        
                                        {nextLesson ? (
                                            <Link 
                                                href={route('cabinet.lesson.show', nextLesson.id)}
                                                className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
                                            >
                                                <ChevronRight size={20} className="text-quantum-ivory/20 group-hover:text-quantum-amber transition-colors" />
                                                <span className="text-[8px] uppercase font-bold text-quantum-ivory/40">Вперед</span>
                                            </Link>
                                        ) : (
                                            <Link 
                                                href={route('cabinet.course.show', course.id)}
                                                className="flex flex-col items-center gap-2 p-4 bg-quantum-amber/5 rounded-2xl border border-quantum-amber/10 hover:border-quantum-amber/30 transition-all group"
                                            >
                                                <CheckCircle2 size={20} className="text-quantum-amber" />
                                                <span className="text-[8px] uppercase font-bold text-quantum-amber">Финиш</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
