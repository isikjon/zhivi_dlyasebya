import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Check, X, Edit3 } from 'lucide-react';

export const EditableText = ({ section, itemKey, children, className = "", tag: Tag = "span" }) => {
    const { auth, siteContent } = usePage().props;
    const isAdmin = auth?.is_admin;
    
    const initialValue = siteContent?.[section]?.[itemKey] || children;
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [tempValue, setTempValue] = useState(initialValue);
    
    const { post, processing } = useForm({
        page: 'home',
        section: section,
        key: itemKey,
        value: ''
    });

    const handleDoubleClick = (e) => {
        if (!isAdmin) return;
        e.preventDefault();
        setTempValue(value);
        setIsEditing(true);
    };

    const handleSave = () => {
        // Нам нужно найти ID контента. Для простоты в этом демо мы будем отправлять section/key
        // Но лучше передавать ID. Для этого расширим API.
        // Пока сделаем через специальный роут обновления по ключам.
        
        const formData = {
            page: 'home',
            section: section,
            key: itemKey,
            value: tempValue
        };

        // Мы используем существующий роут, но нам нужен ID. 
        // В реальном приложении мы бы получили ID из siteContent.
        // Для быстрого решения добавим поиск по ключам в контроллер.
        
        post(route('admin.content.update_by_key', formData), {
            onSuccess: () => {
                setValue(tempValue);
                setIsEditing(false);
            }
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (!isAdmin) {
        return <Tag className={className}>{value}</Tag>;
    }

    if (isEditing) {
        return (
            <Tag className={`${className} relative group bg-quantum-amber/10 rounded px-1 border border-quantum-amber/30 min-w-[20px] inline-block`}>
                <textarea
                    autoFocus
                    className="bg-transparent border-none outline-none text-inherit font-inherit w-full resize-none p-0 focus:ring-0"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSave();
                        }
                        if (e.key === 'Escape') handleCancel();
                    }}
                />
                <div className="absolute -top-8 right-0 flex items-center space-x-1 bg-quantum-graphite border border-white/10 rounded shadow-xl p-1 z-[100]">
                    <button onClick={handleSave} disabled={processing} className="p-1 hover:bg-green-500/20 text-green-400 rounded">
                        <Check size={14} />
                    </button>
                    <button onClick={handleCancel} className="p-1 hover:bg-red-500/20 text-red-400 rounded">
                        <X size={14} />
                    </button>
                </div>
            </Tag>
        );
    }

    return (
        <Tag 
            onDoubleClick={handleDoubleClick}
            className={`${className} relative group cursor-edit hover:outline hover:outline-1 hover:outline-quantum-amber/50 hover:bg-quantum-amber/5 transition-all rounded px-1`}
            title="Двойной клик для редактирования"
        >
            {value}
            <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-quantum-amber text-quantum-emerald rounded-full p-1 shadow-lg pointer-events-none">
                <Edit3 size={10} />
            </div>
        </Tag>
    );
};
