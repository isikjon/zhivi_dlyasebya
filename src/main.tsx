import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CourseProvider>
        <App />
      </CourseProvider>
    </AuthProvider>
  </StrictMode>,
);
