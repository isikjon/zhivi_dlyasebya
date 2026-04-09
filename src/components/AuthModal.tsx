import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginDemo } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Simple mock login
    login(email || 'user@example.com', name || 'Пользователь');
    onClose();
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleDemo = () => {
    loginDemo();
    onClose();
  };

  const handleAdminDemo = () => {
    loginDemo(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-quantum-emerald/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-quantum-graphite border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quantum-rose via-quantum-amber to-quantum-rose"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-quantum-ivory/50 hover:text-quantum-amber transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">
                {isLogin ? 'С возвращением' : 'Регистрация'}
              </h2>
              <p className="text-quantum-ivory/60">
                {isLogin ? 'Войдите в свое пространство трансформации' : 'Начните свой путь к истинной себе'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-quantum-rose/10 border border-quantum-rose/20 text-quantum-rose text-xs py-2 px-4 rounded-lg text-center"
                >
                  {error}
                </motion.div>
              )}

              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-quantum-rose" size={18} />
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-quantum-ivory focus:border-quantum-amber outline-none transition-colors"
                    required
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-quantum-rose" size={18} />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-quantum-ivory focus:border-quantum-amber outline-none transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-quantum-rose" size={18} />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-quantum-ivory focus:border-quantum-amber outline-none transition-colors"
                  required
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-quantum-rose" size={18} />
                  <input
                    type="password"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-quantum-ivory focus:border-quantum-amber outline-none transition-colors"
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full py-4 mt-2">
                {isLogin ? 'Войти' : 'Создать аккаунт'} <ArrowRight size={18} />
              </Button>
            </form>

            <div className="mt-6 flex flex-col items-center space-y-4">
              <button 
                onClick={handleDemo}
                className="flex items-center gap-2 text-quantum-amber hover:text-quantum-amber/80 transition-colors text-sm font-medium"
              >
                <Sparkles size={16} />
                Попробовать демо-доступ
              </button>

              <button 
                onClick={handleAdminDemo}
                className="flex items-center gap-2 text-quantum-rose hover:text-quantum-rose/80 transition-colors text-xs font-medium opacity-60"
              >
                Войти как админ (демо)
              </button>

              <p className="text-sm text-quantum-ivory/50">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                <button 
                  onClick={handleToggleMode}
                  className="ml-2 text-quantum-rose hover:text-quantum-amber transition-colors font-medium"
                >
                  {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
