import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12">
            {/* Background elements to match the site */}
            <div className="fixed inset-0 bg-[#0A2E2E] -z-20"></div>
            <div className="bg-waves"></div>
            <div className="particles"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-3xl font-bold tracking-tighter text-quantum-ivory font-syne">
                            ЖИВИ <span className="text-quantum-amber">СЕБЯ</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-quantum-emerald/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-quantum-amber/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-quantum-amber/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-quantum-ivory/40 hover:text-quantum-amber transition-colors text-sm uppercase tracking-widest font-medium">
                        ← Вернуться на главную
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
