import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Save, Edit2, Check, X, Share2, Layout as LayoutIcon, Phone, Mail, Send } from 'lucide-react';

export default function Index({ contents }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, processing } = useForm({
        id: '',
        value: ''
    });

    const startEditing = (item) => {
        setEditingId(item.id);
        setData({
            id: item.id,
            value: item.value || ''
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const saveContent = (e) => {
        e.preventDefault();
        post(route('admin.content.update'), {
            onSuccess: () => setEditingId(null),
        });
    };

    // Группировка по секциям
    const groupedContents = contents.reduce((acc, item) => {
        // Скрываем ненужные секции
        const hiddenSections = ['Consultation', 'FreeCourse', 'Hero', 'Programs', 'home', 'MainProgram', 'Features'];
        if (hiddenSections.includes(item.section)) return acc;

        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {});

    const renderItem = (item) => (
        <div key={item.id} className="group relative border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-tighter">
                    {item.key}
                </label>
                {editingId !== item.id ? (
                    <button
                        onClick={() => startEditing(item)}
                        className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 text-xs text-quantum-amber hover:underline transition-opacity"
                    >
                        <Edit2 size={12} />
                        <span>Изм.</span>
                    </button>
                ) : (
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={saveContent}
                            disabled={processing}
                            className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-500 transition-colors"
                        >
                            <Check size={14} />
                            <span>Сохранить</span>
                        </button>
                        <button
                            onClick={cancelEditing}
                            className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-500 transition-colors"
                        >
                            <X size={14} />
                            <span>Отмена</span>
                        </button>
                    </div>
                )}
            </div>

            {editingId === item.id ? (
                <div className="mt-2">
                    {item.type === 'html' || item.value?.length > 100 ? (
                        <textarea
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            className="w-full bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-quantum-amber focus:border-quantum-amber min-h-[100px] font-mono text-sm"
                        />
                    ) : (
                        <input
                            type="text"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            className="w-full bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-quantum-amber focus:border-quantum-amber"
                        />
                    )}
                </div>
            ) : (
                <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {item.value || <span className="text-gray-600 italic">Пусто</span>}
                </div>
            )}
        </div>
    );

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Управление сайтом
                </h2>
            }
        >
            <Head title="Управление сайтом" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Левая колонка: Соцсети и контакты */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-[32px] border border-gray-200">
                                <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6 flex items-center gap-3">
                                    <Share2 className="text-quantum-amber" size={20} />
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                                        Соцсети и Контакты
                                    </h3>
                                </div>
                                <div className="p-8 space-y-8">
                                    {groupedContents['SocialNetworks']?.map(item => renderItem(item))}
                                    {!groupedContents['SocialNetworks'] && (
                                        <p className="text-gray-600 italic text-sm text-center py-4">Данные не найдены</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Правая колонка: Контент лендинга */}
                        <div className="lg:col-span-2 space-y-8">
                            {Object.entries(groupedContents)
                                .filter(([section]) => section !== 'SocialNetworks')
                                .map(([section, items]) => (
                                <div key={section} className="overflow-hidden bg-white shadow-sm sm:rounded-[32px] border border-gray-200">
                                    <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6 flex items-center gap-3">
                                        <LayoutIcon className="text-quantum-amber" size={20} />
                                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                                            Секция: {section}
                                        </h3>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        {items.map((item) => renderItem(item))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
