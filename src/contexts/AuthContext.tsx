import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';
import { toast } from 'sonner';

// Defina os dados do usuário com base no que o seu SELECT do banco retorna
interface User {
  id: number;
  nome: string; // Vem de p.NOMUSER
  email: string;
  roles?: string; // Vem de GROUP_CONCAT(r.NOMROL)
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

  // 1. Efeito que roda toda vez que o site é aberto (mantém o usuário logado)
  useEffect(() => {
    const token = localStorage.getItem('@Filmes:token');
    const storedUser = localStorage.getItem('@Filmes:user');

    if (token && storedUser) {
      // Injeta o token em todas as requisições futuras do Axios automaticamente
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // 2. Função de Login (Chamada lá no Entrar.tsx)
  const login = async (email: string, senha: string) => {
    try {
      // A rota deve ser a mesma configurada no seu routes.js do back-end
      const response = await api.post('auth/login', { email, senha });

      // O seu loginController deve retornar o token e os dados do usuário
      const { token, usuario } = response.data; 

      if (token) {
        // Salva os dados no navegador
        localStorage.setItem('@Filmes:token', token);
        localStorage.setItem('@Filmes:user', JSON.stringify(usuario));
        
        // Configura a autorização para as próximas chamadas
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Atualiza o estado da aplicação
        setUser(usuario);
      }
    } catch (error) {
      // Repassa o erro para o Entrar.tsx mostrar o Toast vermelho
      throw error; 
    }
  };

  // 3. Função de Logout
  const logout = () => {
    localStorage.removeItem('@Filmes:token');
    localStorage.removeItem('@Filmes:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info("Sessão encerrada com sucesso.");
  };

  const isAdmin = user?.roles?.includes('admin') ?? false;
  const isModerator = user?.roles?.includes('moderator') ?? false;

    return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin, isModerator, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);