import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-display font-bold leading-tight text-quantum-ivory">
                    Настройки профиля
                </h2>
            }
        >
            <Head title="Профиль" />

            <div className="py-12 relative z-10">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <div className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 shadow-2xl sm:rounded-2xl p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 shadow-2xl sm:rounded-2xl p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-quantum-graphite/40 backdrop-blur-md border border-white/10 shadow-2xl sm:rounded-2xl p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
