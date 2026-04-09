import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, PlayCircle, FileText, Download, CheckCircle2, ChevronRight, ChevronLeft, Headphones, Presentation, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { useCourses } from '../context/CourseContext';

type TabType = 'video' | 'audio' | 'slides' | 'text' | 'task';

export default function Lesson() {
  const { programId, dayId } = useParams();
  const navigate = useNavigate();
  const { courses } = useCourses();
  
  const course = courses.find(c => c.id === programId);
  const lessonIndex = parseInt(dayId || '0', 10);
  const lesson = course?.lessons[lessonIndex];
  
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Set initial tab based on available content
  useEffect(() => {
    if (lesson) {
      if (lesson.videoUrl) setActiveTab('video');
      else if (lesson.audioUrl) setActiveTab('audio');
      else if (lesson.slideImages?.length || lesson.slidesUrl) setActiveTab('slides');
      else if (lesson.content) setActiveTab('text');
      else if (lesson.task) setActiveTab('task');
    }
  }, [lesson]);

  if (!course || !lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Урок не найден</h1>
        <Link to={`/program/${programId}`} className="text-quantum-amber hover:underline">Вернуться к программе</Link>
      </div>
    );
  }

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const goToNextDay = () => {
    if (lessonIndex < course.lessons.length - 1) {
      navigate(`/lesson/${programId}/${lessonIndex + 1}`);
      setIsCompleted(false);
      setCurrentSlide(0);
    }
  };

  const goToPrevDay = () => {
    if (lessonIndex > 0) {
      navigate(`/lesson/${programId}/${lessonIndex - 1}`);
      setIsCompleted(false);
      setCurrentSlide(0);
    }
  };

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = lesson.videoUrl ? getYoutubeId(lesson.videoUrl) : null;

  const tabs: { id: TabType; label: string; icon: any; show: boolean }[] = [
    { id: 'video', label: 'Видео', icon: PlayCircle, show: !!lesson.videoUrl },
    { id: 'audio', label: 'Аудио', icon: Headphones, show: !!lesson.audioUrl },
    { id: 'slides', label: 'Слайды', icon: Presentation, show: !!(lesson.slidesUrl || lesson.slideImages?.length) },
    { id: 'text', label: 'Текст', icon: FileText, show: !!lesson.content },
    { id: 'task', label: 'Задание', icon: CheckCircle2, show: !!lesson.task },
  ];

  const nextSlide = () => {
    if (lesson.slideImages && currentSlide < lesson.slideImages.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to={`/program/${programId}`} className="inline-flex items-center text-quantum-ivory/60 hover:text-quantum-amber mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Вернуться к программе
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-quantum-amber/30 bg-quantum-amber/10 text-quantum-amber text-xs font-medium mb-4 uppercase tracking-wider">
            Урок {lessonIndex + 1}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {lesson.title}
          </h1>
          <p className="text-quantum-ivory/70 text-lg leading-relaxed max-w-2xl mx-auto">
            {course.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-white/10 pb-4">
          {tabs.filter(t => t.show).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-quantum-amber text-quantum-graphite font-bold shadow-lg' 
                  : 'text-quantum-ivory/60 hover:text-quantum-ivory hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'video' && lesson.videoUrl && (
              <motion.section 
                key="video"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="aspect-video bg-quantum-graphite rounded-3xl overflow-hidden border border-quantum-amber/10 shadow-2xl">
                  {youtubeId ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-quantum-ivory/40">
                      <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-quantum-amber transition-colors underline">
                        Смотреть видео по ссылке
                      </a>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {activeTab === 'audio' && lesson.audioUrl && (
              <motion.section 
                key="audio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-quantum-graphite/40 rounded-3xl p-8 border border-quantum-amber/10"
              >
                <h2 className="font-display text-2xl font-bold flex items-center gap-3 mb-8">
                  <Headphones className="text-quantum-rose" /> Аудио-урок
                </h2>
                <AudioPlayer 
                  src={lesson.audioUrl} 
                  title={lesson.title} 
                />
              </motion.section>
            )}

            {activeTab === 'slides' && (lesson.slidesUrl || lesson.slideImages?.length) && (
              <motion.section 
                key="slides"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Image Slider */}
                {lesson.slideImages && lesson.slideImages.length > 0 ? (
                  <div className="relative group">
                    <div className="aspect-[16/9] bg-quantum-graphite rounded-3xl overflow-hidden border border-quantum-amber/10 shadow-2xl relative">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentSlide}
                          src={lesson.slideImages[currentSlide]}
                          alt={`Slide ${currentSlide + 1}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </AnimatePresence>
                      
                      {/* Navigation Arrows */}
                      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={prevSlide}
                          disabled={currentSlide === 0}
                          className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-quantum-amber hover:text-quantum-graphite transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={nextSlide}
                          disabled={currentSlide === lesson.slideImages.length - 1}
                          className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-quantum-amber hover:text-quantum-graphite transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </div>

                      {/* Counter */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-bold">
                        {currentSlide + 1} / {lesson.slideImages.length}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-quantum-graphite/40 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12">
                    <ImageIcon size={48} className="text-quantum-ivory/10 mb-4" />
                    <p className="text-quantum-ivory/40">Изображения слайдов не загружены</p>
                  </div>
                )}

                {/* Download Link */}
                {lesson.slidesUrl && (
                  <a 
                    href={lesson.slidesUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 rounded-3xl bg-quantum-graphite/40 border border-quantum-amber/10 hover:border-quantum-amber/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-quantum-amber/10 flex items-center justify-center text-quantum-amber group-hover:scale-110 transition-transform">
                      <Download size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-quantum-ivory">Открыть презентацию целиком</p>
                      <p className="text-sm text-quantum-ivory/50">Внешняя ссылка (Google Slides / PDF)</p>
                    </div>
                  </a>
                )}
              </motion.section>
            )}

            {activeTab === 'text' && lesson.content && (
              <motion.section 
                key="text"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="prose prose-invert prose-lg max-w-none bg-quantum-graphite/40 rounded-3xl p-8 md:p-12 border border-quantum-amber/10 whitespace-pre-wrap"
              >
                {lesson.content}
              </motion.section>
            )}

            {activeTab === 'task' && lesson.task && (
              <motion.section 
                key="task"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-quantum-amber/5 border border-quantum-amber/20 rounded-3xl p-8 md:p-12 text-quantum-ivory/90 text-xl leading-relaxed whitespace-pre-wrap italic relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CheckCircle2 size={120} />
                </div>
                <h3 className="font-display text-2xl font-bold text-quantum-amber mb-6">Ваше задание:</h3>
                {lesson.task}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Completion & Navigation */}
        <div className="pt-12 border-t border-quantum-amber/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button 
            onClick={goToPrevDay}
            disabled={lessonIndex === 0}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${lessonIndex === 0 ? 'text-quantum-ivory/20 cursor-not-allowed' : 'text-quantum-ivory/60 hover:text-quantum-amber'}`}
          >
            <ChevronLeft size={20} /> Предыдущий урок
          </button>

          {!isCompleted ? (
            <Button 
              size="lg" 
              onClick={handleComplete}
              className="w-full sm:w-auto bg-quantum-emerald text-quantum-graphite hover:bg-quantum-emerald/90 shadow-[0_0_20px_rgba(11,79,79,0.4)]"
            >
              <CheckCircle2 size={20} className="mr-2" /> Завершить урок
            </Button>
          ) : (
            lessonIndex < course.lessons.length - 1 ? (
              <Button 
                size="lg" 
                onClick={goToNextDay}
                className="w-full sm:w-auto bg-quantum-amber text-quantum-graphite hover:bg-quantum-amber/90 shadow-[0_0_20px_rgba(230,180,80,0.4)]"
              >
                Следующий урок <ChevronRight size={20} className="ml-2" />
              </Button>
            ) : (
              <div className="text-quantum-emerald flex items-center gap-2 font-bold">
                <CheckCircle2 /> Курс пройден!
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
