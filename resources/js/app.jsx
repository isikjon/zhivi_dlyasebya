import '../../src/index.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../../src/context/AuthContext';
import { CourseProvider } from '../../src/context/CourseContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        const initialCourses = props.initialPage.props.courses || [];

        root.render(
            <AuthProvider>
                <CourseProvider initialCourses={initialCourses}>
                    <App {...props} />
                </CourseProvider>
            </AuthProvider>
        );
    },
    progress: {
        color: '#E6B450',
    },
});
