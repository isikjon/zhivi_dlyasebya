import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, PlayCircle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { EditableImage } from '../components/EditableImage';
import { EditableText } from '../components/EditableText';
import { EditableLink } from '../components/EditableLink';
import { ArchetypesSection } from '../components/ArchetypesSection';
import { WhyMeSection } from '../components/WhyMeSection';
import { MainProgramSection } from '../components/MainProgramSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { TelegramLinksSection } from '../components/TelegramLinksSection';
import { ConsultationSection } from '../components/ConsultationSection';

export default function Home({ courses = [], siteContent = {} }) {
  const hero = siteContent.Hero || {};
  const programs = siteContent.Programs || {};
  const freeCourse = siteContent.FreeCourse || {};

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-quantum-rose/30 bg-quantum-rose/10 text-quantum-rose text-sm font-medium">
                <Sparkles size={16} />
                <EditableText section="Hero" itemKey="badge">Твой квантовый переход</EditableText>
              </div>
              <div className="text-quantum-ivory/60 text-sm font-medium tracking-wider uppercase">
                Авторский курс <span className="text-quantum-amber"><EditableText section="Hero" itemKey="author">Виктории Неустроевой</EditableText></span>
              </div>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              <EditableText section="Hero" itemKey="title_part1">Открой тайну</EditableText> <br />
              <span className="text-quantum-amber block mt-2"><EditableText section="Hero" itemKey="title_part2">ЖЕНСКИХ АРХЕТИПОВ</EditableText></span>
            </h1>
            
            <p className="text-lg md:text-xl text-quantum-ivory/80 max-w-lg leading-relaxed font-light">
              <EditableText section="Hero" itemKey="description">Интерактивное пространство выбора. Перейди от состояния сомнения к состоянию абсолютной уверенности.</EditableText>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <EditableLink section="Hero" itemKey="btn_free" defaultHref="/program/free">
                <Button size="lg" className="w-full sm:w-auto">
                  Начать бесплатно <ArrowRight size={20} />
                </Button>
              </EditableLink>
              <EditableLink section="Hero" itemKey="btn_catalog" defaultHref="/catalog">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Выбрать путь
                </Button>
              </EditableLink>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden md:block"
          >
            {/* Abstract representation of a woman/quantum energy */}
            <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-quantum-emerald via-quantum-emerald to-quantum-rose/20 mix-blend-overlay z-10 pointer-events-none"></div>
              <EditableImage 
                imageId="home_hero"
                defaultSrc="https://picsum.photos/seed/woman-abstract/800/1000?blur=2" 
                alt="Quantum Woman" 
                containerClassName="w-full h-full"
                imageClassName="opacity-80"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating element */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-12 bg-quantum-graphite/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl z-20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-quantum-amber/20 flex items-center justify-center text-quantum-amber">
                    <PlayCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-quantum-ivory/60 uppercase tracking-wider mb-1">Урок 1</p>
                    <p className="font-display font-semibold text-sm">Пробуждение</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features / Triggers */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* Telegram Links */}
      <TelegramLinksSection />

      {/* Consultation Section */}
      <section id="consultation">
        <ConsultationSection />
      </section>

      {/* Main Program Section */}
      <section id="live-yourself">
        <MainProgramSection />
      </section>

      {/* Programs Section */}
      <section id="catalog" className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-6xl font-bold mb-6 uppercase"
            >
              <EditableText section="Programs" itemKey="title">Наши программы</EditableText>
            </motion.h2>
            <p className="text-quantum-ivory/70 text-lg max-w-2xl mx-auto">
              <EditableText section="Programs" itemKey="subtitle">Выбери свой путь трансформации. Каждая программа — это шаг навстречу к твоей истинной природе.</EditableText>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.filter(c => c.price > 0).map((prog, i) => (
              <motion.div 
                key={prog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-quantum-graphite/40 backdrop-blur-md rounded-[40px] overflow-hidden border border-white/5 hover:border-quantum-amber/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full shadow-2xl"
              >
                <div className="p-8 md:p-10 relative flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-quantum-amber"></div>
                    <p className="text-quantum-amber text-[10px] font-bold uppercase tracking-[0.2em]">Программа</p>
                  </div>
                  
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-6 line-clamp-2 leading-tight text-quantum-ivory">{prog.title}</h3>
                  <p className="text-quantum-ivory/60 text-sm leading-relaxed mb-8 line-clamp-3">{prog.description}</p>
                  
                  <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-3xl font-bold text-quantum-ivory">
                        {prog.price} ₽
                      </div>
                      <a href={`/catalog`} className="text-quantum-amber hover:translate-x-1 transition-transform">
                        <ChevronRight size={24} />
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <a href={`/catalog`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full py-4 text-xs font-bold uppercase tracking-widest border-white/10 text-quantum-ivory hover:bg-white/5"
                        >
                          Подробнее
                        </Button>
                      </a>
                      <Button 
                        className="flex-1 py-4 text-xs font-bold uppercase tracking-widest bg-quantum-amber text-quantum-emerald hover:bg-quantum-amber/90"
                        onClick={() => window.open('https://t.me/victoria_neustroeva', '_blank')}
                      >
                        Купить
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a href="/catalog">
              <Button variant="outline" size="lg" className="border-quantum-amber text-quantum-amber hover:bg-quantum-amber hover:text-quantum-emerald">
                Смотреть все программы <ArrowRight size={20} className="ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Free Course Bonus Section */}
      <section id="free-course" className="py-24 px-4 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-quantum-rose/20 to-quantum-amber/10 backdrop-blur-2xl rounded-[48px] p-8 md:p-20 border border-quantum-amber/20 shadow-[0_0_50px_rgba(230,180,80,0.1)]"
          >
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-quantum-amber/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-quantum-rose/20 rounded-full blur-[100px]"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-quantum-rose/30 bg-quantum-rose/10 text-quantum-rose text-xs font-bold uppercase tracking-widest mb-8">
                  <Sparkles size={14} />
                  <EditableText section="FreeCourse" itemKey="badge">Бонус от нас</EditableText>
                </div>
                
                <h2 className="font-display text-4xl md:text-6xl font-bold mb-8 leading-tight">
                  <EditableText section="FreeCourse" itemKey="title">Начни свой путь БЕСПЛАТНО</EditableText>
                </h2>
                
                <p className="text-xl text-quantum-ivory/80 mb-10 leading-relaxed font-light">
                  <EditableText section="FreeCourse" itemKey="description">Мы верим, что каждая женщина заслуживает шанса познакомиться со своей истинной природе. Поэтому мы подготовили для тебя вводный курс «Пробуждение» абсолютно бесплатно.</EditableText>
                </p>

                <div className="space-y-6 mb-12">
                  {[
                    '3 глубоких видео-урока',
                    'Практики осознанного дыхания',
                    'Доступ в личный кабинет сразу'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-quantum-ivory/90">
                      <div className="w-6 h-6 rounded-full bg-quantum-amber/20 flex items-center justify-center shrink-0">
                        <ArrowRight size={14} className="text-quantum-amber" />
                      </div>
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>

                <a href="/cabinet/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-12 py-8 text-xl bg-quantum-amber text-quantum-emerald hover:bg-quantum-amber/90 shadow-[0_0_30px_rgba(230,180,80,0.3)] group">
                    Получить доступ <ArrowRight size={24} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </a>
              </div>

              <div className="hidden lg:block relative">
                <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                  <EditableImage 
                    imageId="free_course_bonus"
                    defaultSrc="https://picsum.photos/seed/meditation/800/800" 
                    alt="Free Course"
                    containerClassName="w-full h-full"
                    imageClassName="opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-quantum-emerald via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                      <p className="text-quantum-amber font-bold uppercase tracking-widest text-xs mb-2">Уже проходят</p>
                      <p className="text-3xl font-display font-bold">1 240+</p>
                      <p className="text-quantum-ivory/60 text-sm">участниц начали свой путь</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Me Section */}
      <WhyMeSection />

      {/* Archetypes Section */}
      <section id="archetypes">
        <ArchetypesSection />
      </section>
    </div>
  );
}
