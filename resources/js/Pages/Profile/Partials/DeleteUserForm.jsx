import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('cabinet.profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-display font-bold text-red-500 uppercase tracking-widest">
                    Удаление аккаунта
                </h2>

                <p className="mt-1 text-sm text-quantum-ivory/60">
                    После удаления вашего аккаунта все его ресурсы и данные будут безвозвратно удалены.
                </p>
            </header>

            <button 
                onClick={confirmUserDeletion}
                className="bg-red-600/20 text-red-500 border border-red-600/30 px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-600 hover:text-white transition-colors"
            >
                Удалить аккаунт
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 bg-quantum-graphite text-quantum-ivory border border-white/10 rounded-3xl">
                    <h2 className="text-xl font-display font-bold text-red-500 uppercase tracking-widest mb-4">
                        Вы уверены?
                    </h2>

                    <p className="text-sm text-quantum-ivory/60 mb-6">
                        Это действие необратимо. Пожалуйста, введите ваш пароль для подтверждения удаления.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Пароль"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full bg-white/5 border-white/10 text-quantum-ivory focus:border-red-600 focus:ring-red-600"
                            isFocused
                            placeholder="Ваш пароль"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button 
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-2 rounded-lg font-bold text-sm text-quantum-ivory/60 hover:text-quantum-ivory transition-colors"
                        >
                            Отмена
                        </button>

                        <button 
                            disabled={processing}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            Удалить навсегда
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
