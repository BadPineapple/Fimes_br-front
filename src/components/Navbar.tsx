import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, Search, Heart, Sparkles, LogIn, Menu, X, Shield, User, Settings, List, LogOut, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, isAdmin, isModerator, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { to: "/", label: "Home", icon: <Film className="w-4 h-4" /> },
    { to: "/filmes", label: "Filmes", icon: <Search className="w-4 h-4" /> },
    { to: "/indicacao", label: "Indicação", icon: <Sparkles className="w-4 h-4" /> },
    { to: "/apoio", label: "Apoio", icon: <Heart className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const initials = user?.nome
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 gradient-hero border-b border-primary/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <Film className="w-7 h-7 text-secondary" />
          <span className="font-display text-2xl font-bold text-primary-foreground">
            Filmes<span className="text-secondary">.br</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary-foreground/20 text-secondary"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {(isAdmin || isModerator) && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:bg-primary-foreground/10 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Backstage
            </Link>
          )}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-secondary text-secondary-foreground font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-primary-foreground">{user?.nome?.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <User className="w-4 h-4 mr-2" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <Settings className="w-4 h-4 mr-2" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <List className="w-4 h-4 mr-2" /> Minhas Listas
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "light" ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                  {theme === "light" ? "Tema Escuro" : "Tema Claro"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/entrar"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden gradient-hero border-t border-primary-foreground/10 pb-4 px-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive(link.to)
                  ? "bg-primary-foreground/20 text-secondary"
                  : "text-primary-foreground/80"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {(isAdmin || isModerator) && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-secondary text-sm font-semibold"
            >
              <Shield className="w-4 h-4" />
              Backstage
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link
                to="/perfil"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-primary-foreground text-sm font-medium"
              >
                <User className="w-4 h-4" /> Perfil
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-destructive text-sm font-medium w-full"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </>
          ) : (
            <Link
              to="/entrar"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
