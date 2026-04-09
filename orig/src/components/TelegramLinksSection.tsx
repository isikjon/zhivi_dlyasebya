import React from 'react';
import { motion } from 'motion/react';
import { Send, Headphones, ArrowRight } from 'lucide-react';

export function TelegramLinksSection() {
  return (
    <section className="py-12 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Main Telegram Channel */}
          <motion.a
            href="https://t.me/liveyouresse"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[32px] bg-white/5 border border-white/5 p-8 md:p-10 transition-all duration-500 hover:border-quantum-rose/50 hover:shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,184,185,0.05)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-quantum-amber/10 flex items-center justify-center text-quantum-amber shrink-0 group-hover:scale-110 transition-transform duration-500">
                <Send size={28} />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-quantum-ivory mb-2 group-hover:text-quantum-amber transition-colors">Больше трансформаций</h3>
                <p className="text-quantum-ivory/60 font-light">в моем Telegram-канале</p>
              </div>
            </div>
            <div className="relative z-10 shrink-0 self-end sm:self-auto">
              <div className="w-12 h-12 rounded-full border border-quantum-amber/20 flex items-center justify-center group-hover:border-quantum-amber group-hover:bg-quantum-amber/10 transition-colors duration-300">
                <ArrowRight className="text-quantum-ivory/50 group-hover:text-quantum-amber group-hover:translate-x-1 transition-all duration-300" size={24} />
              </div>
            </div>
          </motion.a>

          {/* Card 2: Meditations Channel */}
          <motion.a
            href="https://t.me/neustroevaMeditation"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-[32px] bg-white/5 border border-white/5 p-8 md:p-10 transition-all duration-500 hover:border-quantum-rose/50 hover:shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,184,185,0.03)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-quantum-rose/10 flex items-center justify-center text-quantum-rose shrink-0 group-hover:scale-110 transition-transform duration-500">
                <Headphones size={28} />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-quantum-ivory mb-2 group-hover:text-quantum-rose transition-colors">Исцеляющие медитации</h3>
                <p className="text-quantum-ivory/60 font-light">в отдельном Telegram-канале</p>
              </div>
            </div>
            <div className="relative z-10 shrink-0 self-end sm:self-auto">
              <div className="w-12 h-12 rounded-full border border-quantum-rose/20 flex items-center justify-center group-hover:border-quantum-rose group-hover:bg-quantum-rose/10 transition-colors duration-300">
                <ArrowRight className="text-quantum-ivory/50 group-hover:text-quantum-rose group-hover:translate-x-1 transition-all duration-300" size={24} />
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
