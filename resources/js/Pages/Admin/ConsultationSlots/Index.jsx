import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Index({ days = [], slots = {} }) {
    const [timeByDate, setTimeByDate] = useState(
        () => days.reduce((acc, day) => ({ ...acc, [day.date]: '' }), {})
    );

    const form = useForm({
        slot_date: '',
        slot_time: '',
    });

    const orderedSlots = useMemo(() => {
        return days.map((day) => ({
            ...day,
            times: slots[day.date] || [],
        }));
    }, [days, slots]);

    const addSlot = (date) => {
        const time = (timeByDate[date] || '').trim();
        if (!time) return;

        form
            .transform(() => ({
                slot_date: date,
                slot_time: time,
            }))
            .post(route('admin.consultation-slots.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setTimeByDate((prev) => ({ ...prev, [date]: '' }));
                form.reset();
            },
            onFinish: () => {
                // Reset transform callback to default behavior for next requests.
                form.transform((data) => data);
            },
        });
    };

    const removeSlot = (date, time) => {
        router.delete(route('admin.consultation-slots.destroy'), {
            data: {
                slot_date: date,
                slot_time: time,
            },
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Консультации: свободное время
                </h2>
            }
        >
            <Head title="Админка - Слоты консультаций" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <p className="text-sm text-gray-600 mb-6">
                            Управление слотами на ближайшие 7 дней. Эти слоты отображаются в форме записи на консультацию.
                        </p>

                        <div className="space-y-4">
                            {orderedSlots.map((day) => (
                                <div key={day.date} className="border border-gray-200 rounded-xl p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {day.day_name} {day.day_num} {day.month}
                                            </h3>
                                            <p className="text-xs text-gray-500">{day.date}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={timeByDate[day.date] || ''}
                                                onChange={(e) =>
                                                    setTimeByDate((prev) => ({
                                                        ...prev,
                                                        [day.date]: e.target.value,
                                                    }))
                                                }
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addSlot(day.date)}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500"
                                            >
                                                <Plus size={16} />
                                                Добавить
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {day.times.length > 0 ? (
                                            day.times.map((time) => (
                                                <div
                                                    key={`${day.date}-${time}`}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200"
                                                >
                                                    <span className="text-sm font-medium text-gray-700">{time}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSlot(day.date, time)}
                                                        className="text-red-600 hover:text-red-500"
                                                        title="Удалить слот"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">Слоты не добавлены</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(form.errors.slot_date || form.errors.slot_time) && (
                            <div className="mt-4 text-sm text-red-600">
                                {form.errors.slot_date || form.errors.slot_time}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
