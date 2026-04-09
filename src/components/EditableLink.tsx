import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Check, X, Link as LinkIcon, Edit3, Loader2 } from 'lucide-react';

export const EditableLink = ({ section, itemKey, children, className = "", defaultHref = "#" }) => {
    const { auth, siteContent } = usePage().props;
    const isAdmin = auth?.is_admin;
    
    // Получаем текущие значения из БД или используем дефолтные
    const savedData = siteContent?.[section]?.[itemKey];
    let initialLabel = children;
    let initialHref = defaultHref;

    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            initialLabel = parsed.label || children;
            initialHref = parsed.href || defaultHref;
        } catch (e) {
            // Если в базе просто строка (старый формат), используем её как label
            initialLabel = savedData;
        }
    }

    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(initialLabel);
    const [href, setHref] = useState(initialHref);
    
    const [tempLabel, setTempLabel] = useState(initialLabel);
    const [tempHref, setTempHref] = useState(initialHref);
    
    const { post, processing } = useForm({
        page: 'home',
        section: section,
        key: itemKey,
        value: ''
    });

    const handleDoubleClick = (e) => {
        if (!isAdmin) return;
        e.preventDefault();
        e.stopPropagation();
        setTempLabel(label);
        setTempHref(href);
        setIsEditing(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const newValue = JSON.stringify({ label: tempLabel, href: tempHref });
        
        post(route('admin.content.update_by_key', {
            page: 'home',
            section: section,
            key: itemKey,
            value: newValue
        }), {
            onSuccess: () => {
                setLabel(tempLabel);
                setHref(tempHref);
                setIsEditing(false);
            }
        });
    };

    if (!isAdmin) {
        return <a href={href} className={className}>{label}</a>;
    }

    return (
        <>
            <span 
                onDoubleClick={handleDoubleClick}
                className={`${className} relative group cursor-edit hover:outline hover:outline-1 hover:outline-quantum-amber/50 hover:bg-quantum-amber/5 transition-all rounded px-1 inline-flex items-center gap-1`}
                title="Двойной клик для редактирования ссылки"
            >
                {label}
                <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-quantum-amber text-quantum-emerald rounded-full p-1 shadow-lg pointer-events-none">
                    <LinkIcon size={10} />
                </div>
            </span>

            {isEditing && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-quantum-graphite border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl shadow-black/50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-quantum-ivory font-syne uppercase">Редактировать ссылку</h3>
                            <button onClick={() => setIsEditing(false)} className="text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-quantum-ivory/40 ml-1">Текст ссылки</label>
                                <input 
                                    type="text"
                                    value={tempLabel}
                                    onChange={(e) => setTempLabel(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-quantum-ivory focus:outline-none focus:border-quantum-amber/50 transition-all"
                                    placeholder="Название кнопки/ссылки"
                                    autoFocus
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-quantum-ivory/40 ml-1">URL (Куда ведет)</label>
                                <input 
                                    type="text"
                                    value={tempHref}
                                    onChange={(e) => setTempHref(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-quantum-ivory focus:outline-none focus:border-quantum-amber/50 transition-all font-mono text-sm"
                                    placeholder="https://... или /path"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-4 rounded-xl border border-white/10 text-quantum-ivory font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-4 rounded-xl bg-quantum-amber text-quantum-emerald font-bold uppercase tracking-widest text-xs hover:bg-quantum-amber/90 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    <span>Сохранить</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
