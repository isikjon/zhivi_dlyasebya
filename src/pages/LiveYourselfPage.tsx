import React, { useEffect } from 'react';
import { MainProgramSection } from '../components/MainProgramSection';
import { motion } from 'motion/react';

export default function LiveYourselfPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow"
    >
      <MainProgramSection />
    </motion.div>
  );
}
