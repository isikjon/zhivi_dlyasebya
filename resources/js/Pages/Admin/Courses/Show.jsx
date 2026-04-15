import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, Video, Music, FileText, ChevronDown, ChevronUp, Loader2, Edit2, Check as CheckIcon, X, Upload, Film, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { RichTextEditor } from '@/Components/RichTextEditor';
import { motion, AnimatePresence } from 'framer-motion';

export default function Show({ course }) {
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };
    
    const [editingModuleId, setEditingModuleId] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [previewAsset, setPreviewAsset] = useState(null);
    
    const videoInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const moduleForm = useForm({ title: '' });
    const editModuleForm = useForm({ title: '' });
    const lessonForm = useForm({
        title: '',
        content: '',
        video_url: '',
        video: null,
        audios: [], 
        files: [],  
    });

    const submitModule = (e) => {
        e.preventDefault();
        moduleForm.post(route('admin.modules.store', course.id), {
            onSuccess: () => moduleForm.reset(),
        });
    };

    const startEditingModule = (module) => {
        setEditingModuleId(module.id);
        editModuleForm.setData('title', module.title);
    };

    const submitEditModule = (e, moduleId) => {
        e.preventDefault();
        editModuleForm.put(route('admin.modules.update', moduleId), {
            onSuccess: () => setEditingModuleId(null),
        });
    };

    const startEditingLesson = (lesson, moduleId) => {
        setEditingLesson(lesson);
        setActiveModuleId(moduleId);
        lessonForm.setData({
            title: lesson.title,
            content: lesson.content || '',
            video_url: lesson.video_url || '',
            video: null,
            audios: [],
            files: [],
        });
    };

    const cancelEditingLesson = () => {
        setEditingLesson(null);
        setActiveModuleId(null);
        lessonForm.reset();
    };

    const submitLesson = (e, moduleId) => {
        e.preventDefault();
        const url = editingLesson 
            ? route('admin.lessons.update', editingLesson.id) 
            : route('admin.lessons.store', moduleId);
        
        const module = course.modules.find(m => m.id === moduleId);
        lessonForm.setData('title', module.title);
        
        lessonForm.post(url, {
            onSuccess: () => {
                lessonForm.reset();
                setActiveModuleId(null);
                setEditingLesson(null);
            },
            forceFormData: true,
        });
    };

    const deleteModule = (id) => {
        if (confirm('Вы уверены? Все уроки внутри модуля будут удалены.')) {
            moduleForm.delete(route('admin.modules.destroy', id));
        }
    };

    const deleteLesson = (id) => {
        if (confirm('Удалить этот урок?')) {
            router.delete(route('admin.lessons.destroy', id));
        }
    };

    const removeExistingAsset = (assetId) => {
        if (confirm('Удалить этот файл навсегда?')) {
            router.delete(route('admin.lessons.remove-asset', assetId));
        }
    };

    const handleFileChange = (type, files) => {
        if (!files) return;
        if (type === 'video') {
            const file = Array.isArray(files) ? files[0] : files;
            lessonForm.setData('video', file);
        } else {
            const newFiles = Array.isArray(files) ? files : [files];
            lessonForm.setData(type, [...lessonForm.data[type], ...newFiles]);
        }
    };

    const removeFile = (type, index) => {
        if (type === 'video') {
            lessonForm.setData('video', null);
        } else {
            const newFiles = [...lessonForm.data[type]];
            newFiles.splice(index, 1);
            lessonForm.setData(type, newFiles);
        }
    };

    const FileUploadButton = ({ icon: Icon, label, files, onSelect, inputRef, accept, colorClass, multiple = false, type }) => (
        <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">{label}</label>
            <div 
                onClick={() => inputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-center gap-2 bg-gray-50 border-gray-200 hover:border-quantum-amber/50 hover:bg-quantum-amber/5`}
            >
                <div className="w-10 h-10 rounded-full bg-white text-gray-600 group-hover:text-quantum-amber group-hover:bg-quantum-amber/10 transition-all flex items-center justify-center border border-gray-100">
                    <Icon size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-quantum-amber transition-colors">
                    {multiple ? 'Добавить файлы' : 'Выбрать файл'}
                </span>
                <input 
                    type="file" ref={inputRef} className="hidden" accept={accept} multiple={multiple}
                    onChange={e => {
                        const selectedFiles = Array.from(e.target.files);
                        onSelect(type, multiple ? selectedFiles : selectedFiles[0]);
                        e.target.value = ''; 
                    }}
                />
            </div>
            <div className="space-y-1 mt-2">
                {type === 'video' && lessonForm.data.video && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-[10px] text-blue-700 truncate flex-1 pr-2">{lessonForm.data.video.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile('video'); }} className="text-red-500 hover:text-red-700"><X size={14} /></button>
                    </div>
                )}
                {(type === 'audios' || type === 'files') && lessonForm.data[type].map((f, i) => (
                    <div key={i} className={`flex items-center justify-between p-2 bg-${colorClass}-50 border border-${colorClass}-200 rounded-lg`}>
                        <span className={`text-[10px] text-${colorClass}-700 truncate flex-1 pr-2`}>{f.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(type, i); }} className="text-red-500 hover:text-red-700"><X size={14} /></button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Курс: {course.title}</h2>
                    <div className="text-sm text-gray-700">{course.modules.length} модулей</div>
                </div>
            }
        >
            <Head title={`Админка - ${course.title}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-quantum-amber mb-6 uppercase tracking-wider">Добавить новый модуль</h3>
                        <form onSubmit={submitModule} className="flex gap-4">
                                <input
                                    type="text" placeholder="Название модуля"
                                    className="flex-1 bg-white border border-black rounded-xl px-5 py-3 text-gray-900 focus:ring-quantum-amber placeholder:text-gray-400"
                                    value={moduleForm.data.title} onChange={e => moduleForm.setData('title', e.target.value)} required
                                />
                            <button type="submit" disabled={moduleForm.processing} className="bg-quantum-amber text-quantum-emerald px-8 py-3 rounded-xl font-bold uppercase text-xs hover:bg-quantum-amber/90 transition-all flex items-center gap-2">
                                {moduleForm.processing ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                <span>Создать</span>
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        {course.modules.map(module => (
                            <div key={module.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                <div 
                                    className="bg-gray-50 px-8 py-5 flex justify-between items-center border-b border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors"
                                    onClick={() => toggleModule(module.id)}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 rounded-xl bg-quantum-amber/10 text-quantum-amber flex items-center justify-center font-bold shrink-0">{module.order}</div>
                                        {editingModuleId === module.id ? (
                                            <form onSubmit={(e) => { e.stopPropagation(); submitEditModule(e, module.id); }} className="flex items-center gap-3 flex-1" onClick={e => e.stopPropagation()}>
                                                <input type="text" className="flex-1 bg-white border border-black rounded-xl px-4 py-2 text-sm text-gray-900 focus:ring-quantum-amber placeholder:text-gray-400" value={editModuleForm.data.title} onChange={e => editModuleForm.setData('title', e.target.value)} autoFocus />
                                                <button type="submit" className="text-green-600 hover:text-green-500 p-1"><CheckIcon size={20} /></button>
                                                <button type="button" onClick={() => setEditingModuleId(null)} className="text-red-600 hover:text-red-500 p-1"><X size={20} /></button>
                                            </form>
                                        ) : <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={(e) => { e.stopPropagation(); startEditingModule(module); }} className="p-2 text-gray-600 hover:text-quantum-amber transition-colors"><Edit2 size={20} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteModule(module.id); }} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                        <div className="p-2 text-gray-600">
                                            {expandedModules[module.id] ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedModules[module.id] && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 space-y-3">
                                                {/* Форма редактирования контента урока (всегда открыта, если есть урок или нажат плюс) */}
                                                {(module.lessons.length > 0 || activeModuleId === module.id) && (
                                                    <div className="mt-2 p-8 bg-gray-50/50 border border-gray-100 rounded-2xl animate-in fade-in slide-in-from-top-2 shadow-inner">
                                                        <div className="flex justify-between items-center mb-8">
                                                            <h4 className="text-sm font-bold text-quantum-amber uppercase tracking-widest">
                                                                {module.lessons.length > 0 ? `Контент урока: ${module.title}` : `Новый урок для: ${module.title}`}
                                                            </h4>
                                                            {activeModuleId === module.id && module.lessons.length === 0 && (
                                                                <button onClick={cancelEditingLesson} className="text-gray-600 hover:text-gray-600 flex items-center gap-1 text-xs uppercase font-bold tracking-tighter">
                                                                    <X size={14} /> Отмена
                                                                </button>
                                                            )}
                                                        </div>
                                                        <form 
                                                            onSubmit={(e) => {
                                                                const lesson = module.lessons[0];
                                                                if (lesson && !editingLesson) {
                                                                    setEditingLesson(lesson);
                                                                }
                                                                submitLesson(e, module.id);
                                                            }} 
                                                            className="space-y-8"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                <div className="space-y-4">
                                                                    <FileUploadButton 
                                                                        type="video" 
                                                                        icon={Film} 
                                                                        label={(module.lessons[0] || editingLesson) ? "Заменить видеофайл" : "Видеофайл (MP4/MOV)"} 
                                                                        onSelect={handleFileChange} 
                                                                        inputRef={videoInputRef} 
                                                                        accept="video/*" 
                                                                        colorClass="blue" 
                                                                    />
                                                                    
                                                                    {(module.lessons[0]?.video_url || editingLesson?.video_url) && !lessonForm.data.video && (
                                                                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                                                                            <div className="flex items-center gap-2 text-blue-700 text-xs">
                                                                                <Video size={14} />
                                                                                <span className="truncate max-w-[200px]">Текущее видео загружено</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <button 
                                                                                    type="button"
                                                                                    onClick={() => setPreviewAsset({ type: 'video', path: (module.lessons[0]?.video_url || editingLesson?.video_url), name: 'Видео урока' })}
                                                                                    className="text-[10px] text-blue-600 hover:underline font-bold uppercase"
                                                                                >
                                                                                    Смотреть
                                                                                </button>
                                                                                <span className="text-[10px] text-blue-400 uppercase font-bold">На сервере</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-4">
                                                                        <FileUploadButton type="audios" multiple={true} icon={Music} label="Добавить аудио" files={lessonForm.data.audios} onSelect={handleFileChange} inputRef={audioInputRef} accept="audio/*" colorClass="purple" />
                                                                        
                                                                        {(module.lessons[0]?.assets || editingLesson?.assets)?.filter(a => a.type === 'audio').length > 0 && (
                                                                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                                                {(module.lessons[0]?.assets || editingLesson?.assets).filter(a => a.type === 'audio').map(asset => (
                                                                                    <div key={asset.id} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-xl group hover:border-purple-200 transition-all">
                                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                                            <Music size={14} className="text-purple-600 shrink-0" />
                                                                                            <span className="text-[11px] text-gray-700 truncate">{asset.name}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                                                                            <button type="button" onClick={() => setPreviewAsset(asset)} className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors">👁️</button>
                                                                                            <button type="button" onClick={() => removeExistingAsset(asset.id)} className="p-1.5 text-gray-600 hover:text-red-600 transition-colors">❌</button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <FileUploadButton type="files" multiple={true} icon={FileText} label="Добавить материалы" files={lessonForm.data.files} onSelect={handleFileChange} inputRef={fileInputRef} accept=".pdf,.zip,.doc,.docx,.jpg,.png" colorClass="green" />
                                                                        
                                                                        {(module.lessons[0]?.assets || editingLesson?.assets)?.filter(a => a.type === 'file').length > 0 && (
                                                                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                                                {(module.lessons[0]?.assets || editingLesson?.assets).filter(a => a.type === 'file').map(asset => (
                                                                                    <div key={asset.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl group hover:border-green-200 transition-all">
                                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                                            <FileText size={14} className="text-green-600 shrink-0" />
                                                                                            <span className="text-[11px] text-gray-700 truncate">{asset.name}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                                                                            <button type="button" onClick={() => setPreviewAsset(asset)} className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors">👁️</button>
                                                                                            <button type="button" onClick={() => removeExistingAsset(asset.id)} className="p-1.5 text-gray-600 hover:text-red-600 transition-colors">❌</button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="md:col-span-2 space-y-2">
                                                                <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Текстовое описание</label>
                                                                <RichTextEditor 
                                                                    value={lessonForm.data.content || module.lessons[0]?.content || ''} 
                                                                    onChange={(html) => lessonForm.setData('content', html)} 
                                                                />
                                                            </div>
                                                            <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                                                                {module.lessons.length > 0 && (
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => deleteLesson(module.lessons[0].id)}
                                                                        className="mr-auto text-gray-600 hover:text-red-600 transition-colors p-2"
                                                                        title="Удалить урок целиком"
                                                                    >
                                                                        <Trash2 size={20} />
                                                                    </button>
                                                                )}
                                                                <button type="submit" disabled={lessonForm.processing} className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold uppercase text-xs hover:bg-green-500 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg">
                                                                    {lessonForm.processing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                                                                    <span>{module.lessons.length > 0 ? 'Сохранить изменения' : 'Создать урок'}</span>
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}

                                                {module.lessons.length === 0 && activeModuleId !== module.id && (
                                                    <div className="pt-4">
                                                        <button 
                                                            onClick={() => { setEditingLesson(null); setActiveModuleId(module.id); }}
                                                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-600 hover:border-quantum-amber hover:text-quantum-amber transition-all flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest"
                                                        >
                                                            <Plus size={18} />
                                                            Добавить урок
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Модалка предпросмотра */}
            {previewAsset && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10">
                    <div className="bg-white border border-gray-200 rounded-[40px] w-full max-w-4xl max-h-full overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-3">
                                {previewAsset.type === 'video' && <Video className="text-blue-600" />}
                                {previewAsset.type === 'audio' && <Music className="text-purple-600" />}
                                {previewAsset.type === 'file' && <FileText className="text-green-600" />}
                                <h3 className="text-lg font-bold text-gray-900 truncate max-w-md">{previewAsset.name}</h3>
                            </div>
                            <button 
                                onClick={() => setPreviewAsset(null)}
                                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-gray-50/50">
                            {previewAsset.type === 'video' && (
                                <video controls className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl">
                                    <source src={`/storage/${previewAsset.path}`} type="video/mp4" />
                                </video>
                            )}
                            
                            {previewAsset.type === 'audio' && (
                                <div className="w-full max-w-xl bg-white border border-gray-200 p-10 rounded-[32px] text-center space-y-6 shadow-sm">
                                    <div className="w-20 h-20 bg-quantum-rose/10 text-quantum-rose rounded-full flex items-center justify-center mx-auto">
                                        <Music size={40} />
                                    </div>
                                    <audio controls className="w-full custom-audio-player">
                                        <source src={`/storage/${previewAsset.path}`} type="audio/mpeg" />
                                    </audio>
                                </div>
                            )}
                            
                            {previewAsset.type === 'file' && (
                                <div className="text-center space-y-8">
                                    <div className="w-32 h-32 bg-green-50 text-green-600 rounded-[40px] flex items-center justify-center mx-auto border border-green-100">
                                        <FileText size={64} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 max-w-sm mx-auto">Этот файл можно просмотреть, скачав его на устройство</p>
                                        <a 
                                            href={`/storage/${previewAsset.path}`} 
                                            download 
                                            className="inline-flex items-center gap-3 px-10 py-5 bg-green-600 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-green-500 transition-all shadow-lg"
                                        >
                                            <Upload size={20} className="rotate-180" />
                                            Скачать и открыть
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
