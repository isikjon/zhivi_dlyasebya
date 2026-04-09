import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { PlayCircle, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { EditableImage } from '../components/EditableImage';
import { useCourses } from '../context/CourseContext';

export default function Program() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses } = useCourses();
  const [activeDay, setActiveDay] = useState(1);

  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Курс не найден</h1>
        <Link to="/catalog" className="text-quantum-amber hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  const handleBuy = () => {
    navigate('/thank-you');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/catalog" className="inline-flex items-center text-quantum-ivory/60 hover:text-quantum-amber mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Назад в каталог
      </Link>

      <div className="grid md:grid-cols-[1fr_350px] gap-12">
        {/* Main Content */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-4xl md:text-5xl font-bold mb-6 text-quantum-amber"
          >
            {course.title}
          </motion.h1>
          
          <p className="text-quantum-ivory/80 text-lg mb-12 leading-relaxed">
            {course.description || course.subtitle}
          </p>

          {/* Video Player Placeholder */}
          <div className="aspect-video bg-black/20 rounded-3xl overflow-hidden relative mb-12 border border-white/5 group cursor-pointer">
            <EditableImage 
              imageId={`program_video_${id}`}
              defaultSrc={course.image} 
              alt="Video thumbnail" 
              containerClassName="w-full h-full"
              imageClassName="opacity-40 group-hover:opacity-30 transition-opacity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-quantum-rose/20 flex items-center justify-center backdrop-blur-sm border border-quantum-rose/50 group-hover:scale-110 transition-transform">
                <PlayCircle size={40} className="text-quantum-rose ml-2" />
              </div>
            </div>
          </div>

          {/* Days Navigation */}
          <div className="mb-8">
            <h3 className="font-display text-2xl font-bold mb-6">Программа курса</h3>
            <div className="flex flex-col space-y-4">
              {course.lessons.map((lesson, idx) => {
                const day = idx + 1;
                const isLocked = course.category !== 'free' && day > 3; // Example lock logic
                
                return (
                  <button 
                    key={lesson.id}
                    onClick={() => {
                      if (!isLocked) {
                        navigate(`/lesson/${id}/${idx}`);
                      }
                    }}
                    disabled={isLocked}
                    className={`flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${
                      activeDay === day 
                        ? 'bg-white/10 border-quantum-rose shadow-2xl' 
                        : 'bg-white/5 border-white/5 hover:border-quantum-rose/30'
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold ${
                        activeDay === day ? 'bg-quantum-rose text-white' : 'bg-quantum-rose/10 text-quantum-rose'
                      }`}>
                        {day}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{lesson.title}</p>
                        <p className="text-sm text-quantum-ivory/60">Урок {day}</p>
                      </div>
                    </div>
                    {isLocked ? (
                      <Lock size={20} className="text-quantum-ivory/40" />
                    ) : (
                      <div className="flex items-center gap-2 text-quantum-amber text-sm font-medium">
                        Начать <PlayCircle size={20} />
                      </div>
                    )}
                  </button>
                );
              })}
              
              {course.lessons.length === 0 && (
                <p className="text-quantum-ivory/40 text-center py-8 italic">Программа курса скоро появится</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Sticky */}
        <div className="relative">
          <div className="sticky top-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="font-display text-2xl font-bold mb-2 text-quantum-ivory">Начать трансформацию</h3>
            <p className="text-quantum-ivory/60 mb-8 text-sm">Доступ открывается сразу после оплаты</p>
            
            <div className="text-4xl font-display font-bold text-quantum-rose mb-8">
              {course.price}
            </div>

            <Button size="lg" className="w-full mb-4" onClick={handleBuy}>
              {course.category === 'free' ? 'Получить доступ' : 'Купить программу'}
            </Button>
            
            <p className="text-center text-xs text-quantum-ivory/40 mt-4">
              Нажимая на кнопку, вы соглашаетесь с офертой
            </p>

            {/* Progress / Scarcity trigger */}
            {course.category !== 'free' && (
              <div className="mt-8 pt-8 border-t border-quantum-amber/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-quantum-ivory/70">Осталось мест:</span>
                  <span className="font-bold text-quantum-rose">12</span>
                </div>
                <div className="w-full h-2 bg-quantum-rose/10 rounded-full overflow-hidden">
                  <div className="h-full bg-quantum-rose w-[75%] rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
