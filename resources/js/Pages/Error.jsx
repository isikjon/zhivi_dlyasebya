import React from 'react';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/../../src/components/Button';
import { Head } from '@inertiajs/react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-quantum-emerald flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Elements */}
      <div className="bg-waves"></div>
      <div className="particles"></div>
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-quantum-amber/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-quantum-rose/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-[150px] md:text-[200px] font-bold leading-none tracking-tighter text-white/5 select-none">
            404
          </h1>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-12 md:mt-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-24 h-24 rounded-full bg-quantum-amber/20 flex items-center justify-center text-quantum-amber border border-quantum-amber/30 shadow-[0_0_30px_rgba(230,180,80,0.2)]">
                <Home size={40} />
              </div>
            </motion.div>

            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
              Путь не <span className="text-quantum-amber">найден</span>
            </h2>
            
            <p className="text-quantum-ivory/60 text-lg mb-12 max-w-md mx-auto leading-relaxed">
              Похоже, эта страница находится в другом квантовом измерении. Давай вернемся к началу пути.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/">
                <Button size="lg" className="bg-quantum-amber text-quantum-emerald hover:bg-quantum-amber/90 px-8 py-6 text-sm uppercase tracking-widest font-bold">
                  <ArrowLeft size={18} className="mr-2" /> На главную
                </Button>
              </a>
              <a href="/#catalog">
                <Button variant="outline" size="lg" className="border-white/10 text-quantum-ivory hover:bg-white/5 px-8 py-6 text-sm uppercase tracking-widest font-bold">
                  Программы
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
