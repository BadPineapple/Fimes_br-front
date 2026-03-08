import { Heart, Bookmark, ListPlus, Clock, Star, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

interface FilmeSidebarProps {
  filme: any;
}

const FilmeSidebar = ({ filme }: FilmeSidebarProps) => {
  const [favorito, setFavorito] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [listasAberto, setListasAberto] = useState(false);

  // Mock lists
  const minhasListas = [
    { id: 1, nome: "Favoritos de Sempre" },
    { id: 2, nome: "Para Assistir" },
    { id: 3, nome: "Melhores Comédias" },
  ];

  // Mock extra info
  const elenco = filme.elenco || ["Alexandre Rodrigues", "Leandro Firmino", "Phellipe Haagensen", "Douglas Silva"];
  const duracao = filme.duracao || "130 min";
  const notaSite = filme.nota_site || 8.4;
  const classificacao = filme.classificacao || "16 anos";

  const handleFavorito = () => {
    setFavorito(!favorito);
    toast.success(favorito ? "Removido dos favoritos" : "Adicionado aos favoritos!");
  };

  const handleWatchlist = () => {
    setWatchlist(!watchlist);
    toast.success(watchlist ? "Removido da watchlist" : "Adicionado à watchlist!");
  };

  const handleAddToList = (listaNome: string) => {
    toast.success(`Adicionado à lista "${listaNome}"!`);
    setListasAberto(false);
  };

  return (
    <div className="space-y-4">
      {/* Ações rápidas */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <Button
            variant={favorito ? "default" : "outline"}
            className="w-full justify-start gap-2"
            onClick={handleFavorito}
          >
            <Heart className={`w-4 h-4 ${favorito ? "fill-current" : ""}`} />
            {favorito ? "Nos Favoritos" : "Adicionar aos Favoritos"}
          </Button>

          <Button
            variant={watchlist ? "secondary" : "outline"}
            className="w-full justify-start gap-2"
            onClick={handleWatchlist}
          >
            <Bookmark className={`w-4 h-4 ${watchlist ? "fill-current" : ""}`} />
            {watchlist ? "Na Watchlist" : "Adicionar à Watchlist"}
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between gap-2"
              onClick={() => setListasAberto(!listasAberto)}
            >
              <span className="flex items-center gap-2">
                <ListPlus className="w-4 h-4" />
                Adicionar à Lista
              </span>
              {listasAberto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            {listasAberto && (
              <div className="mt-1 rounded-lg border border-border bg-card shadow-md overflow-hidden">
                {minhasListas.map((lista) => (
                  <button
                    key={lista.id}
                    onClick={() => handleAddToList(lista.nome)}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors text-foreground border-b border-border last:border-b-0"
                  >
                    {lista.nome}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info do Filme */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-primary">Informações</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-secondary" />
              Nota do Site
            </span>
            <Badge variant="secondary" className="font-mono text-xs">{notaSite}/10</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Duração
            </span>
            <span className="text-xs font-medium text-foreground">{duracao}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Classificação</span>
            <Badge variant="outline" className="text-xs">{classificacao}</Badge>
          </div>

          {filme.ano && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ano</span>
              <span className="text-xs font-medium text-foreground">{filme.ano}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Elenco */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-primary flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Elenco
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-1.5">
            {elenco.slice(0, 6).map((ator: string, i: number) => (
              <p key={i} className="text-xs text-foreground/80">{ator}</p>
            ))}
            {elenco.length > 6 && (
              <p className="text-xs text-muted-foreground">+{elenco.length - 6} mais</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilmeSidebar;
