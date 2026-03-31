import { Link } from "react-router-dom";
import { Star, Film as FilmIcon } from "lucide-react";
import GenreBadge from "./GenreBadge";

// 1. Definição da Interface para o TypeScript
interface FilmCardProps {
  filme: {
    IDFIL: number;
    NOMFIL: string;
    ANO: number;
    NOTEXT: number | string;
    GENEROS?: string | any[]; 
    IMAGEM?: { IDIMG: number; LOCAL: string }[];
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const FilmCard = ({ filme }: FilmCardProps) => {
  
  // 2. Lógica para tratar os Géneros (String do GROUP_CONCAT ou Array de objetos)
  const renderGeneros = () => {
    if (!filme.GENEROS) return null;

    let arrayGeneros: any[] = [];
    if (Array.isArray(filme.GENEROS)) {
      arrayGeneros = filme.GENEROS;
    } else if (typeof filme.GENEROS === 'string') {
      arrayGeneros = filme.GENEROS.split(',').map(g => g.trim());
    }

    // Mostra apenas os 2 primeiros badges para manter o layout limpo
    return arrayGeneros.slice(0, 2).map((g, index) => {
      const nome = typeof g === 'object' ? g.NOMGEN : g;
      const id = typeof g === 'object' ? g.IDGEN : index;
      return <GenreBadge key={id} genre={nome} />;
    });
  };

  return (
    <Link
      to={`/filme/${filme.IDFIL}`}
      className="group block rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-card border border-transparent hover:border-primary/20"
    >
      {/* 3. Container da Imagem (Poster) */}
      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center shadow-sm relative">
        {filme.IMAGEM && filme.IMAGEM.length > 0 ? (
          <img 
            src={`${API_BASE_URL}${filme.IMAGEM[0].LOCAL}`} 
            alt={filme.NOMFIL} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            onError={(e) => {
              // Caso o ficheiro tenha sido apagado do servidor mas ainda esteja no banco
              (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x600?text=Sem+Imagem';
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
            <FilmIcon className="w-12 h-12" />
            <span className="text-[10px] font-bold uppercase tracking-widest">No Poster</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {filme.NOMFIL}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{filme.ANO}</span>
            <span className="opacity-30">|</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-secondary text-secondary" />
              <span className="font-bold text-foreground">{filme.NOTEXT || "0.0"}</span>
            </div>
          </div>
        </div>

        {/* Tags de Género */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {renderGeneros()}
          {Array.isArray(filme.GENEROS) && filme.GENEROS.length > 2 && (
             <span className="text-[10px] text-muted-foreground self-center">
               +{filme.GENEROS.length - 2}
             </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FilmCard;