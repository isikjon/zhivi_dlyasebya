import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Globe, 
    Settings, 
    FileText, 
    Code, 
    Image as ImageIcon, 
    Save, 
    RefreshCw, 
    CheckCircle2,
    Search,
    Share2
} from 'lucide-react';

export default function Index({ seoSettings, robots, favicon, scripts }) {
    const [activeTab, setActiveTab] = useState('pages');

    const globalForm = useForm({
        robots_txt: robots || '',
        head_scripts: scripts.head || '',
        body_scripts: scripts.body || '',
        favicon: null,
    });

    const sitemapForm = useForm({});

    const submitGlobal = (e) => {
        e.preventDefault();
        globalForm.post(route('admin.seo.update_global'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const generateSitemap = (e) => {
        e.preventDefault();
        sitemapForm.post(route('admin.seo.generate_sitemap'), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Управление SEO и мета-тегами
                </h2>
            }
        >
            <Head title="SEO Настройки" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-200">
                        
                        {/* Табы */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('pages')}
                                className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                                    activeTab === 'pages' ? 'bg-gray-50 text-quantum-amber border-b-2 border-quantum-amber' : 'text-gray-700 hover:text-gray-800'
                                }`}
                            >
                                <Search size={18} /> Страницы
                            </button>
                            <button
                                onClick={() => setActiveTab('global')}
                                className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                                    activeTab === 'global' ? 'bg-gray-50 text-quantum-amber border-b-2 border-quantum-amber' : 'text-gray-700 hover:text-gray-800'
                                }`}
                            >
                                <Globe size={18} /> Глобальные
                            </button>
                            <button
                                onClick={() => setActiveTab('files')}
                                className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                                    activeTab === 'files' ? 'bg-gray-50 text-quantum-amber border-b-2 border-quantum-amber' : 'text-gray-700 hover:text-gray-800'
                                }`}
                            >
                                <FileText size={18} /> Robots & Sitemap
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Таб: Страницы */}
                            {activeTab === 'pages' && (
                                <div className="space-y-8">
                                    {['home', 'catalog', 'login', 'register'].map(page => (
                                        <PageSeoForm key={page} page={page} initialData={seoSettings.find(s => s.page === page)} />
                                    ))}
                                </div>
                            )}

                            {/* Таб: Глобальные */}
                            {activeTab === 'global' && (
                                <form onSubmit={submitGlobal} className="space-y-8 max-w-4xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-600">Мастер-фавикон (512x512px)</label>
                                            <div className="flex items-center gap-4">
                                                {favicon && (
                                                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                                        <img src={`/${favicon}`} alt="Favicon" className="w-8 h-8 object-contain" />
                                                    </div>
                                                )}
                                                <input 
                                                    type="file" 
                                                    onChange={e => globalForm.setData('favicon', e.target.files[0])}
                                                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">
                                                Загрузите квадратное изображение размером <span className="text-quantum-amber">512x512px</span>. 
                                                Система автоматически сгенерирует все форматы: 
                                                <span className="text-quantum-amber ml-1">favicon.ico, 16x16, 32x32, Apple Touch Icon (180x180) и Android Manifest</span>.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                            <Code size={14} className="text-quantum-amber" /> Скрипты в &lt;head&gt; (Метрика, Аналитика)
                                        </label>
                                        <textarea 
                                            value={globalForm.data.head_scripts}
                                            onChange={e => globalForm.setData('head_scripts', e.target.value)}
                                            rows="6"
                                            className="w-full bg-white border-gray-200 rounded-2xl text-sm font-mono text-gray-700 focus:ring-quantum-amber focus:border-quantum-amber"
                                            placeholder="<!-- Google Tag Manager --> ..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                            <Code size={14} className="text-quantum-amber" /> Скрипты в начале &lt;body&gt;
                                        </label>
                                        <textarea 
                                            value={globalForm.data.body_scripts}
                                            onChange={e => globalForm.setData('body_scripts', e.target.value)}
                                            rows="4"
                                            className="w-full bg-white border-gray-200 rounded-2xl text-sm font-mono text-gray-700 focus:ring-quantum-amber focus:border-quantum-amber"
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end">
                                        <button 
                                            type="submit" 
                                            disabled={globalForm.processing}
                                            className="bg-quantum-amber text-quantum-emerald px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-quantum-amber/90 disabled:opacity-50"
                                        >
                                            {globalForm.processing ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                            Сохранить глобальные настройки
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Таб: Robots & Sitemap */}
                            {activeTab === 'files' && (
                                <div className="space-y-12 max-w-4xl">
                                    <form onSubmit={submitGlobal} className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                            <Settings size={14} className="text-quantum-amber" /> Robots.txt
                                        </label>
                                        <textarea 
                                            value={globalForm.data.robots_txt}
                                            onChange={e => globalForm.setData('robots_txt', e.target.value)}
                                            rows="10"
                                            className="w-full bg-white border-gray-200 rounded-2xl text-sm font-mono text-gray-700 focus:ring-quantum-amber focus:border-quantum-amber"
                                        ></textarea>
                                        <div className="flex justify-end">
                                            <button 
                                                type="submit" 
                                                disabled={globalForm.processing}
                                                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-gray-200"
                                            >
                                                Обновить robots.txt
                                            </button>
                                        </div>
                                    </form>

                                    <div className="p-8 bg-gray-50 border border-gray-200 rounded-3xl space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                    <Share2 size={20} className="text-quantum-amber" /> Sitemap.xml
                                                </h4>
                                                <p className="text-sm text-gray-700 mt-1">Автоматическая генерация карты сайта для поисковиков</p>
                                            </div>
                                            <button 
                                                onClick={generateSitemap}
                                                disabled={sitemapForm.processing}
                                                className="bg-quantum-amber text-quantum-emerald px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-quantum-amber/90"
                                            >
                                                {sitemapForm.processing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                                Сгенерировать сейчас
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-700 bg-white p-4 rounded-xl border border-gray-100">
                                            Файл доступен по адресу: <a href="/sitemap.xml" target="_blank" className="text-quantum-amber hover:underline">/sitemap.xml</a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function PageSeoForm({ page, initialData }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        title: initialData?.title || '',
        description: initialData?.description || '',
        keywords: initialData?.keywords || '',
        og_title: initialData?.og_title || '',
        og_description: initialData?.og_description || '',
        og_image: null,
        additional_tags: initialData?.additional_tags || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.seo.update_page', page), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const pageNames = {
        home: 'Главная страница',
        catalog: 'Каталог программ',
        login: 'Страница входа',
        register: 'Страница регистрации',
    };

    return (
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 capitalize">
                    <div className="w-2 h-2 rounded-full bg-quantum-amber"></div>
                    {pageNames[page] || page}
                </h3>
                {recentlySuccessful && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                        <CheckCircle2 size={14} /> Сохранено
                    </div>
                )}
            </div>
            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Основные мета */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Meta Title</label>
                            <input 
                                type="text" 
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full bg-white border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-quantum-amber p-4"
                                placeholder="Заголовок страницы в браузере"
                            />
                            <p className="text-[10px] text-gray-600 mt-1 ml-1">Рекомендуется от 50 до 60 символов.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Meta Description</label>
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="3"
                                className="w-full bg-white border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-quantum-amber p-4"
                                placeholder="Краткое описание для поисковиков"
                            ></textarea>
                            <p className="text-[10px] text-gray-600 mt-1 ml-1">Рекомендуется от 140 до 160 символов.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Keywords</label>
                            <input 
                                type="text" 
                                value={data.keywords}
                                onChange={e => setData('keywords', e.target.value)}
                                className="w-full bg-white border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-quantum-amber p-4"
                                placeholder="ключевые, слова, через, запятую"
                            />
                        </div>
                    </div>

                    {/* Open Graph */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Share2 size={14} className="text-quantum-amber" />
                            <span className="text-[10px] uppercase font-bold text-gray-600">Социальные сети (Open Graph)</span>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">OG Title</label>
                            <input 
                                type="text" 
                                value={data.og_title}
                                onChange={e => setData('og_title', e.target.value)}
                                className="w-full bg-white border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-quantum-amber p-4"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">OG Image</label>
                            <div className="flex items-center gap-4">
                                {initialData?.og_image && (
                                    <div className="w-16 h-10 bg-white rounded border border-gray-200 overflow-hidden">
                                        <img src={`/storage/${initialData.og_image}`} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    onChange={e => setData('og_image', e.target.files[0])}
                                    className="block w-full text-[10px] text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Additional Meta Tags / Scripts</label>
                    <textarea 
                        value={data.additional_tags}
                        onChange={e => setData('additional_tags', e.target.value)}
                        rows="3"
                        className="w-full bg-white border-gray-200 rounded-xl text-sm text-gray-700 font-mono focus:ring-quantum-amber p-4"
                        placeholder="<meta name='robots' content='noindex'> ..."
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-quantum-amber hover:text-quantum-emerald transition-all disabled:opacity-50"
                    >
                        {processing ? 'Сохранение...' : 'Обновить SEO'}
                    </button>
                </div>
            </form>
        </div>
    );
}
