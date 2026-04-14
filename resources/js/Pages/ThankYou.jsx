import Layout from '@/../../src/components/Layout';
import ThankYouPage from '@/../../src/pages/ThankYou';
import { Head } from '@inertiajs/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export default function ThankYou({ auth, seo }) {
    return (
        <MemoryRouter initialEntries={['/thank-you']}>
            <Head>
                <title>{seo?.title || 'Спасибо за покупку!'}</title>
            </Head>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="thank-you" element={<ThankYouPage />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}
