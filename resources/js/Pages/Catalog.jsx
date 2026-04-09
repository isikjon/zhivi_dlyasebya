import Layout from '@/../../src/components/Layout';
import CatalogPage from '@/../../src/pages/Catalog';
import { Head } from '@inertiajs/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export default function Catalog({ auth, courses }) {
    return (
        <MemoryRouter initialEntries={['/catalog']}>
            <Head title="Каталог программ" />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="catalog" element={<CatalogPage />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}
