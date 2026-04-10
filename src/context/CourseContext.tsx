import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  audioUrl?: string;
  slidesUrl?: string;
  slideImages?: string[];
  content?: string;
  task?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  category: 'free' | 'archetypes' | 'live_yourself' | 'retreats';
  price: string;
  duration: string;
  image: string;
  previewVideo?: string;
  color: 'rose' | 'amber' | 'emerald';
  lessons: Lesson[];
}

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
}

const defaultPrograms: Course[] = [
  {
    id: "free",
    title: "Знакомство с собой",
    subtitle: "Бесплатный вводный курс",
    category: "free",
    price: "Бесплатно",
    duration: "3 дня",
    image: "https://picsum.photos/seed/prog1/600/400",
    color: "rose",
    lessons: [
      {
        id: "l1",
        title: "День 1: Пробуждение",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        slidesUrl: "https://docs.google.com/presentation/d/1",
        slideImages: [
          "https://picsum.photos/seed/slide1/800/450",
          "https://picsum.photos/seed/slide2/800/450",
          "https://picsum.photos/seed/slide3/800/450"
        ],
        content: "Добро пожаловать на первый день нашего пути. Сегодня мы сфокусируемся на пробуждении вашего внутреннего потенциала и осознании текущего состояния. Мы разберем, как наши мысли формируют нашу реальность и как начать замечать автоматические реакции.",
        task: "Запишите 3 вещи, за которые вы благодарны себе сегодня. Практикуйте осознанное дыхание в течение 5 минут перед сном."
      },
      {
        id: "l2",
        title: "День 2: Гармония",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        slidesUrl: "https://docs.google.com/presentation/d/2",
        content: "Гармония — это не отсутствие хаоса, а умение сохранять внутренний центр в любых обстоятельствах. Сегодня мы изучим техники эмоциональной регуляции и настройки на состояние потока.",
        task: "Проведите 10 минут в тишине, наблюдая за своим дыханием. Постарайтесь не оценивать свои мысли, а просто позволять им проплывать мимо."
      }
    ]
  },
  {
    id: "archetype-girl",
    title: "Архетип: Девочка",
    subtitle: "Легкость и доверие миру",
    category: "archetypes",
    price: "5 000 ₽",
    duration: "1 неделя",
    image: "https://picsum.photos/seed/girl/600/400",
    color: "rose",
    lessons: []
  },
  {
    id: "archetype-hostess",
    title: "Архетип: Хозяйка",
    subtitle: "Порядок и изобилие",
    category: "archetypes",
    price: "5 000 ₽",
    duration: "1 неделя",
    image: "https://picsum.photos/seed/hostess/600/400",
    color: "emerald",
    lessons: []
  },
  {
    id: "archetype-lover",
    title: "Архетип: Любовница",
    subtitle: "Страсть и наслаждение",
    category: "archetypes",
    price: "5 000 ₽",
    duration: "1 неделя",
    image: "https://picsum.photos/seed/lover/600/400",
    color: "rose",
    lessons: []
  },
  {
    id: "archetype-queen",
    title: "Архетип: Королева",
    subtitle: "Достоинство и власть",
    category: "archetypes",
    price: "5 000 ₽",
    duration: "1 неделя",
    image: "https://picsum.photos/seed/queen/600/400",
    color: "amber",
    lessons: []
  },
  {
    id: "quantum",
    title: "Квантовый скачок",
    subtitle: "Трансформационная программа",
    category: "live_yourself",
    price: "35 000 ₽",
    duration: "8 недель",
    image: "https://picsum.photos/seed/prog3/600/400",
    color: "emerald",
    lessons: []
  },
  {
    id: "vip",
    title: "Личное наставничество",
    subtitle: "Индивидуальная работа",
    category: "live_yourself",
    price: "150 000 ₽",
    duration: "3 месяца",
    image: "https://picsum.photos/seed/prog4/600/400",
    color: "amber",
    lessons: []
  },
  {
    id: "retreat-1",
    title: "Выездной девишник",
    subtitle: "Перезагрузка в кругу единомышленниц",
    category: "retreats",
    price: "85 000 ₽",
    duration: "5 дней",
    image: "https://picsum.photos/seed/retreat/600/400",
    color: "rose",
    lessons: []
  }
];

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children, initialCourses = [] }: { children: React.ReactNode, initialCourses?: any[] }) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (initialCourses && initialCourses.length > 0) {
      const mapped = initialCourses.map(c => ({
        id: c.id.toString(),
        title: c.title,
        subtitle: c.description ? c.description.substring(0, 50) + '...' : 'Программа обучения',
        category: c.price == 0 ? 'free' : 'live_yourself',
        price: c.price == 0 ? 'Бесплатно' : `${c.price} ₽`,
        duration: 'Доступ навсегда',
        image: c.image_path ? `/storage/${c.image_path}` : "https://picsum.photos/seed/prog1/600/400",
        color: 'rose',
        lessons: []
      }));
      setCourses(mapped);
      return;
    }

    const savedCourses = localStorage.getItem('quantum_courses_v3');
    if (savedCourses) {
      const parsed = JSON.parse(savedCourses);
      const migrated = parsed.map((c: any) => ({
        ...c,
        category: c.category || 'live_yourself',
        description: c.description || '',
        lessons: (c.lessons || []).map((l: any) => ({
          ...l,
          videoUrl: l.videoUrl || '',
          audioUrl: l.audioUrl || '',
          slidesUrl: l.slidesUrl || '',
          content: l.content || '',
          task: l.task || ''
        }))
      }));
      setCourses(migrated);
    } else {
      setCourses(defaultPrograms);
      localStorage.setItem('quantum_courses_v3', JSON.stringify(defaultPrograms));
    }
  }, []);

  const addCourse = (course: Course) => {
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem('quantum_courses_v3', JSON.stringify(updatedCourses));
  };

  const updateCourse = (updatedCourse: Course) => {
    const updatedCourses = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    setCourses(updatedCourses);
    localStorage.setItem('quantum_courses_v3', JSON.stringify(updatedCourses));
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(c => c.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('quantum_courses_v3', JSON.stringify(updatedCourses));
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}
