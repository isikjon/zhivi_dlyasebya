import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, Calendar, MessageSquare, Send, CheckCircle2, Sparkles, Star, ArrowRight, Clock, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from './Button';
import { EditableText } from './EditableText';
import { EditableLink } from './EditableLink';
import { useForm } from '@inertiajs/react';

// Mock data for available slots
const MOCK_AVAILABILITY: Record<string, string[]> = {
  'Пн': ['10:00', '12:00', '15:00', '18:00'],
  'Вт': ['11:00', '14:00', '16:00'],
  'Ср': ['09:00', '13:00', '17:00', '19:00'],
  'Чт': ['10:00', '12:00', '15:00'],
  'Пт': ['11:00', '14:00', '16:00', '18:00'],
  'Сб': ['12:00', '14:00'],
  'Вс': ['15:00', '17:00']
};

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTH_NAMES = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export function ConsultationSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate next 7 days
  const nextSevenDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date,
        dayName: DAY_NAMES[date.getDay()],
        dayNum: date.getDate(),
        month: MONTH_NAMES[date.getMonth()],
        fullDate: date.toLocaleDateString('ru-RU'),
        isoDate: date.toISOString().split('T')[0]
      });
    }
    return days;
  }, []);

  const currentDayAvailability = useMemo(() => {
    const dayName = nextSevenDays[selectedDateIdx]?.dayName || 'Пн';
    return MOCK_AVAILABILITY[dayName] || [];
  }, [selectedDateIdx, nextSevenDays]);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    contact: '',
    date: nextSevenDays[0]?.isoDate || '',
    time: '',
    request: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      alert('Пожалуйста, выбери удобное время');
      return;
    }
    
    post(route('consultation.store'), {
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        setSelectedTime(null);
      },
      preserveScroll: true
    });
  };

  const handleDateSelect = (i: number) => {
    setSelectedDateIdx(i);
    setSelectedTime(null);
    setData(prev => ({
      ...prev,
      date: nextSevenDays[i].isoDate,
      time: ''
    }));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setData('time', time);
  };

  return (
    <section id="consultation" className="py-24 px-4 relative overflow-hidden">
      {/* Красивая Модалка успеха */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-quantum-graphite/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-quantum-emerald border border-white/10 p-10 rounded-[40px] max-w-lg w-full text-center relative shadow-2xl overflow-hidden"
            >
              {/* Декоративный свет */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-quantum-amber/20 blur-[60px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-quantum-amber/20 rounded-full flex items-center justify-center text-quantum-amber mx-auto mb-8 border border-quantum-amber/30">
                  <CheckCircle2 size={48} className="animate-in zoom-in duration-500" />
                </div>
                
                <h3 className="font-display text-3xl font-bold text-quantum-ivory mb-4 uppercase tracking-tight">Заявка принята!</h3>
                <p className="text-quantum-ivory/70 mb-10 leading-relaxed">
                  Ты успешно записана на консультацию. <br/>
                  Я свяжусь с тобой в ближайшее время для подтверждения.
                </p>
                
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-5 bg-quantum-amber text-quantum-emerald font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Отлично, жду!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-quantum-graphite z-0"></div>
      <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-quantum-rose/5 blur-[120px] rounded-full z-0"></div>
      <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-quantum-amber/5 blur-[120px] rounded-full z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-quantum-amber/30 bg-quantum-amber/10 text-quantum-amber text-sm font-medium">
              <Star size={16} />
              <EditableText section="Consultation" itemKey="badge">Индивидуальный формат</EditableText>
            </div>

            <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight uppercase">
              <EditableText section="Consultation" itemKey="title">ЛИЧНАЯ ОНЛАЙН-КОНСУЛЬТАЦИЯ</EditableText>
            </h2>

            <p className="text-xl text-quantum-ivory/80 font-light leading-relaxed max-w-xl">
              <EditableText section="Consultation" itemKey="description">Глубокая работа с твоим запросом. Мы найдем корень проблемы и создадим пошаговый план твоего квантового перехода.</EditableText>
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="text-4xl font-display font-bold text-quantum-amber">
                <EditableText section="Consultation" itemKey="price">8 000 ₽</EditableText>
              </div>
              <div className="px-3 py-1 rounded-lg bg-quantum-rose/20 border border-quantum-rose/30 text-quantum-rose text-xs font-bold uppercase tracking-wider">
                <EditableText section="Consultation" itemKey="price_badge">Твоя трансформация</EditableText>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              {[
                {
                  id: '1',
                  icon: UserCheck,
                  title: "Полная фокусировка",
                  desc: "Всё внимание только на твою ситуацию и твои архетипы."
                },
                {
                  id: '2',
                  icon: Calendar,
                  title: "Удобное время",
                  desc: "Подберем слот, который идеально впишется в твой график."
                },
                {
                  id: '3',
                  icon: MessageSquare,
                  title: "Поддержка после",
                  desc: "Отвечу на вопросы и помогу с внедрением изменений в течение недели."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-quantum-amber group-hover:bg-quantum-amber/20 group-hover:border-quantum-amber/30 transition-all duration-300 shrink-0">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-quantum-ivory mb-1">
                      <EditableText section="Consultation" itemKey={`feature_${item.id}_title`}>{item.title}</EditableText>
                    </h4>
                    <p className="text-quantum-ivory/60 font-light">
                      <EditableText section="Consultation" itemKey={`feature_${item.id}_desc`}>{item.desc}</EditableText>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-quantum-graphite overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/avatar-${i}/100/100`} 
                        alt="Client" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-quantum-ivory/60">
                  <span className="text-quantum-amber font-bold">150+</span> женщин уже прошли личную трансформацию
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              {/* Decorative glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-quantum-amber/10 blur-[60px] rounded-full group-hover:bg-quantum-amber/20 transition-all duration-700"></div>
              
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold text-quantum-ivory mb-2">
                  <EditableText section="Consultation" itemKey="form_title">Запись на консультацию</EditableText>
                </h3>
                <p className="text-quantum-ivory/60 mb-6 font-light text-sm">
                  <EditableText section="Consultation" itemKey="form_subtitle">Выбери удобный день и время для встречи.</EditableText>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-quantum-ivory/40 font-bold ml-1">1. Выбери день</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {nextSevenDays.map((day, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleDateSelect(i)}
                          className={`flex flex-col items-center justify-center min-w-[60px] h-20 rounded-2xl border transition-all duration-300 ${
                            selectedDateIdx === i 
                              ? 'bg-quantum-amber border-quantum-amber text-quantum-emerald' 
                              : 'bg-white/5 border-white/10 text-quantum-ivory hover:border-white/30'
                          }`}
                        >
                          <span className={`text-[10px] uppercase font-bold ${selectedDateIdx === i ? 'text-quantum-emerald/60' : 'text-quantum-ivory/40'}`}>
                            {day.dayName}
                          </span>
                          <span className="text-xl font-display font-bold">{day.dayNum}</span>
                          <span className={`text-[10px] ${selectedDateIdx === i ? 'text-quantum-emerald/60' : 'text-quantum-ivory/40'}`}>
                            {day.month}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-quantum-ivory/40 font-bold ml-1">2. Выбери время</label>
                    <div className="grid grid-cols-4 gap-2">
                      {currentDayAvailability.length > 0 ? (
                        currentDayAvailability.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time)}
                            className={`py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                              selectedTime === time
                                ? 'bg-quantum-amber border-quantum-amber text-quantum-emerald'
                                : 'bg-white/5 border-white/10 text-quantum-ivory hover:border-white/30'
                            }`}
                          >
                            {time}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-4 py-4 text-center text-quantum-ivory/40 text-sm italic">
                          На этот день нет свободных слотов
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4 pt-2">
                    <label className="text-[10px] uppercase tracking-widest text-quantum-ivory/40 font-bold ml-1">3. Твои контакты</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <input 
                          required
                          type="text" 
                          value={data.name}
                          onChange={e => setData('name', e.target.value)}
                          placeholder="Имя"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-quantum-ivory placeholder:text-white/20 focus:outline-none focus:border-quantum-amber/50 focus:bg-white/10 transition-all text-sm"
                        />
                        {errors.name && <p className="text-[10px] text-red-500 ml-2">{errors.name}</p>}
                      </div>
                      <div className="space-y-1">
                        <input 
                          required
                          type="text" 
                          value={data.contact}
                          onChange={e => setData('contact', e.target.value)}
                          placeholder="+7 (___) ___-__-__ или @username"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-quantum-ivory placeholder:text-white/20 focus:outline-none focus:border-quantum-amber/50 focus:bg-white/10 transition-all text-sm"
                        />
                        <p className="text-[8px] text-quantum-ivory/30 ml-2 uppercase">Укажите телефон или Telegram</p>
                        {errors.contact && <p className="text-[10px] text-red-500 ml-2">{errors.contact}</p>}
                      </div>
                    </div>
                    <textarea 
                      rows={2}
                      value={data.request}
                      onChange={e => setData('request', e.target.value)}
                      placeholder="Твой запрос (кратко)"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-quantum-ivory placeholder:text-white/20 focus:outline-none focus:border-quantum-amber/50 focus:bg-white/10 transition-all resize-none text-sm"
                    ></textarea>
                  </div>

                  <Button 
                    disabled={processing || !selectedTime}
                    className="w-full py-5 text-base font-bold uppercase tracking-wider bg-quantum-amber text-quantum-emerald hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-quantum-emerald/30 border-t-quantum-emerald rounded-full animate-spin"></div>
                        <span>Отправка...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Записаться на {selectedTime || '...'}</span>
                        <Send size={18} />
                      </div>
                    )}
                  </Button>

                  <p className="text-[10px] text-center text-quantum-ivory/30 uppercase tracking-widest">
                    Нажимая кнопку, ты соглашаешься с политикой конфиденциальности
                  </p>
                </form>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-quantum-rose p-4 rounded-2xl shadow-xl z-20 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                    <EditableText section="Consultation" itemKey="promo_badge">Спецпредложение</EditableText>
                  </p>
                  <p className="font-display font-bold text-white">
                    <EditableText section="Consultation" itemKey="promo_title">Первая сессия -30%</EditableText>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Question Block */}
      <div className="max-w-4xl mx-auto px-4 mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 text-center"
        >
          <h3 className="font-display text-2xl font-bold text-quantum-ivory mb-4">
            <EditableText section="Consultation" itemKey="qa_title">Есть вопрос, но не знаешь, нужна ли тебе сессия?</EditableText>
          </h3>
          <p className="text-quantum-ivory/70 mb-8 font-light">
            <EditableText section="Consultation" itemKey="qa_description">Напиши мне в Telegram и кратко опиши свою ситуацию. Я помогу тебе понять, какой формат работы будет наиболее эффективным для твоего запроса.</EditableText>
          </p>
          <EditableLink section="Consultation" itemKey="qa_btn" defaultHref="https://t.me/viktoria_neustroeva">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#229ED9] text-white font-bold hover:scale-105 transition-all shadow-lg shadow-[#229ED9]/20">
              <Send size={20} />
              <span>Написать в Telegram</span>
            </div>
          </EditableLink>
        </motion.div>
      </div>
    </section>
  );
}
