import React from 'react';
import { motion } from 'motion/react';
import { Circle, Waves, Infinity, Star, Check, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EditableText } from './EditableText';
import { EditableLink } from './EditableLink';
import { usePage } from '@inertiajs/react';

const results = [
  {
    id: '1',
    icon: Circle,
    title: "Целостность",
    desc: "Перестанешь разрываться между ролями. Соберешь себя из осколков в одно целое."
  },
  {
    id: '2',
    icon: Waves,
    title: "Свобода",
    desc: "Отпустишь чужие сценарии, ожидания и «должна». Начнешь жить из себя."
  },
  {
    id: '3',
    icon: Infinity,
    title: "Ресурс",
    desc: "Вернешь энергию, которая утекала в тревогу, контроль и попытки угодить."
  },
  {
    id: '4',
    icon: Star,
    title: "Ясность",
    desc: "Поймешь, куда идешь и зачем. Появится внутренний компас."
  }
];

const structure = [
  {
    id: '1',
    icon: Sparkles,
    title: "7 квантовых модулей",
    desc: "От архетипов до денег. Каждый модуль — слой, который ты снимаешь, чтобы добраться до сути."
  },
  {
    id: '2',
    icon: Circle,
    title: "21 практика трансформации",
    desc: "Медитации, дыхание, письменные техники, телесные практики. По одной на каждый день."
  },
  {
    id: '3',
    icon: Infinity,
    title: "Доступ навсегда",
    desc: "Ты проходишь в своем ритме. И возвращаешься, когда нужно."
  }
];

const forWhom = [
  { id: '1', text: "Ты устала ходить по кругу и наступать на одни и те же грабли" },
  { id: '2', text: "Чувствуешь, что способна на большее, но что-то держит" },
  { id: '3', text: "Разрываешься между семьей, работой и желанием пожить для себя" },
  { id: '4', text: "Хочешь исцелить глубинные раны, а не замазывать симптомы" },
  { id: '5', text: "Готова к квантовому скачку в деньгах, отношениях, состоянии" }
];

