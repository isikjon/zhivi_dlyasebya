import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Video, Image as ImageIcon, FileText, ChevronRight, ArrowLeft, X, Settings } from 'lucide-react';
import { Button } from '../components/Button';
import { useCourses, Course, Lesson } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { courses, deleteCourse } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user?.isAdmin) return null;

  const categories = [
    { id: 'free', title: 'Бесплатные' },
    { id: 'live_yourself', title: 'Живи Себя' },
    { id: 'archetypes', title: 'Архетипы' },
    { id: 'retreats', title: 'Выездные программы' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <h1 className="font-display text-4xl font-bold">Панель <span className="text-quantum-rose">администратора</span></h1>
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/admin/course/new')}>
            <Plus size={20} className="mr-2" /> Создать курс
          </Button>
          <button 
            onClick={() => navigate('/cabinet')}
            className="flex items-center gap-2 text-quantum-rose hover:text-quantum-amber transition-colors font-medium"
          >
            <ArrowLeft size={20} /> В кабинет
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-6">
            <h2 className="font-display text-2xl font-bold flex items-center gap-3">
              <span className="w-2 h-8 bg-quantum-rose rounded-full"></span>
              {cat.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(c => c.category === cat.id).map((course) => (
                <motion.div 
                  key={course.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/admin/course/${course.id}`)}
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-quantum-rose/50 transition-all cursor-pointer shadow-xl"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Settings size={32} className="text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-1">{course.title}</h4>
                    <p className="text-sm text-quantum-ivory/60 mb-4">{course.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-quantum-ivory/40">{course.lessons?.length || 0} уроков</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Удалить этот курс?')) deleteCourse(course.id);
                        }}
                        className="text-quantum-rose hover:bg-quantum-rose/10 p-2 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {courses.filter(c => c.category === cat.id).length === 0 && (
                <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-3xl text-quantum-ivory/30">
                  В этой категории пока нет курсов
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
