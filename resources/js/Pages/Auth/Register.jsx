import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Register({ seo }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="space-y-6">
            <Head title={seo?.title || "Регистрация"} />

            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-quantum-ivory font-syne uppercase tracking-tight">
                    Создать аккаунт
                </h1>
                <p className="text-quantum-ivory/60 text-sm">
                    Начните свой путь трансформации сегодня
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest font-semibold text-quantum-ivory/50 ml-1">
                        Ваше имя
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-quantum-ivory/30 group-focus-within:text-quantum-amber transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-quantum-ivory placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-quantum-amber/50 focus:border-quantum-amber/50 transition-all"
                            placeholder="Иван Иванов"
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1" />
                </div>

                <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest font-semibold text-quantum-ivory/50 ml-1">
                        Email адрес
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-quantum-ivory/30 group-focus-within:text-quantum-amber transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-quantum-ivory placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-quantum-amber/50 focus:border-quantum-amber/50 transition-all"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest font-semibold text-quantum-ivory/50 ml-1">
                            Пароль
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-quantum-ivory/30 group-focus-within:text-quantum-amber transition-colors">
                                <Lock size={16} />
                            </div>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-quantum-ivory placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-quantum-amber/50 focus:border-quantum-amber/50 transition-all text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest font-semibold text-quantum-ivory/50 ml-1">
                            Подтверждение
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-quantum-ivory/30 group-focus-within:text-quantum-amber transition-colors">
                                <Lock size={16} />
                            </div>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-quantum-ivory placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-quantum-amber/50 focus:border-quantum-amber/50 transition-all text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <InputError message={errors.password} />
                    <InputError message={errors.password_confirmation} />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-quantum-amber text-quantum-emerald font-bold py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-quantum-amber/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(230,180,80,0.2)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    {processing ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <span>Создать аккаунт</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="pt-4 text-center">
                <p className="text-quantum-ivory/40 text-sm">
                    Уже есть аккаунт?{' '}
                    <Link
                        href={route('login')}
                        className="text-quantum-amber hover:underline font-medium"
                    >
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}

import GuestLayout from '@/Layouts/GuestLayout';
Register.layout = (page) => <GuestLayout children={page} />;
