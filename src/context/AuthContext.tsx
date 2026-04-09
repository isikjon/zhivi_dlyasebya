import React, { createContext, useContext, useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'topup' | 'purchase';
  amount: number;
  date: string;
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isDemo?: boolean;
  isAdmin?: boolean;
  balance: number;
  achievements: string[];
  transactions: Transaction[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  loginDemo: (asAdmin?: boolean) => void;
  logout: () => void;
  updateBalance: (amount: number, description?: string) => void;
  updateProfile: (name: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('quantum_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, name: string) => {
    const isAdmin = email.toLowerCase() === 'admin@quantum.ru';
    const newUser: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      email, 
      isAdmin,
      balance: 0, 
      achievements: ['Первый шаг'],
      transactions: []
    };
    setUser(newUser);
    localStorage.setItem('quantum_user', JSON.stringify(newUser));
  };

  const loginDemo = (asAdmin: boolean = false) => {
    const demoUser: User = { 
      id: asAdmin ? 'admin' : 'demo', 
      name: asAdmin ? 'Администратор' : 'Гость (Демо)', 
      email: asAdmin ? 'admin@quantum.ru' : 'demo@example.com', 
      isDemo: true, 
      isAdmin: asAdmin,
      balance: asAdmin ? 999999 : 5000, 
      achievements: asAdmin ? ['Создатель'] : ['Первый шаг', 'Исследователь'],
      transactions: asAdmin ? [] : [
        { id: '1', type: 'topup', amount: 5000, date: new Date().toISOString(), description: 'Стартовый капитал' }
      ]
    };
    setUser(demoUser);
    localStorage.setItem('quantum_user', JSON.stringify(demoUser));
  };

  const updateBalance = (amount: number, description: string = 'Пополнение счёта') => {
    if (user) {
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: amount > 0 ? 'topup' : 'purchase',
        amount: Math.abs(amount),
        date: new Date().toISOString(),
        description
      };
      const updatedUser = { 
        ...user, 
        balance: user.balance + amount,
        transactions: [newTransaction, ...user.transactions]
      };
      setUser(updatedUser);
      localStorage.setItem('quantum_user', JSON.stringify(updatedUser));
    }
  };

  const updateProfile = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem('quantum_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quantum_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginDemo, logout, updateBalance, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
