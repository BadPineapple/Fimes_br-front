import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';
import { toast } from 'sonner';

interface User {
  id: number;
  nome: string;
  email: string;
  roles?: string; 
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;   
  isModerator: boolean; 
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.roles?.includes('admin') || false;
  
  const isModerator = user?.roles?.includes('editor') || false;

  useEffect(() => {
    const token = localStorage.getItem('@Filmes:token');
    const storedUser = localStorage.getItem('@Filmes:user');

    if (token && storedUser) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Caso o JSON esteja corrompido, limpa o storage
        localStorage.clear();
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      // Ajuste para a sua rota exata do backend
      const response = await api.post('auth/login', { email, senha });
      const { token, usuario } = response.data; 

      if (token) {
        localStorage.setItem('@Filmes:token', token);
        localStorage.setItem('@Filmes:user', JSON.stringify(usuario));
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(usuario);
        
        toast.success(`Bem-vindo de volta, ${usuario.nome}!`);
      }
    } catch (error: any) {
      // O erro agora é repassado com a mensagem do backend se disponível
      const mensagem = error.response?.data?.erro || "Falha no login. Verifique os dados.";
      toast.error(mensagem);
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem('@Filmes:token');
    localStorage.removeItem('@Filmes:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info("Sessão encerrada com sucesso.");
  };
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isAdmin,   
      isModerator,
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);