import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('cabinet.profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-display font-bold text-quantum-amber uppercase tracking-widest">
                    Данные профиля
                </h2>

                <p className="mt-1 text-sm text-quantum-ivory/60">
                    Обновите информацию вашего аккаунта и адрес электронной почты.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Имя" className="text-quantum-ivory/80" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full bg-white/5 border-white/10 text-quantum-ivory focus:border-quantum-amber focus:ring-quantum-amber"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-quantum-ivory/80" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-white/5 border-white/10 text-quantum-ivory focus:border-quantum-amber focus:ring-quantum-amber"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-quantum-ivory/80">
                            Ваш email не подтвержден.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-quantum-amber underline hover:text-quantum-amber/80 focus:outline-none"
                            >
                                Нажмите здесь, чтобы отправить письмо еще раз.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-500">
                                Новая ссылка для подтверждения была отправлена на ваш адрес.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button 
                        disabled={processing}
                        className="bg-quantum-amber text-quantum-emerald px-6 py-2 rounded-lg font-bold text-sm hover:bg-quantum-amber/90 transition-colors disabled:opacity-50"
                    >
                        Сохранить
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-quantum-ivory/60">
                            Сохранено.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
