import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  Settings, 
  LogOut, 
  Sparkles, 
  LogIn, 
  Wallet, 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  Shield,
  Bell,
  User as UserIcon,
  Lock
} from 'lucide-react';
import { Button } from '../components/Button';
import { EditableImage } from '../components/EditableImage';
import { useAuth } from '../context/AuthContext';

type Tab = 'courses' | 'wallet' | 'settings';

export default function Cabinet() {
  const { user, logout, isAuthenticated, updateBalance, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('courses');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [newName, setNewName] = useState(user?.name || '');
  const [promoCode, setPromoCode] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-[40px] p-12 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-quantum-rose/10 flex items-center justify-center mx-auto mb-8 text-quantum-rose">
            <LogIn size={40} />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Личный кабинет</h1>
          <p className="text-quantum-ivory/60 mb-8">
            Пожалуйста, войдите в свой аккаунт, чтобы получить доступ к вашим программам и прогрессу.
          </p>
          <Button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))} size="lg" className="w-full">
            Войти в кабинет
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (!isNaN(amount) && amount > 0) {
      updateBalance(amount);
      setTopUpAmount('');
      alert(`Счёт пополнен на ${amount} ₽`);
    }
  };

  const handleSaveProfile = () => {
    if (newName.trim()) {
      updateProfile(newName.trim());
      alert('Профиль обновлен');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Новые пароли не совпадают');
      return;
    }
    // Mock password change
    alert('Пароль успешно изменен');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'QUANTUM2024') {
      updateBalance(1000, 'Промокод QUANTUM2024');
      setPromoCode('');
      alert('Промокод применен! Вам начислено 1000 ₽');
    } else {
      alert('Неверный промокод');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5 sticky top-28 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-quantum-rose/20 flex items-center justify-center text-2xl font-display text-quantum-rose border border-quantum-rose/30">
                {user?.name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-lg truncate max-w-[120px]">{user?.name}</h3>
                <p className="text-xs text-quantum-ivory/50 truncate max-w-[120px]">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('courses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'courses' ? 'bg-quantum-rose/10 text-quantum-rose font-medium' : 'text-quantum-ivory/70 hover:bg-white/5'}`}
              >
                <PlayCircle size={18} /> Мои курсы
              </button>
              <button 
                onClick={() => setActiveTab('wallet')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'wallet' ? 'bg-quantum-rose/10 text-quantum-rose font-medium' : 'text-quantum-ivory/70 hover:bg-white/5'}`}
              >
                <Wallet size={18} /> Счёт
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-quantum-rose/10 text-quantum-rose font-medium' : 'text-quantum-ivory/70 hover:bg-white/5'}`}
              >
                <Settings size={18} /> Настройки
              </button>
              {user?.isAdmin && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-quantum-amber hover:bg-quantum-amber/10 font-medium"
                >
                  <Shield size={18} /> Админ-панель
                </button>
              )}
              <div className="pt-4 mt-4 border-t border-quantum-amber/10">
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-quantum-rose/10 text-quantum-rose transition-colors"
                >
                  <LogOut size={18} /> Выйти
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {activeTab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="font-display text-3xl font-bold mb-8">Мои программы</h1>
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-2xl"
                  >
                    <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden shrink-0 relative group">
                      <EditableImage 
                        imageId="cabinet_course_1"
                        defaultSrc="https://picsum.photos/seed/prog1/400/400" 
                        alt="Course" 
                        containerClassName="w-full h-full"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <PlayCircle size={48} className="text-white/80" />
                      </div>
                    </div>
                    
                    <div className="flex-grow w-full">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display text-2xl font-bold">Знакомство с собой</h3>
                        <span className="px-3 py-1 rounded-full bg-quantum-rose/20 text-quantum-rose text-xs font-medium border border-quantum-rose/30">В процессе</span>
                      </div>
                      <p className="text-quantum-ivory/60 text-sm mb-6">Бесплатный вводный курс</p>
                      
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-quantum-ivory/70">Прогресс</span>
                          <span className="font-bold text-quantum-rose">33%</span>
                        </div>
                        <div className="w-full h-2 bg-quantum-rose/10 rounded-full overflow-hidden">
                          <div className="h-full bg-quantum-rose w-[33%] rounded-full"></div>
                        </div>
                        <p className="text-xs text-quantum-ivory/40 mt-2">Пройдено 1 из 3 дней</p>
                      </div>
                      
                      <Link to="/program/free">
                        <Button size="sm">Продолжить обучение</Button>
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border border-dashed border-quantum-amber/20 rounded-3xl p-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-quantum-amber/5 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={24} className="text-quantum-ivory/40" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">Готова к большему?</h3>
                    <p className="text-quantum-ivory/60 mb-6 max-w-md mx-auto">
                      Открой для себя глубокие трансформационные программы в нашем каталоге.
                    </p>
                    <Link to="/catalog">
                      <Button variant="outline" size="sm">Перейти в каталог</Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h1 className="font-display text-3xl font-bold">Мой счёт</h1>
                  <button 
                    onClick={() => setActiveTab('courses')}
                    className="text-sm text-quantum-rose hover:underline flex items-center gap-1"
                  >
                    <PlayCircle size={14} /> Вернуться к курсам
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-quantum-emerald to-quantum-graphite p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Wallet size={120} />
                    </div>
                    <p className="text-quantum-ivory/60 mb-2">Текущий баланс</p>
                    <h2 className="text-5xl font-display font-bold text-quantum-amber mb-8">
                      {user?.balance.toLocaleString()} ₽
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-quantum-ivory/40">
                      <ShieldCheck size={16} />
                      Безопасные платежи
                    </div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                    <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                      <Plus size={20} className="text-quantum-rose" /> Пополнить баланс
                    </h3>
                    <form onSubmit={handleTopUp} className="space-y-4">
                      <div>
                        <label className="block text-sm text-quantum-ivory/60 mb-2">Сумма пополнения (₽)</label>
                        <input 
                          type="number"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          placeholder="1000"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-quantum-ivory focus:border-quantum-amber outline-none transition-colors"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[1000, 5000, 10000].map(amount => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setTopUpAmount(amount.toString())}
                            className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs hover:border-quantum-rose transition-colors"
                          >
                            +{amount}
                          </button>
                        ))}
                      </div>
                      <Button type="submit" className="w-full py-4">
                        Пополнить <CreditCard size={18} className="ml-2" />
                      </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h4 className="text-sm font-bold mb-4">Есть промокод?</h4>
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <input 
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Введите код"
                          className="flex-grow bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-quantum-ivory outline-none focus:border-quantum-amber transition-colors"
                        />
                        <Button type="submit" variant="outline" size="sm">Применить</Button>
                      </form>
                      <p className="text-[10px] text-quantum-ivory/30 mt-2">Попробуйте: QUANTUM2024</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="font-display text-xl font-bold mb-6">История операций</h3>
                  <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                    {user?.transactions && user.transactions.length > 0 ? (
                      <div className="divide-y divide-white/5">
                        {user.transactions.map((t) => (
                          <div key={t.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'topup' ? 'bg-quantum-emerald/20 text-quantum-emerald' : 'bg-quantum-rose/20 text-quantum-rose'}`}>
                                {t.type === 'topup' ? <Plus size={18} /> : <CreditCard size={18} />}
                              </div>
                              <div>
                                <p className="font-medium">{t.description}</p>
                                <p className="text-xs text-quantum-ivory/40">{new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <div className={`font-display font-bold ${t.type === 'topup' ? 'text-quantum-emerald' : 'text-quantum-rose'}`}>
                              {t.type === 'topup' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-quantum-ivory/40 italic">
                        История операций пока пуста
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="font-display text-3xl font-bold mb-8">Настройки профиля</h1>
                <div className="max-w-2xl space-y-8">
                  <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                    <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                      <UserIcon size={20} className="text-quantum-rose" /> Основные данные
                    </h3>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-quantum-ivory/60 mb-2">Имя</label>
                          <input 
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-quantum-ivory/60 mb-2">E-mail</label>
                          <input 
                            type="email"
                            defaultValue={user?.email}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-quantum-ivory/40 outline-none cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <Button size="sm" onClick={handleSaveProfile}>Сохранить изменения</Button>
                    </div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                    <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                      <Lock size={20} className="text-quantum-amber" /> Безопасность
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm text-quantum-ivory/60 mb-2">Текущий пароль</label>
                        <input 
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-quantum-ivory/60 mb-2">Новый пароль</label>
                          <input 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-quantum-ivory/60 mb-2">Подтверждение</label>
                          <input 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-quantum-ivory outline-none focus:border-quantum-rose transition-colors"
                          />
                        </div>
                      </div>
                      <Button type="submit" size="sm">Сменить пароль</Button>
                    </form>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                    <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2 text-quantum-rose">
                      <LogOut size={20} /> Опасная зона
                    </h3>
                    <p className="text-sm text-quantum-ivory/50 mb-6">
                      Удаление аккаунта приведет к безвозвратной потере доступа ко всем купленным курсам и вашему прогрессу.
                    </p>
                    <Button variant="outline" className="border-quantum-rose/30 text-quantum-rose hover:bg-quantum-rose/10">
                      Удалить аккаунт
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
