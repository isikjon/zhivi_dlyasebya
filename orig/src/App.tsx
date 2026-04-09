import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Program from './pages/Program';
import ThankYou from './pages/ThankYou';
import Cabinet from './pages/Cabinet';
import Admin from './pages/Admin';
import AdminCourseEdit from './pages/AdminCourseEdit';
import Archetypes from './pages/Archetypes';
import Lesson from './pages/Lesson';
import LiveYourselfPage from './pages/LiveYourselfPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="archetypes" element={<Archetypes />} />
          <Route path="live-yourself" element={<LiveYourselfPage />} />
          <Route path="program/:id" element={<Program />} />
          <Route path="lesson/:programId/:dayId" element={<Lesson />} />
          <Route path="thank-you" element={<ThankYou />} />
          <Route path="cabinet" element={<Cabinet />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/course/:id" element={<AdminCourseEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