export function MainProgramSection() {
  const { isAuthenticated } = useAuth();
  const { mainCourse } = usePage().props as any;
  const navigate = useNavigate();

  const handleJoin = () => {
    if (isAuthenticated) {
      if (mainCourse) {
        navigate(`/cabinet/course/${mainCourse.id}`);
      } else {
        navigate('/cabinet/dashboard');
      }
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <section className="py-24 px-4 relative z-10 overflow-hidden">
      {/* Background with deep space effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-quantum-emerald via-[#083A3A] to-quantum-graphite z-0"></div>
      
      {/* Particles effect (simulated with CSS) */}
      <div className="absolute inset-0 opacity-20 z-0 bg-[radial-gradient(circle_at_center,rgba(230,180,80,0.1)_0%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-7xl font-bold mb-4 uppercase tracking-tight text-quantum-amber"
          >
            <EditableText section="MainProgram" itemKey="title">Живи себя</EditableText>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-quantum-ivory font-light mb-2"
          >
            <EditableText section="MainProgram" itemKey="subtitle">Квантовый курс возвращения к себе</EditableText>
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-quantum-rose italic"
          >
            <EditableText section="MainProgram" itemKey="author_desc">Флагманская программа Виктории Неустроевой. 21 день глубокой трансформации.</EditableText>
          </motion.p>
        </div>

        {/* Description */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-quantum-rose/10 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl mb-20 max-w-4xl mx-auto border border-quantum-rose/20"
        >
          <h3 className="font-display text-3xl font-bold text-quantum-amber mb-6">
            <EditableText section="MainProgram" itemKey="what_is_title">Что значит «ЖИВИ СЕБЯ»?</EditableText>
          </h3>
          <div className="space-y-6 text-quantum-ivory/90 text-lg leading-relaxed font-light">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-quantum-amber shrink-0">
                <Sparkles size={20} />
              </div>
              <p><EditableText section="MainProgram" itemKey="what_is_1">Это про состояние, когда ты перестаешь «казаться» и начинаешь «быть».</EditableText></p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 text-quantum-amber shrink-0">
                <Waves size={20} />
              </div>
              <p><EditableText section="MainProgram" itemKey="what_is_2">Когда исчезает внутренний конфликт между «надо» и «хочу».</EditableText></p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 text-quantum-amber shrink-0">
                <Circle size={20} />
              </div>
              <p><EditableText section="MainProgram" itemKey="what_is_3">Когда ты чувствуешь опору в себе, а не ищешь ее вовне.</EditableText></p>
            </div>
            
            <p className="pt-6 border-t border-quantum-rose/20 font-medium">
              <EditableText section="MainProgram" itemKey="what_is_footer">Я создала этот курс, чтобы собрать воедино всё, что знаю о женской природе, квантовой психологии и быстрых трансформациях. 21 день — и ты не узнаешь себя. Потому что наконец-то встретишься с собой настоящей.</EditableText>
            </p>
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {results.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
            >
              <res.icon size={40} className="text-quantum-amber mb-6" />
              <h4 className="font-display text-2xl font-bold text-quantum-ivory mb-3">
                <EditableText section="MainProgram" itemKey={`result_${res.id}_title`}>{res.title}</EditableText>
              </h4>
              <p className="text-quantum-ivory/70 font-light leading-relaxed">
                <EditableText section="MainProgram" itemKey={`result_${res.id}_desc`}>{res.desc}</EditableText>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Structure & For Whom */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Structure */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="font-display text-3xl font-bold text-quantum-ivory mb-8">
              <EditableText section="MainProgram" itemKey="structure_title">Структура программы</EditableText>
            </h3>
            {structure.map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-quantum-amber/20 flex items-center justify-center shrink-0 border border-quantum-amber/30">
                  <item.icon size={24} className="text-quantum-amber" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-quantum-ivory mb-2">
                    <EditableText section="MainProgram" itemKey={`structure_${item.id}_title`}>{item.title}</EditableText>
                  </h4>
                  <p className="text-quantum-ivory/70 font-light leading-relaxed">
                    <EditableText section="MainProgram" itemKey={`structure_${item.id}_desc`}>{item.desc}</EditableText>
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* For Whom */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 md:p-10"
          >
            <h3 className="font-display text-3xl font-bold text-quantum-amber mb-8">
              <EditableText section="MainProgram" itemKey="for_whom_title">Этот курс для тебя, если:</EditableText>
            </h3>
            <ul className="space-y-6">
              {forWhom.map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-1 shrink-0 text-quantum-amber">
                    <Check size={24} />
                  </div>
                  <span className="text-quantum-ivory/90 text-lg font-light leading-relaxed">
                    <EditableText section="MainProgram" itemKey={`for_whom_${item.id}`}>{item.text}</EditableText>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTA Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gradient-to-br from-quantum-ivory/10 to-quantum-amber/20 backdrop-blur-xl border border-white/10 hover:border-quantum-amber transition-colors duration-500 rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_0_50px_rgba(230,180,80,0.15)] group"
        >
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-quantum-amber/5 blur-[100px] z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="font-display text-4xl md:text-6xl font-bold text-quantum-ivory mb-4">
              <EditableText section="MainProgram" itemKey="cta_title">Готова вернуться к себе?</EditableText>
            </h3>
            <p className="text-quantum-ivory/60 text-lg mb-8 italic">
              <EditableText section="MainProgram" itemKey="cta_price_label">Стоимость твоей трансформации:</EditableText>
            </p>
            
            <div className="text-5xl md:text-6xl font-display font-bold text-quantum-amber mb-6">
              <EditableText section="MainProgram" itemKey="cta_price">
                {mainCourse ? `${mainCourse.price} ₽` : '28 500 ₽'}
              </EditableText>
            </div>
            
            <p className="text-quantum-ivory/80 mb-10 font-light">
              <EditableText section="MainProgram" itemKey="cta_footer">Рассрочка без процентов — напиши мне в Telegram</EditableText>
            </p>
            
            <EditableLink section="MainProgram" itemKey="cta_btn" defaultHref="#">
              <Button 
                size="lg" 
                onClick={handleJoin}
                className="w-full md:w-auto px-12 py-6 text-xl bg-quantum-amber text-quantum-emerald hover:bg-quantum-amber/90 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(230,180,80,0.4)] hover:shadow-[0_0_50px_rgba(230,180,80,0.6)] font-bold uppercase tracking-wider"
              >
                Хочу ЖИТЬ СЕБЯ
              </Button>
            </EditableLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
