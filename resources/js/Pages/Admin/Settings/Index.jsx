import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Settings, CreditCard, Eye, EyeOff, Save, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function Index({ prodamus }) {
    const [showKey, setShowKey] = useState(false);

    const { data, setData, post, processing } = useForm({
        prodamus_url: prodamus.prodamus_url || '',
        prodamus_secret_key: prodamus.prodamus_secret_key || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.prodamus'));
    };

    const isConfigured = data.prodamus_url && data.prodamus_secret_key;

    return (
        <AdminLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Настройки</h2>}
        >
            <Head title="Настройки — Админ" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Prodamus */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <CreditCard size={20} />
                                Prodamus — Платёжная система
                            </h3>
                            <a
                                href="https://prodamus.ru"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                prodamus.ru <ExternalLink size={12} />
                            </a>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className={`p-4 rounded-xl border text-sm ${
                                isConfigured
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                            }`}>
                                {isConfigured
                                    ? 'Prodamus настроен и готов к приёму платежей'
                                    : 'Заполните данные для подключения приёма оплаты за курсы'}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL магазина Prodamus
                                </label>
                                <input
                                    type="url"
                                    value={data.prodamus_url}
                                    onChange={e => setData('prodamus_url', e.target.value)}
                                    placeholder="https://yourshop.prodamus.link"
                                    className="w-full rounded-md border border-black shadow-sm focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2.5 text-sm placeholder:text-gray-400"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Ссылка на вашу платёжную страницу в Prodamus
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Секретный ключ (Secret Key)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showKey ? 'text' : 'password'}
                                        value={data.prodamus_secret_key}
                                        onChange={e => setData('prodamus_secret_key', e.target.value)}
                                        placeholder="Ваш секретный ключ из личного кабинета Prodamus"
                                        className="w-full rounded-md border border-black shadow-sm focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2.5 pr-12 text-sm placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Найдите в личном кабинете Prodamus → Настройки → API
                                </p>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {processing ? 'Сохранение...' : 'Сохранить настройки'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Инструкция по настройке webhook */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Settings size={20} />
                                Настройка Webhook
                            </h3>
                        </div>

                        <div className="p-6 space-y-4 text-sm text-gray-700">
                            <p>Для автоматического подтверждения оплат настройте Webhook в личном кабинете Prodamus:</p>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>Зайдите в личный кабинет Prodamus</li>
                                <li>Перейдите в раздел <strong>Настройки → Уведомления</strong></li>
                                <li>В поле <strong>URL уведомления</strong> укажите:</li>
                            </ol>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-xs break-all select-all">
                                {window.location.origin}/webhook/prodamus
                            </div>
                            <p className="text-xs text-gray-500">
                                После оплаты Prodamus отправит уведомление на этот URL, и доступ к курсу откроется автоматически.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
