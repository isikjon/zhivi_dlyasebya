import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login({ status, canResetPassword, seo }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="space-y-6">
            <Head title={seo?.title || "Вход в личный кабинет"} />

            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-quantum-ivory font-syne uppercase tracking-tight">
                    С возвращением
                </h1>
                <p className="text-quantum-ivory/60 text-sm">
                    Войдите, чтобы продолжить обучение
                </p>
            </div>

            {status && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
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

                <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs uppercase tracking-widest font-semibold text-quantum-ivory/50">
                            Пароль
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[10px] uppercase tracking-tighter text-quantum-amber hover:text-quantum-amber/80 transition-colors"
                            >
                                Забыли пароль?
                            </Link>
                        )}
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-quantum-ivory/30 group-focus-within:text-quantum-amber transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-quantum-ivory placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-quantum-amber/50 focus:border-quantum-amber/50 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-quantum-amber focus:ring-quantum-amber/50 focus:ring-offset-0 transition-all"
                        />
                        <span className="ms-2 text-sm text-quantum-ivory/60 group-hover:text-quantum-ivory transition-colors">
                            Запомнить меня
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-quantum-amber text-quantum-emerald font-bold py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-quantum-amber/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(230,180,80,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <span>Войти</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="pt-4 text-center">
                <p className="text-quantum-ivory/40 text-sm">
                    Нет аккаунта?{' '}
                    <Link
                        href={route('register')}
                        className="text-quantum-amber hover:underline font-medium"
                    >
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
}

import GuestLayout from '@/Layouts/GuestLayout';
Login.layout = (page) => <GuestLayout children={page} />;
