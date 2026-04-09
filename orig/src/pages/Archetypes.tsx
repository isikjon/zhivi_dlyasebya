import React, { useEffect } from 'react';
import { ArchetypesSection } from '../components/ArchetypesSection';

export default function Archetypes() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <ArchetypesSection />
    </div>
  );
}
