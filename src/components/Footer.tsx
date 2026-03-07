import { Film, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card py-8 mt-auto">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Film className="w-6 h-6 text-secondary" />
          <span className="font-display text-xl font-bold text-foreground">
            Filmes<span className="text-secondary">.br</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/filmes" className="hover:text-foreground transition-colors">Filmes</Link>
          <Link to="/indicacao" className="hover:text-foreground transition-colors">Indicação</Link>
          <Link to="/apoio" className="hover:text-foreground transition-colors">Apoio</Link>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Feito com <Heart className="w-3 h-3 text-destructive fill-destructive" /> para o cinema brasileiro
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
