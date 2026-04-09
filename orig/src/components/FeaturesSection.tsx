import React from 'react';
import { motion } from 'motion/react';
import { AudioPlayer } from './AudioPlayer';

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-quantum-ivory">
            Твой путь к <span className="text-quantum-rose italic">себе</span>
          </h2>
          <p className="text-quantum-ivory/70 max-w-2xl mx-auto">
            Каждый шаг на этой платформе создан для того, чтобы мягко подтолкнуть тебя к верному решению.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Осознанность", 
              desc: "Глубокие практики для понимания своих истинных желаний.",
              audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            { 
              title: "Трансформация", 
              desc: "Квантовый скачок в твоем восприятии реальности.",
              audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            },
            { 
              title: "Действие", 
              desc: "Четкие шаги для воплощения задуманного в жизнь.",
              audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-quantum-rose/50 transition-colors group flex flex-col h-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-quantum-rose/10 text-quantum-rose flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="font-display font-bold text-xl">0{i+1}</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-quantum-ivory/60 leading-relaxed flex-grow">{item.desc}</p>
              
              <AudioPlayer src={item.audio} title={`Практика: ${item.title}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
