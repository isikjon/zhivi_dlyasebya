import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Waves, Heart, Coffee, Zap } from 'lucide-react';

const reasons = [
  {
    id: 1,
    icon: Sparkles,
    title: "Опыт, наполненный мудростью",
    desc: "Мой путь — годы трансформаций. Я не просто знаю теорию, а вижу корень проблем. Это позволяет находить причину быстрее и точечно воздействовать на нее."
  },
  {
    id: 2,
    icon: Waves,
    title: "За пределами шаблонов",
    desc: "Никаких стандартных схем. Я объединяю психологию, эзотерику, нейронауку и квантовую физику. Здесь каждая грань твоей личности получает внимание."
  },
  {
    id: 3,
    icon: Heart,
    title: "Сердечный подход",
    desc: "Я чувствую твои боли и радости. Здесь можно плакать, смеяться или злиться — все эмоции становятся ступеньками к освобождению."
  },
  {
    id: 4,
    icon: Coffee,
    title: "Простота без напряжения",
    desc: "Представь разговор за чашкой чая с тем, кто действительно понимает. Расслабленная атмосфера помогает снять маски и открыться переменам."
  },
  {
    id: 5,
    icon: Zap,
    title: "Скорость без потери глубины",
    desc: "Зачем растягивать на месяцы то, что можно решить за 3-5 встреч? Мои методы направлены на быструю перенастройку сознания."
  }
];

export function WhyMeSection() {
  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight text-quantum-ivory"
          >
            Почему меня <span className="text-quantum-rose">выбирают?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-quantum-ivory/80 italic font-light"
          >
            Потому что я не «специалист из учебника». Я живая.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative border border-white/5 hover:border-quantum-rose/50 flex flex-col ${
                i > 2 ? 'lg:w-[calc(40%-12px)]' : '' // Make the last two wider on desktop to center them
              }`}
            >
              <div className="mb-6">
                <reason.icon size={36} className="text-quantum-rose group-hover:text-quantum-amber group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="font-display text-2xl font-bold text-quantum-rose mb-4">{reason.title}</h3>
              <p className="text-quantum-ivory/80 leading-relaxed font-light">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
