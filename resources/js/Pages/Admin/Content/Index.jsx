import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Save, Edit2, Check, X } from 'lucide-react';

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
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-200">
                    Редактор контента (Лендинг)
                </h2>
            }
        >
            <Head title="Редактор контента" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {Object.entries(groupedContents).map(([section, items]) => (
                            <div key={section} className="overflow-hidden bg-gray-800 shadow-sm sm:rounded-lg border border-gray-700">
                                <div className="border-b border-gray-700 bg-gray-900/50 px-6 py-4">
                                    <h3 className="text-lg font-medium text-quantum-amber uppercase tracking-wider">
                                        Секция: {section}
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="group relative border-b border-gray-700/50 pb-6 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                                    Ключ: {item.key}
                                                </label>
                                                {editingId !== item.id ? (
                                                    <button
                                                        onClick={() => startEditing(item)}
                                                        className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 text-xs text-quantum-amber hover:underline transition-opacity"
                                                    >
                                                        <Edit2 size={12} />
                                                        <span>Редактировать</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={saveContent}
                                                            disabled={processing}
                                                            className="flex items-center space-x-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                                                        >
                                                            <Check size={14} />
                                                            <span>Сохранить</span>
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 transition-colors"
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
                                                            className="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-200 focus:ring-quantum-amber focus:border-quantum-amber min-h-[150px] font-mono text-sm"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={data.value}
                                                            onChange={(e) => setData('value', e.target.value)}
                                                            className="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-200 focus:ring-quantum-amber focus:border-quantum-amber"
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                    {item.value || <span className="text-gray-600 italic">Пусто</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
