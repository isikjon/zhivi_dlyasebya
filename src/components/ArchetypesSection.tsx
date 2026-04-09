import React from 'react';
import { motion } from 'motion/react';
import { CircleDot, Waves, Eye, Flame, Wind, Shield, Heart } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

const archetypes = [
  {
    id: 1,
    title: "Первозданная",
    subtitle: "Частица в покое",
    desc: "Та, что помнит свою природу до социальных масок. Тишина внутри, опора в теле, связь с землей.",
    icon: CircleDot
  },
  {
    id: 2,
    title: "Созидательница",
    subtitle: "Волна творения",
    desc: "Энергия, которая материализует идеи. Мысли становятся вещами, вдохновение приходит мгновенно.",
    icon: Waves
  },
  {
    id: 3,
    title: "Проводница",
    subtitle: "Наблюдатель",
    desc: "Та, что видит суть вещей и людей. Интуиция, ясновидение, способность считывать поле.",
    icon: Eye
  },
  {
    id: 4,
    title: "Страстная",
    subtitle: "Энергия возбуждения",
    desc: "Жизненная сила, витальность, сексуальность. Про чувство «я живая». Запускает притяжение.",
    icon: Flame
  },
  {
    id: 5,
    title: "Странница",
    subtitle: "Квантовый скачок",
    desc: "Та, что разрушает старое, чтобы построить новое. Смелость уходить из точек застоя.",
    icon: Wind
  },
  {
    id: 6,
    title: "Хранительница",
    subtitle: "Волна в точку",
    desc: "Создает пространство безопасности. Дом, отношения, традиции как опора для роста.",
    icon: Shield
  },
  {
    id: 7,
    title: "Целительница",
    subtitle: "Резонанс",
    desc: "Способность исцелять своим присутствием. Быть тем полем, где раны затягиваются сами.",
    icon: Heart
  }
];

export function ArchetypesSection() {
  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold mb-6 uppercase"
          >
            <span className="text-quantum-rose">Квантовые</span> <br className="hidden md:block" />
            <span className="text-quantum-ivory">архетипы женщины</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-quantum-rose mb-8 font-medium italic"
          >
            7 граней твоей многомерной природы
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl"
          >
            <p className="text-quantum-ivory/80 text-lg leading-relaxed mb-4">
              В квантовой реальности ты существуешь везде и одновременно. Ты можешь быть разной — и это не хаос, а твоя суперсила.
            </p>
            <p className="text-quantum-ivory/70 leading-relaxed">
              Эти 7 архетипов — не роли, которые нужно «играть». Это твои энергетические состояния, твои волны и частицы. Познакомься с каждой гранью, чтобы научиться переключаться осознанно и жить из целостности.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="flex flex-wrap justify-center gap-6 mb-24">
          {archetypes.map((arch, i) => (
            <motion.div
              key={arch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-white/5 backdrop-blur-md rounded-[32px] p-8 shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative border border-white/5 hover:border-quantum-rose flex flex-col"
            >
              <div className="mb-6">
                <arch.icon size={32} className="text-quantum-rose group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-display text-2xl font-bold text-quantum-ivory mb-1">{arch.title}</h3>
              <p className="text-quantum-rose/80 text-xs uppercase tracking-widest font-semibold mb-4">{arch.subtitle}</p>
              <p className="text-quantum-ivory/80 text-sm leading-relaxed flex-grow">{arch.desc}</p>
              
              <div className="mt-6 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link to="/program/archetypes">
                  <Button variant="outline" size="sm" className="w-full border-quantum-amber text-quantum-amber hover:bg-quantum-amber hover:text-quantum-graphite">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/5 to-transparent rounded-[40px] p-8 md:p-16 border border-white/10 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-quantum-amber/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-quantum-rose/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-6">Ты узнала себя в этих гранях?</h3>
              <p className="text-quantum-ivory/80 text-lg mb-6 leading-relaxed">
                В каждой женщине живут все 7 архетипов. Но иногда какие-то из них спят, а какие-то кричат так громко, что заглушают остальных.
              </p>
              <p className="text-quantum-ivory/80 text-lg mb-6 leading-relaxed">
                В программе <strong className="text-quantum-amber font-semibold">«Тайна женских архетипов»</strong> мы за 7 дней:
              </p>
              <ul className="space-y-3 mb-8 text-quantum-ivory/90">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-quantum-amber"></div> Разбудим спящие грани</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-quantum-amber"></div> Успокоим слишком активные</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-quantum-amber"></div> Соберем тебя из осколков в целое</li>
              </ul>
            </div>
            
            <div className="bg-quantum-emerald/40 backdrop-blur-md rounded-3xl p-8 border border-quantum-amber/10">
              <h4 className="font-display text-xl font-bold mb-6 text-quantum-amber">Что внутри:</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4 text-quantum-ivory/90">
                  <span className="text-2xl">📹</span> 7 видео-уроков
                </li>
                <li className="flex items-center gap-4 text-quantum-ivory/90">
                  <span className="text-2xl">🎧</span> 7 аудио-медитаций
                </li>
                <li className="flex items-center gap-4 text-quantum-ivory/90">
                  <span className="text-2xl">📖</span> 7 писем-посланий с заданиями
                </li>
              </ul>
              
              <div className="text-3xl font-display font-bold text-quantum-ivory mb-8">
                15 000 ₽
              </div>
              
              <Link to="/program/archetypes">
                <Button size="lg" className="w-full bg-quantum-rose text-white hover:bg-quantum-rose/90 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                  Хочу вспомнить себя
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
