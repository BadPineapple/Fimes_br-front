import { Link } from "react-router-dom";
import { Star, Film as FilmIcon } from "lucide-react";
import GenreBadge from "./GenreBadge";

interface FilmCardProps {
 filme: {
  id: number;
  titulo: string;
  ano: number;
  nota_externa: number; // Mudou de 'nota'
  genero?: string | string[]; 
  imagens: string; // Mudou de 'imagem_capa'
}
}

const FilmCard = ({ filme }: FilmCardProps) => {
  // Converte a string de gêneros do banco de dados para array, caso venha como texto
  const listaGeneros = Array.isArray(filme.genero) 
    ? filme.genero 
    : (typeof filme.genero === 'string' ? filme.genero.split(',') : []);

  return (
    <Link
      to={`/filme/${filme.id}`}
      className="group block rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-card"
    >
      <div className="aspect-[2/3] gradient-card flex items-center justify-center relative overflow-hidden">
        {/* Alterado para puxar a coluna 'imagens' do banco */}
        {filme.imagens ? (
          <img
            src={filme.imagens}
            alt={filme.titulo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <FilmIcon className="w-16 h-16 text-primary/30" />
        )}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {filme.titulo}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filme.ano}</span>
          <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
          {/* Alterado para puxar a coluna 'nota_externa' do banco */}
          <span className="font-medium text-foreground">{filme.nota_externa}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {/* Utilizando o array listaGeneros tratado e limpando espaços */}
          {listaGeneros.slice(0, 2).map((g) => (
            <GenreBadge key={g.trim()} genre={g.trim()} />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default FilmCard;