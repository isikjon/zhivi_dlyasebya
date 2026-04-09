import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function ThankYou() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full bg-quantum-graphite/60 backdrop-blur-xl border border-quantum-amber/30 rounded-[40px] p-12 text-center relative overflow-hidden"
      >
        {/* Glow effect behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-quantum-rose/5 blur-[100px] rounded-full z-0"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto bg-quantum-rose/10 rounded-full flex items-center justify-center mb-8 border border-quantum-rose/20">
            <Sparkles size={32} className="text-quantum-rose" />
          </div>
          
          <h1 className="font-display text-4xl font-bold mb-4 text-quantum-ivory">
            Выбор <span className="text-quantum-rose italic">сделан</span>
          </h1>
          
          <p className="text-quantum-ivory/80 text-lg mb-10 leading-relaxed">
            Твой квантовый переход начался. Доступ к программе уже ждет тебя в личном кабинете.
          </p>
          
          <Link to="/cabinet">
            <Button size="lg" className="w-full">
              Перейти в кабинет
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
