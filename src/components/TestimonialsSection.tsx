import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { EditableImage } from './EditableImage';

const testimonials = [
  {
    id: 1,
    name: "Анна",
    age: "34 года",
    city: "Москва",
    text: "«Долго не решалась на индивидуальную консультацию, думала, что справлюсь сама. Но сама я только глубже закапывалась. Одна встреча с Викторией заменила полгода терапии. Она не нагружает терминами, говорит просто и по делу. И главное — после разговора остается легкость и ясность, а не тяжесть \"работы над собой\".»",
    program: "Индивидуальная консультация",
    image: "https://picsum.photos/seed/anna/200/200"
  },
  {
    id: 2,
    name: "Екатерина",
    age: "42 года",
    city: "Санкт-Петербург",
    text: "«Я пришла к Виктории с ощущением, что живу не свою жизнь. Вроде всё есть, а счастья нет. После 21 дня курса \"ЖИВИ СЕБЯ\" я впервые за 10 лет почувствовала опору в себе. Перестала оглядываться на маму, мужа, подруг. Теперь я сама выбираю. И это состояние бесценно.»",
    program: "Курс «ЖИВИ СЕБЯ»",
    image: "https://picsum.photos/seed/ekaterina/200/200"
  },
  {
    id: 3,
    name: "Дарья",
    age: "37 лет",
    city: "Краснодар",
    text: "«Квантовый смыл — это магия. Честно. Я шла с запросом на деньги, а ушла с ощущением, что смыла с себя всю старую кожу. Отношения с мужем вышли на новый уровень, потому что я перестала быть \"удобной\". Теперь я живая. И это лучший подарок, который я сделала себе в этом году.»",
    program: "Программа «Квантовый смыл»",
    image: "https://picsum.photos/seed/daria/200/200"
  },
  {
    id: 4,
    name: "Татьяна",
    age: "51 год",
    city: "Новосибирск",
    text: "«Виктория — это не просто психолог. Это проводник. Она видит то, что скрыто глубоко, и достает это очень бережно, чтобы не ранить. Я прошла \"Тайну женских архетипов\" и наконец-то подружилась со своей \"Странницей\". Перестала бояться перемен — и сразу подвернулась работа мечты.»",
    program: "Программа «Тайна женских архетипов»",
    image: "https://picsum.photos/seed/tatiana/200/200"
  }
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setActiveIndex(0);
        } else {
          const cardWidth = container.children[0]?.clientWidth || 0;
          const gap = 24;
          const nextScroll = container.scrollLeft + cardWidth + gap;
          container.scrollTo({ left: nextScroll, behavior: 'smooth' });
          
          const newIndex = Math.min(
            testimonials.length - 1,
            Math.round(nextScroll / (cardWidth + gap))
          );
          setActiveIndex(newIndex);
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 24;
      const index = Math.round(container.scrollLeft / (cardWidth + gap));
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 24;
      container.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const next = () => {
    const nextIndex = (activeIndex + 1) % testimonials.length;
    scrollTo(nextIndex);
  };

  const prev = () => {
    const prevIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    scrollTo(prevIndex);
  };

  return (
    <section className="py-24 relative z-10 overflow-hidden bg-black/10">
      {/* Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,184,185,0.05)_0%,transparent_100%)] opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,240,238,0.03)_0%,transparent_100%)] opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 text-quantum-rose text-sm tracking-widest mb-6 font-medium">
            <Sparkles size={14} />
            150+ ЖЕНЩИН УЖЕ ВЫБРАЛИ СЕБЯ
            <Sparkles size={14} />
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 uppercase tracking-tight text-quantum-ivory"
          >
            <span>Женщины, которые</span><br />
            <span className="text-quantum-rose">выбрали себя</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-quantum-rose italic font-light mt-6"
          >
            Их истории — твое разрешение
          </motion.p>
        </div>

        {/* Carousel */}
        <div 
          className="relative z-10 -mx-4 px-4 md:mx-0 md:px-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-4"
          >
            {testimonials.map((test) => (
              <div 
                key={test.id}
                className="w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.3333%-16px)] shrink-0 snap-center bg-white/5 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-2xl hover:border-quantum-rose/80 transition-all duration-500 hover:-translate-y-2 group relative flex flex-col"
              >
                <Quote className="absolute top-6 right-6 text-quantum-amber/20 w-12 h-12 group-hover:text-quantum-amber/40 transition-colors" />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-quantum-amber shrink-0">
                    <EditableImage 
                      imageId={`testimonial_${test.id}`}
                      defaultSrc={test.image}
                      alt={test.name}
                      containerClassName="w-full h-full"
                      imageClassName="grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-quantum-ivory">{test.name}</h4>
                    <p className="text-quantum-rose font-light">{test.age}</p>
                    <p className="text-quantum-rose/80 text-sm italic">{test.city}</p>
                  </div>
                </div>
                
                <p className="text-quantum-ivory/90 leading-relaxed font-light mb-8 text-sm md:text-base flex-grow">
                  {test.text}
                </p>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-quantum-amber/10 border border-quantum-amber/20 text-quantum-amber text-xs uppercase tracking-wider font-semibold self-start">
                  <Sparkles size={12} />
                  {test.program}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center gap-10 mt-12 relative z-10">
          <div className="flex justify-center items-center gap-6">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-quantum-rose/30 flex items-center justify-center text-quantum-rose hover:bg-quantum-rose hover:text-white transition-all hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-quantum-rose scale-150 shadow-[0_0_10px_rgba(0,0,0,0.2)]' : 'bg-quantum-rose/30 hover:bg-quantum-rose/60'}`}
                />
              ))}
            </div>
            
            <button onClick={next} className="w-12 h-12 rounded-full border border-quantum-rose/30 flex items-center justify-center text-quantum-rose hover:bg-quantum-rose hover:text-white transition-all hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center relative z-10 max-w-2xl mx-auto">
          <p className="text-quantum-ivory/80 text-lg mb-8 font-light italic">
            Каждая из них когда-то сомневалась. Так же, как ты сейчас.
          </p>
          
          <Link to="/catalog">
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-quantum-rose text-quantum-rose hover:bg-quantum-rose hover:text-quantum-ivory rounded-[40px] px-10 py-4 text-lg transition-all duration-300"
            >
              Я выбираю себя
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
