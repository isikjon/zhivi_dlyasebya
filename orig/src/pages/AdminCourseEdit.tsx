import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Trash2, ArrowLeft, X, Settings, GripVertical } from 'lucide-react';
import { Button } from '../components/Button';
import { useCourses, Course, Lesson } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminCourseEdit() {
  const { courses, addCourse, updateCourse } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Course['category']>('live_yourself');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Load course data if editing
  useEffect(() => {
    if (id && id !== 'new') {
      const course = courses.find(c => c.id === id);
      if (course) {
        setTitle(course.title);
        setSubtitle(course.subtitle);
        setDescription(course.description || '');
        setCategory(course.category);
        setPrice(course.price);
        setDuration(course.duration);
        setLessons(course.lessons || []);
      }
    }
  }, [id, courses]);

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Новый урок',
      videoUrl: '',
      audioUrl: '',
      slidesUrl: '',
      slideImages: [],
      content: '',
      task: ''
    };
    setLessons([...lessons, newLesson]);
    setEditingLesson(newLesson);
  };

  const handleRemoveLesson = (lessonId: string) => {
    setLessons(lessons.filter(l => l.id !== lessonId));
  };

  const handleOpenLessonEditor = (lesson: Lesson) => {
    setEditingLesson({ ...lesson });
  };

  const handleSaveLesson = () => {
    if (editingLesson) {
      setLessons(lessons.map(l => l.id === editingLesson.id ? editingLesson : l));
      setEditingLesson(null);
    }
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && subtitle && price && duration) {
      if (id && id !== 'new') {
        const originalCourse = courses.find(c => c.id === id);
        const updatedCourse: Course = {
          ...originalCourse!,
          title,
          subtitle,
          description,
          category,
          price,
          duration,
          lessons
        };
        updateCourse(updatedCourse);
        alert('Курс успешно обновлен!');
      } else {
        const newCourse: Course = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          subtitle,
          description,
          category,
          price,
          duration,
          image: `https://picsum.photos/seed/${Math.random()}/600/400`,
          color: 'rose', // Default
          lessons
        };
        addCourse(newCourse);
        alert('Курс успешно создан!');
      }
      navigate('/admin');
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-quantum-rose hover:bg-quantum-rose/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-3xl font-bold">
            {id === 'new' ? 'Создание курса' : 'Редактирование курса'}
          </h1>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Отмена
          </Button>
          <Button onClick={handleSaveCourse}>
            {id === 'new' ? 'Создать курс' : 'Сохранить изменения'}
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Main Course Info */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-quantum-ivory/60 mb-2">Название курса</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-quantum-ivory/60 mb-2">Подзаголовок</label>
                <input 
                  type="text" 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-quantum-ivory/60 mb-2">Категория</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Course['category'])}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors appearance-none"
                  >
                    <option value="free" className="text-black">Бесплатные</option>
                    <option value="live_yourself" className="text-black">Живи Себя</option>
                    <option value="archetypes" className="text-black">Архетипы</option>
                    <option value="retreats" className="text-black">Выездные программы</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-quantum-ivory/60 mb-2">Длительность</label>
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-quantum-ivory/60 mb-2 flex justify-between items-center">
                  <span>Цена</span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-50">только цифрами</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-12 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                    placeholder="0"
                    required
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-quantum-ivory/40 font-bold">
                    ₽
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-quantum-ivory/60 mb-2">Описание курса</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={12}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors resize-none custom-scrollbar"
              />
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold">Программа обучения</h2>
            <Button type="button" onClick={handleAddLesson}>
              + Добавить урок
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Lesson List with Reordering */}
            <div className="w-full">
              <Reorder.Group axis="y" values={lessons} onReorder={setLessons} className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <Reorder.Item 
                    key={lesson.id} 
                    value={lesson}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${editingLesson?.id === lesson.id ? 'bg-quantum-rose/10 border-quantum-rose' : 'bg-white/5 border-white/5 hover:border-quantum-rose/30'}`}
                    onClick={() => handleOpenLessonEditor(lesson)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-quantum-ivory/20 cursor-grab active:cursor-grabbing">
                        <GripVertical size={18} />
                      </div>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${editingLesson?.id === lesson.id ? 'bg-quantum-rose text-white' : 'bg-quantum-rose/10 text-quantum-rose'}`}>
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium truncate max-w-[150px]">{lesson.title}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLesson(lesson.id);
                        if (editingLesson?.id === lesson.id) setEditingLesson(null);
                      }} 
                      className="text-quantum-rose/40 hover:text-quantum-rose transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              
              {lessons.length === 0 && (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-3xl text-quantum-ivory/20">
                  <p>В программе пока нет уроков.<br />Нажмите «Добавить урок», чтобы начать.</p>
                </div>
              )}
            </div>

            {/* Inline Lesson Editor */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                {editingLesson ? (
                  <motion.div 
                    key={editingLesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-2xl font-bold text-quantum-rose">Редактор урока</h4>
                      <button 
                        type="button"
                        onClick={() => setEditingLesson(null)}
                        className="text-quantum-ivory/40 hover:text-quantum-rose transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs text-quantum-ivory/40 mb-2 uppercase tracking-wider font-bold">Название урока</label>
                        <input 
                          type="text"
                          value={editingLesson.title}
                          onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-quantum-ivory/40 mb-2 uppercase tracking-wider font-bold">Видео (URL)</label>
                        <input 
                          type="text"
                          value={editingLesson.videoUrl || ''}
                          onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                          placeholder="https://youtube.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-quantum-ivory/40 mb-2 uppercase tracking-wider font-bold">Аудио (URL)</label>
                        <input 
                          type="text"
                          value={editingLesson.audioUrl || ''}
                          onChange={(e) => setEditingLesson({ ...editingLesson, audioUrl: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                          placeholder="https://example.com/audio.mp3"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-quantum-ivory/40 mb-2 uppercase tracking-wider font-bold">Слайды (URL)</label>
                        <input 
                          type="text"
                          value={editingLesson.slidesUrl || ''}
                          onChange={(e) => setEditingLesson({ ...editingLesson, slidesUrl: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                          placeholder="https://docs.google.com/presentation/..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-quantum-ivory/40 mb-2 uppercase tracking-wider font-bold">Изображения слайдов (по одной ссылке на строку)</label>
                        <textarea 
                          value={editingLesson.slideImages?.join('\n') || ''}
                          onChange={(e) => setEditingLesson({ ...editingLesson, slideImages: e.target.value.split('\n').filter(s => s.trim() !== '') })}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors resize-none custom-scrollbar"
                          placeholder="https://example.com/slide1.jpg&#10;https://example.com/slide2.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-quantum-ivory/40 mb-2 uppercase tracking-wider font-bold">Текст урока</label>
                        <textarea 
                          value={editingLesson.content || ''}
                          onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                          rows={8}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors resize-none custom-scrollbar"
                          placeholder="Введите основной текст урока..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-quantum-ivory/40 mb-2 uppercase tracking-wider font-bold">Задание</label>
                        <textarea 
                          value={editingLesson.task || ''}
                          onChange={(e) => setEditingLesson({ ...editingLesson, task: e.target.value })}
                          rows={5}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors resize-none custom-scrollbar"
                          placeholder="Введите задание для ученика..."
                        />
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setEditingLesson(null)}>
                          Отмена
                        </Button>
                        <Button type="button" onClick={handleSaveLesson}>
                          Сохранить урок
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[32px] p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-quantum-ivory/10">
                      <Settings size={40} />
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-quantum-ivory/60">Редактор не активен</h4>
                    <p className="text-quantum-ivory/40 max-w-xs">Выберите урок из списка слева или добавьте новый, чтобы настроить его содержание</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
