import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X, User, Phone, Mail, Send, LogIn, LogOut } from 'lucide-react';
import { TestimonialsSection } from './TestimonialsSection';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener('openAuthModal', handleOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleOpenAuth);
  }, []);

  const showTestimonials = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="bg-waves"></div>
      <div className="particles"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-quantum-emerald/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="font-display font-bold text-2xl tracking-tight">
              ЖИВИ <span className="text-quantum-amber">СЕБЯ</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`transition-colors text-sm uppercase tracking-widest font-medium ${location.pathname === '/' ? 'text-quantum-amber' : 'text-quantum-ivory/80 hover:text-quantum-amber'}`}>Главная</Link>
              <Link to="/live-yourself" className={`transition-colors text-sm uppercase tracking-widest font-medium ${location.pathname === '/live-yourself' ? 'text-quantum-amber' : 'text-quantum-ivory/80 hover:text-quantum-amber'}`}>Живи Себя</Link>
              <Link to="/archetypes" className={`transition-colors text-sm uppercase tracking-widest font-medium ${location.pathname === '/archetypes' ? 'text-quantum-amber' : 'text-quantum-ivory/80 hover:text-quantum-amber'}`}>Архетипы</Link>
              <Link to="/catalog" className={`transition-colors text-sm uppercase tracking-widest font-medium ${location.pathname === '/catalog' ? 'text-quantum-amber' : 'text-quantum-ivory/80 hover:text-quantum-amber'}`}>Программы</Link>
              <Link to="/program/free" className={`transition-colors text-sm uppercase tracking-widest font-medium ${location.pathname === '/program/free' ? 'text-quantum-amber' : 'text-quantum-ivory/80 hover:text-quantum-amber'}`}>Бесплатный курс</Link>
              
              <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-6">
                    <Link to="/cabinet" className={`flex items-center space-x-2 transition-colors text-sm uppercase tracking-widest font-medium ${location.pathname === '/cabinet' ? 'text-quantum-amber' : 'text-quantum-ivory/80 hover:text-quantum-amber'}`}>
                      <User size={18} />
                      <span>Кабинет</span>
                    </Link>
                    <button 
                      onClick={logout}
                      className="text-quantum-ivory/50 hover:text-quantum-rose transition-colors"
                      title="Выйти"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-2 text-quantum-amber hover:text-quantum-amber/80 transition-colors text-sm uppercase tracking-widest font-medium"
                  >
                    <LogIn size={18} />
                    <span>Войти</span>
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-quantum-ivory hover:text-quantum-amber transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <motion.div 
        initial={false}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none'
        }}
        className="fixed inset-0 z-40 bg-quantum-emerald/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
      >
        <Link to="/" className={`font-display text-3xl transition-colors ${location.pathname === '/' ? 'text-quantum-amber' : 'hover:text-quantum-amber'}`}>Главная</Link>
        <Link to="/live-yourself" className={`font-display text-3xl transition-colors ${location.pathname === '/live-yourself' ? 'text-quantum-amber' : 'hover:text-quantum-amber'}`}>Живи Себя</Link>
        <Link to="/archetypes" className={`font-display text-3xl transition-colors ${location.pathname === '/archetypes' ? 'text-quantum-amber' : 'hover:text-quantum-amber'}`}>Архетипы</Link>
        <Link to="/catalog" className={`font-display text-3xl transition-colors ${location.pathname === '/catalog' ? 'text-quantum-amber' : 'hover:text-quantum-amber'}`}>Программы</Link>
        <Link to="/program/free" className={`font-display text-3xl transition-colors ${location.pathname === '/program/free' ? 'text-quantum-amber' : 'hover:text-quantum-amber'}`}>Бесплатный курс</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/cabinet" className={`font-display text-3xl transition-colors flex items-center space-x-3 ${location.pathname === '/cabinet' ? 'text-quantum-amber' : 'hover:text-quantum-amber'}`}>
              <User size={28} />
              <span>Кабинет</span>
            </Link>
            <button 
              onClick={logout}
              className="font-display text-3xl text-quantum-rose flex items-center space-x-3"
            >
              <LogOut size={28} />
              <span>Выйти</span>
            </button>
          </>
        ) : (
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              setIsAuthModalOpen(true);
            }}
            className="font-display text-3xl text-quantum-amber flex items-center space-x-3"
          >
            <LogIn size={28} />
            <span>Войти</span>
          </button>
        )}
      </motion.div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Main Content */}
      <main className="flex-grow pt-20 relative z-10 flex flex-col">
        <Outlet />
      </main>

      {showTestimonials && <TestimonialsSection />}

      {/* Footer */}
      <footer className="bg-quantum-graphite border-t border-white/10 pt-16 pb-8 px-4 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Brand & About */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-bold text-2xl mb-4">ЖИВИ <span className="text-quantum-amber">СЕБЯ</span></h3>
              <p className="text-quantum-ivory/70 text-sm leading-relaxed max-w-md mb-6">
                Авторский проект Виктории Неустроевой. Квантовый психолог, проводник к твоей истинной природе. Интерактивное пространство выбора и глубоких трансформаций.
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="font-display font-bold text-quantum-amber mb-6 uppercase tracking-wider text-sm">Навигация</h4>
              <ul className="space-y-3 text-sm text-quantum-ivory/80">
                <li><Link to="/" className="hover:text-quantum-amber transition-colors">Главная</Link></li>
                <li><Link to="/live-yourself" className="hover:text-quantum-amber transition-colors">Живи Себя</Link></li>
                <li><Link to="/archetypes" className="hover:text-quantum-amber transition-colors">Архетипы</Link></li>
                <li><Link to="/catalog" className="hover:text-quantum-amber transition-colors">Программы</Link></li>
                <li><Link to="/program/free" className="hover:text-quantum-amber transition-colors">Бесплатный курс</Link></li>
                <li><Link to="/cabinet" className="hover:text-quantum-amber transition-colors">Личный кабинет</Link></li>
              </ul>
            </div>

            {/* Column 3: Contacts */}
            <div>
              <h4 className="font-display font-bold text-quantum-amber mb-6 uppercase tracking-wider text-sm">Контакты</h4>
              <ul className="space-y-4 text-sm text-quantum-ivory/80">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-quantum-rose" />
                  <a href="tel:+79990000000" className="hover:text-quantum-amber transition-colors">+7 (999) 000-00-00</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-quantum-rose" />
                  <a href="mailto:hello@zhivisebya.ru" className="hover:text-quantum-amber transition-colors">hello@zhivisebya.ru</a>
                </li>
                <li className="flex items-center gap-3">
                  <Send size={16} className="text-quantum-rose" />
                  <a href="https://t.me/victoria_neustroeva" target="_blank" rel="noreferrer" className="hover:text-quantum-amber transition-colors">@victoria_neustroeva</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom row: Legal */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-quantum-ivory/50">
            <p>© {new Date().getFullYear()} Виктория Неустроева. Все права защищены.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-quantum-amber transition-colors">Оферта</a>
              <a href="#" className="hover:text-quantum-amber transition-colors">Политика конфиденциальности</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
