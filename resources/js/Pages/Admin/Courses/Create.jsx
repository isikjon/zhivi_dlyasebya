import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.courses.store'));
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Добавить новый курс
                </h2>
            }
        >
            <Head title="Админка - Создать курс" />

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
