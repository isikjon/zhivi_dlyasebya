import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, PlayCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { EditableImage } from '../components/EditableImage';
import { ArchetypesSection } from '../components/ArchetypesSection';
import { WhyMeSection } from '../components/WhyMeSection';
import { MainProgramSection } from '../components/MainProgramSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { TelegramLinksSection } from '../components/TelegramLinksSection';
import { ConsultationSection } from '../components/ConsultationSection';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
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
                <span>Твой квантовый переход</span>
              </div>
              <div className="text-quantum-ivory/60 text-sm font-medium tracking-wider uppercase">
                Авторский курс <span className="text-quantum-amber">Виктории Неустроевой</span>
              </div>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Открой тайну <br />
              <span className="text-quantum-amber block mt-2">ЖЕНСКИХ АРХЕТИПОВ</span>
            </h1>
            
            <p className="text-lg md:text-xl text-quantum-ivory/80 max-w-lg leading-relaxed font-light">
              Интерактивное пространство выбора. Перейди от состояния сомнения к состоянию абсолютной уверенности.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/program/free">
                <Button size="lg" className="w-full sm:w-auto">
                  Начать бесплатно <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/catalog">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Выбрать путь
                </Button>
              </Link>
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
      <FeaturesSection />

      {/* Telegram Links */}
      <TelegramLinksSection />

      {/* Consultation Section */}
      <ConsultationSection />

      {/* Main Program Section */}
      <MainProgramSection />

      {/* Why Me Section */}
      <WhyMeSection />

      {/* Archetypes Section */}
      <ArchetypesSection />
    </div>
  );
}
