import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { Clock, Star, Filter, LayoutGrid, Sparkles, Heart, MapPin, ChevronRight } from 'lucide-react';
import { EditableImage } from '../components/EditableImage';
import { useCourses } from '../context/CourseContext';

export default function Catalog() {
  const { courses } = useCourses();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', title: 'Все программы', icon: LayoutGrid },
    { id: 'free', title: 'Бесплатные', icon: Sparkles },
    { id: 'live_yourself', title: 'Платные курсы', icon: Heart },
  ];

  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-16 text-center md:text-left">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
          Каталог <span className="text-quantum-rose">программ</span>
        </h1>
        <p className="text-quantum-ivory/70 text-lg max-w-2xl">
          Выбери свой путь трансформации. Каждая программа — это шаг навстречу к твоей истинной природе.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Category Module */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-quantum-rose mb-6">Категории</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => {
                  const count = cat.id === 'all' 
                    ? courses.length 
                    : courses.filter(c => c.category === cat.id).length;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                        activeCategory === cat.id 
                          ? 'bg-quantum-rose text-white shadow-lg shadow-quantum-rose/20' 
                          : 'text-quantum-ivory/60 hover:text-quantum-ivory hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <cat.icon size={18} className={activeCategory === cat.id ? 'text-white' : 'text-quantum-rose'} />
                        <span className="font-medium text-sm">{cat.title}</span>
                      </div>
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-white/5 text-quantum-ivory/40'
                      }`}>
                        {count}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] hidden lg:block">
              <h4 className="text-sm font-bold mb-3">Нужна помощь?</h4>
              <p className="text-xs text-quantum-ivory/40 mb-4 leading-relaxed">
                Если вы не знаете, с чего начать, напишите нам в Telegram. Мы поможем подобрать программу.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-[10px] h-9"
                onClick={() => window.open('https://t.me/victoria_neustroeva', '_blank')}
              >
                Связаться
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((prog, i) => (
                <motion.div 
                  key={prog.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group relative bg-white/5 rounded-[40px] overflow-hidden border border-white/5 hover:border-quantum-rose/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <div className="absolute inset-0 bg-quantum-emerald/40 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none"></div>
                    <img 
                      src={prog.image} 
                      alt={prog.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 right-6 z-20 bg-quantum-graphite/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-quantum-rose/10 flex items-center gap-2 pointer-events-none">
                      <Clock size={14} className="text-quantum-rose" />
                      {prog.duration}
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-10 relative flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-quantum-rose"></div>
                      <p className="text-quantum-rose text-[10px] font-bold uppercase tracking-[0.2em]">{prog.subtitle}</p>
                    </div>
                    
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-6 line-clamp-2 leading-tight">{prog.title}</h3>
                    
                    <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div className="font-display text-3xl font-bold text-quantum-ivory">
                          {prog.price}
                        </div>
                        <a href={`/cabinet/course/${prog.id}`} className="text-quantum-rose hover:translate-x-1 transition-transform">
                          <ChevronRight size={24} />
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <a href={`/cabinet/course/${prog.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full py-4 text-xs font-bold uppercase tracking-widest"
                          >
                            Подробнее
                          </Button>
                        </a>
                        <Button 
                          variant={prog.category === 'free' ? 'secondary' : 'primary'}
                          className="flex-1 py-4 text-xs font-bold uppercase tracking-widest"
                          onClick={() => {
                            if (prog.category === 'free') {
                              window.location.href = `/cabinet/course/${prog.id}`;
                            } else {
                              window.open('https://t.me/victoria_neustroeva', '_blank');
                            }
                          }}
                        >
                          {prog.category === 'free' ? 'Начать' : 'Купить'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredCourses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center border border-dashed border-white/10 rounded-[40px] bg-white/2"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Filter size={32} className="text-quantum-ivory/20" />
              </div>
              <h3 className="text-2xl font-bold text-quantum-ivory/60 mb-2">Программ не найдено</h3>
              <p className="text-quantum-ivory/40 max-w-xs mx-auto">В этой категории пока нет доступных программ. Попробуйте выбрать другую.</p>
              <Button 
                variant="outline" 
                className="mt-8"
                onClick={() => setActiveCategory('all')}
              >
                Сбросить фильтр
              </Button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
