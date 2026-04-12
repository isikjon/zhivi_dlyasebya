import { Head } from '@inertiajs/react';
import Home from '@/../../src/pages/Home';
import Layout from '@/../../src/components/Layout';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export default function Welcome({ auth, courses, siteContent, seo }) {
    return (
        <MemoryRouter initialEntries={['/']}>
            <Head>
                <title>{seo?.title || 'Главная'}</title>
                <meta name="description" content={seo?.description || ''} />
                <meta name="keywords" content={seo?.keywords || ''} />
                <meta property="og:title" content={seo?.og_title || seo?.title || ''} />
                <meta property="og:description" content={seo?.og_description || seo?.description || ''} />
                {seo?.og_image && <meta property="og:image" content={`/storage/${seo.og_image}`} />}
                {seo?.additional_tags && <script dangerouslySetInnerHTML={{ __html: seo.additional_tags }} />}
            </Head>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home courses={courses} siteContent={siteContent} />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}
