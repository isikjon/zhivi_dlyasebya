import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ course }) {
    const { data, setData, post, processing, errors } = useForm({
        title: course.title,
        description: course.description || '',
        price: course.price,
        is_active: course.is_active,
        image: null,
        _method: 'POST', // Используем POST для загрузки файлов, но Laravel поймет как UPDATE если нужно
    });

    const submit = (e) => {
        e.preventDefault();
        // Используем POST с _method: PATCH не работает с файлами в некоторых браузерах/конфигах, 
        // поэтому в контроллере мы разрешили POST на обновление или используем FormData
        post(route('admin.courses.update', course.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Редактировать курс: {course.title}
                </h2>
            }
        >
            <Head title={`Админка - Редактировать ${course.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="max-w-xl">
                            <div className="mb-4">
                                <InputLabel htmlFor="title" value="Название курса" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="description" value="Описание" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.description} />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="price" value="Цена (руб.)" />
                                <TextInput
                                    id="price"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.price} />
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Активен</span>
                                </label>
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="image" value="Обложка курса (оставьте пустым, если не хотите менять)" />
                                {course.image_path && (
                                    <div className="mb-2">
                                        <img src={`/storage/${course.image_path}`} alt="Current cover" className="w-32 h-20 object-cover rounded" />
                                    </div>
                                )}
                                <input
                                    id="image"
                                    type="file"
                                    className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400"
                                    onChange={e => setData('image', e.target.files[0])}
                                />
                                <InputError className="mt-2" message={errors.image} />
                            </div>

                            <PrimaryButton disabled={processing}>
                                Сохранить изменения
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
