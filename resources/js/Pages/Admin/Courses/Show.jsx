import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2, Video, Music, FileText, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Show({ course }) {
    const [activeModuleId, setActiveModuleId] = useState(null);
    
    // Форма для модуля
    const moduleForm = useForm({
        title: '',
    });

    // Форма для урока
    const lessonForm = useForm({
        title: '',
        content: '',
        video_url: '',
        video: null,
        audio: null,
        file: null,
    });

    const submitModule = (e) => {
        e.preventDefault();
        moduleForm.post(route('admin.modules.store', course.id), {
            onSuccess: () => moduleForm.reset(),
        });
    };

    const submitLesson = (e, moduleId) => {
        e.preventDefault();
        lessonForm.post(route('admin.lessons.store', moduleId), {
            onSuccess: () => {
                lessonForm.reset();
                setActiveModuleId(null);
            },
            forceFormData: true,
        });
    };

    const deleteModule = (id) => {
        if (confirm('Вы уверены? Все уроки внутри модуля будут удалены.')) {
            moduleForm.delete(route('admin.modules.destroy', id));
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-200">
                        Курс: {course.title}
                    </h2>
                    <div className="text-sm text-gray-400">
                        {course.modules.length} модулей
                    </div>
                </div>
            }
        >
            <Head title={`Админка - ${course.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Добавление модуля */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-quantum-amber mb-4 uppercase tracking-wider">Добавить новый модуль</h3>
                        <form onSubmit={submitModule} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Название модуля (например: Введение)"
                                className="flex-1 bg-gray-900 border-gray-700 rounded-xl text-gray-200 focus:ring-quantum-amber focus:border-quantum-amber"
                                value={moduleForm.data.title}
                                onChange={e => moduleForm.setData('title', e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={moduleForm.processing}
                                className="bg-quantum-amber text-quantum-emerald px-6 py-2 rounded-xl font-bold uppercase text-xs hover:bg-quantum-amber/90 transition-all flex items-center gap-2"
                            >
                                {moduleForm.processing ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                <span>Создать</span>
                            </button>
                        </form>
                    </div>

                    {/* Список модулей */}
                    <div className="space-y-4">
                        {course.modules.length === 0 ? (
                            <div className="text-center py-12 bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl">
                                <p className="text-gray-500">В этом курсе пока нет контента. Создайте первый модуль выше.</p>
                            </div>
                        ) : (
                            course.modules.map(module => (
                                <div key={module.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
                                    <div className="bg-gray-900/50 px-6 py-4 flex justify-between items-center border-b border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-quantum-amber/10 text-quantum-amber flex items-center justify-center font-bold">
                                                {module.order}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-100">{module.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}
                                                className="p-2 text-gray-400 hover:text-quantum-amber transition-colors"
                                                title="Добавить урок"
                                            >
                                                {activeModuleId === module.id ? <ChevronUp size={20} /> : <Plus size={20} />}
                                            </button>
                                            <button
                                                onClick={() => deleteModule(module.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Удалить модуль"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Список уроков */}
                                    <div className="p-4 space-y-2">
                                        {module.lessons.length === 0 && !activeModuleId && (
                                            <p className="text-center py-4 text-xs text-gray-600 italic">Нет уроков</p>
                                        )}
                                        {module.lessons.map(lesson => (
                                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex gap-1.5">
                                                        {lesson.video_url && <Video size={14} className="text-blue-400" />}
                                                        {lesson.audio_path && <Music size={14} className="text-purple-400" />}
                                                        {lesson.file_path && <FileText size={14} className="text-green-400" />}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-300">{lesson.title}</span>
                                                </div>
                                                <button className="text-gray-600 hover:text-red-500 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Форма добавления урока */}
                                        {activeModuleId === module.id && (
                                            <div className="mt-4 p-6 bg-gray-900/80 border border-quantum-amber/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                                                <h4 className="text-sm font-bold text-quantum-amber uppercase tracking-widest mb-4">Новый урок</h4>
                                                <form onSubmit={(e) => submitLesson(e, module.id)} className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Название урока</label>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-gray-800 border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-quantum-amber"
                                                                value={lessonForm.data.title}
                                                                onChange={e => lessonForm.setData('title', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Видео (файл или ссылка)</label>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Ссылка YouTube/Vimeo"
                                                                    className="flex-1 bg-gray-800 border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-quantum-amber"
                                                                    value={lessonForm.data.video_url}
                                                                    onChange={e => lessonForm.setData('video_url', e.target.value)}
                                                                />
                                                                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-gray-300 transition-colors">
                                                                    <Video size={18} />
                                                                    <input 
                                                                        type="file" 
                                                                        className="hidden" 
                                                                        accept="video/*"
                                                                        onChange={e => lessonForm.setData('video', e.target.files[0])}
                                                                    />
                                                                </label>
                                                            </div>
                                                            {lessonForm.data.video && <p className="text-[10px] text-green-400 mt-1">✓ Видео выбрано: {lessonForm.data.video.name}</p>}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Аудио (MP3)</label>
                                                            <input
                                                                type="file"
                                                                accept="audio/*"
                                                                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-quantum-amber/10 file:text-quantum-amber hover:file:bg-quantum-amber/20"
                                                                onChange={e => lessonForm.setData('audio', e.target.files[0])}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Доп. материалы (PDF/ZIP/IMG)</label>
                                                            <input
                                                                type="file"
                                                                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-quantum-amber/10 file:text-quantum-amber hover:file:bg-quantum-amber/20"
                                                                onChange={e => lessonForm.setData('file', e.target.files[0])}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2 space-y-1">
                                                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Текстовое описание</label>
                                                            <textarea
                                                                rows={3}
                                                                className="w-full bg-gray-800 border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-quantum-amber"
                                                                value={lessonForm.data.content}
                                                                onChange={e => lessonForm.setData('content', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveModuleId(null)}
                                                            className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:text-gray-300"
                                                        >
                                                            Отмена
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={lessonForm.processing}
                                                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold uppercase text-xs hover:bg-green-500 transition-all flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {lessonForm.processing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                            <span>Загрузить урок</span>
                                                        </button>
                                                    </div>
                                                    {lessonForm.processing && (
                                                        <div className="mt-2">
                                                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                                <div className="bg-quantum-amber h-1.5 rounded-full animate-pulse w-full"></div>
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 mt-1 text-center italic">Файлы загружаются на сервер, пожалуйста подождите...</p>
                                                        </div>
                                                    )}
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

const Check = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
