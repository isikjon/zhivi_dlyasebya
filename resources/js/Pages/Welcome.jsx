import { Head } from '@inertiajs/react';
import Home from '@/../../src/pages/Home';
import Layout from '@/../../src/components/Layout';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export default function Welcome({ auth, courses, siteContent }) {
    return (
        <MemoryRouter initialEntries={['/']}>
            <Head title="Главная" />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home courses={courses} siteContent={siteContent} />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}
