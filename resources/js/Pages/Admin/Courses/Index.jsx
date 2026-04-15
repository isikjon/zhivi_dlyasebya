import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';

export default function Index({ courses }) {
    const { delete: destroy } = useForm();
    const [editingCourse, setEditingCourse] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const editForm = useForm({
        title: '',
        description: '',
        price: 0,
        image: null,
        is_active: true,
        _method: 'PUT' // For Laravel to handle as PUT while sending as FormData
    });

    const deleteCourse = (id) => {
        if (confirm('Вы уверены, что хотите удалить этот курс? Все уроки будут удалены.')) {
            destroy(route('admin.courses.destroy', id));
        }
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        editForm.setData({
            title: course.title,
            description: course.description || '',
            price: course.price,
            image: null,
            is_active: !!course.is_active,
            _method: 'PUT'
        });
        setImagePreview(course.image_path ? `/storage/${course.image_path}` : null);
    };

    const closeEditModal = () => {
        setEditingCourse(null);
        editForm.reset();
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            editForm.setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitEdit = (e) => {
        e.preventDefault();
        
        // Создаем FormData вручную, чтобы точно контролировать поля
        const formData = new FormData();
        formData.append('title', editForm.data.title);
        formData.append('description', editForm.data.description || '');
        formData.append('price', editForm.data.price);
        formData.append('is_active', editForm.data.is_active ? '1' : '0');
        formData.append('_method', 'PUT'); // Эмуляция PUT через POST
        
        if (editForm.data.image) {
            formData.append('image', editForm.data.image);
        }
        
        router.post(route('admin.courses.update', editingCourse.id), formData, {
            onSuccess: () => closeEditModal(),
        });
    };

    const setFree = () => {
        editForm.setData('price', 0);
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Управление курсами
                </h2>
            }
        >
            <Head title="Админка - Курсы" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-6">
                        <Link
                            href={route('admin.courses.create')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs hover:bg-indigo-700 transition-all shadow-lg"
                        >
                            Добавить курс
                        </Link>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Название</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Уроков</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Цена</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {courses.map(course => (
                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 mr-4 overflow-hidden border border-gray-200 flex-shrink-0">
                                                    {course.image_path ? (
                                                        <img src={`/storage/${course.image_path}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-gray-900 font-medium">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600 font-medium">{course.modules_count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {course.price == 0 ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase">Бесплатно</span>
                                            ) : (
                                                <span className="text-gray-900">{course.price} руб.</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-4">
                                            <Link href={route('admin.courses.show', course.id)} className="text-indigo-600 hover:text-indigo-900 font-bold text-xs uppercase tracking-tighter">
                                                Уроки
                                            </Link>
                                            <button onClick={() => openEditModal(course)} className="text-amber-600 hover:text-amber-900 font-bold text-xs uppercase tracking-tighter">
                                                Изм.
                                            </button>
                                            <button onClick={() => deleteCourse(course.id)} className="text-red-600 hover:text-red-900 font-bold text-xs uppercase tracking-tighter">
                                                Удал.
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Модалка редактирования */}
            {editingCourse && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white border border-gray-200 rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Редактировать курс</h3>
                            <button onClick={closeEditModal} className="p-2 text-gray-600 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={submitEdit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Название курса</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-white border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-quantum-amber"
                                    value={editForm.data.title}
                                    onChange={e => editForm.setData('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Описание</label>
                                <textarea 
                                    className="w-full bg-white border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-quantum-amber min-h-[100px]"
                                    value={editForm.data.description}
                                    onChange={e => editForm.setData('description', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Цена (руб.)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            className="flex-1 bg-white border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-quantum-amber"
                                            value={editForm.data.price}
                                            onChange={e => editForm.setData('price', e.target.value)}
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={setFree}
                                            className={`px-4 rounded-xl font-bold text-[10px] uppercase transition-all border ${
                                                editForm.data.price == 0 
                                                ? 'bg-green-100 border-green-500 text-green-700' 
                                                : 'bg-white border-gray-300 text-gray-600 hover:border-green-500/50'
                                            }`}
                                        >
                                            Бесплатно
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Статус</label>
                                    <button 
                                        type="button"
                                        onClick={() => editForm.setData('is_active', !editForm.data.is_active)}
                                        className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase transition-all border flex items-center justify-center gap-2 ${
                                            editForm.data.is_active 
                                            ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                            : 'bg-white border-gray-300 text-gray-600'
                                        }`}
                                    >
                                        {editForm.data.is_active ? <CheckCircle2 size={14} /> : null}
                                        {editForm.data.is_active ? 'Активен' : 'Черновик'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Обложка курса</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-quantum-amber/50 hover:bg-quantum-amber/5 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:text-quantum-amber group-hover:bg-quantum-amber/10 transition-all">
                                            <Upload size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-quantum-amber transition-colors">Выбрать фото</span>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[120px]">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center space-y-1">
                                                <ImageIcon size={24} className="mx-auto text-gray-300" />
                                                <span className="text-[10px] text-gray-300 uppercase font-bold">Нет превью</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-600 italic px-1">
                                    * Рекомендуемый размер обложки: 1280x720px (16:9) или 1080x1080px. Макс. вес: 2MB.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 py-4 rounded-xl font-bold uppercase text-xs text-gray-600 hover:text-gray-600 transition-colors"
                                >
                                    Отмена
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={editForm.processing}
                                    className="flex-[2] bg-green-600 text-white py-4 rounded-xl font-bold uppercase text-xs hover:bg-green-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                                >
                                    {editForm.processing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                    <span>Сохранить изменения</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
