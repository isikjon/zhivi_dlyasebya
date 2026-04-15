import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: 0,
        is_main: false,
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.courses.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Добавить новый курс
                </h2>
            }
        >
            <Head title="Админка - Создать курс" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-200">
                        <form onSubmit={submit} className="max-w-xl">
                            <div className="mb-4">
                                <InputLabel htmlFor="title" value="Название курса" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    className="mt-1 block w-full border-black"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="description" value="Описание" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full border-black rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                    className="mt-1 block w-full border-black"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.price} />
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_main"
                                        checked={data.is_main}
                                        onChange={e => setData('is_main', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ms-2 text-sm text-gray-600 font-bold text-quantum-amber uppercase tracking-widest">Основной курс (для главной страницы)</span>
                                </label>
                                <p className="text-[10px] text-gray-500 mt-1">Если выбрано, этот курс будет отображаться в блоке «Готова вернуться к себе?» на главной странице.</p>
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="image" value="Обложка курса" />
                                <input
                                    id="image"
                                    type="file"
                                    className="mt-1 block w-full text-sm text-gray-500"
                                    onChange={e => setData('image', e.target.files[0])}
                                />
                                <InputError className="mt-2" message={errors.image} />
                            </div>

                            <PrimaryButton disabled={processing}>
                                Создать курс
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
