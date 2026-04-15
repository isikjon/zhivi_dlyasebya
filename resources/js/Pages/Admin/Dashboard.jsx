import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Users, PlayCircle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Панель управления
                </h2>
            }
        >
            <Head title="Дашборд" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-3xl border border-gray-200">
                        <div className="p-12 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Добро пожаловать в админ-панель!</h3>
                            <p className="text-gray-500">Здесь вы можете управлять контентом, курсами и пользователями вашего сайта.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
