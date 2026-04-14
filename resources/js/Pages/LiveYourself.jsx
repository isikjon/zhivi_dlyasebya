import Layout from '@/../../src/components/Layout';
import LiveYourselfPage from '@/../../src/pages/LiveYourselfPage';
import { Head } from '@inertiajs/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export default function LiveYourself({ auth, siteContent, seo }) {
    return (
        <MemoryRouter initialEntries={['/live-yourself']}>
            <Head>
                <title>{seo?.title || 'Живи себя'}</title>
                <meta name="description" content={seo?.description || ''} />
                <meta name="keywords" content={seo?.keywords || ''} />
                <meta property="og:title" content={seo?.og_title || seo?.title || ''} />
                <meta property="og:description" content={seo?.og_description || seo?.description || ''} />
                {seo?.og_image && <meta property="og:image" content={`/storage/${seo.og_image}`} />}
                {seo?.additional_tags && <script dangerouslySetInnerHTML={{ __html: seo.additional_tags }} />}
            </Head>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="live-yourself" element={<LiveYourselfPage />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}
