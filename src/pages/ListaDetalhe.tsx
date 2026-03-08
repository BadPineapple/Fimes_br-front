import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, UserPlus, UserCheck, Plus, Film as FilmIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { filmesData, Filme } from "@/data/filmes";
import { toast } from "sonner";
import GenreBadge from "@/components/GenreBadge";

// Mock data for lists
const mockListas = [
  {
    id: "1",
    nome: "Favoritos de Sempre",
    descricao: "Minha coleção dos melhores filmes brasileiros de todos os tempos. Clássicos imperdíveis!",
    criador: { id: 1, nome: "João Silva" },
    likes: 42,
    seguidores: 18,
    filmes: [1, 2, 3, 5],
  },
  {
    id: "2",
    nome: "Para Assistir",
    descricao: "Filmes que ainda quero ver. Recomendações de amigos e críticos.",
    criador: { id: 1, nome: "João Silva" },
    likes: 15,
    seguidores: 7,
    filmes: [4, 6],
  },
  {
    id: "3",
    nome: "Melhores Dramas",
    descricao: "Seleção curada dos dramas mais impactantes do cinema nacional.",
    criador: { id: 2, nome: "Maria Santos" },
    likes: 89,
    seguidores: 34,
    filmes: [1, 2, 6],
  },
];

const ListaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const lista = mockListas.find((l) => l.id === id);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(lista?.likes ?? 0);
  const [seguindo, setSeguindo] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [busca, setBusca] = useState("");

  if (!lista) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive font-medium">Lista não encontrada</p>
          <Link to="/perfil" className="text-primary hover:underline font-semibold">Voltar ao perfil</Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === lista.criador.id;
  const filmesNaLista = filmesData.filter((f) => lista.filmes.includes(f.id));
  const filmesDisponiveis = filmesData.filter(
    (f) => !lista.filmes.includes(f.id) && f.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleFollow = () => {
    setSeguindo(!seguindo);
    toast.success(seguindo ? "Você deixou de seguir esta lista" : "Você está seguindo esta lista!");
  };

  const handleAddFilme = (filme: Filme) => {
    toast.success(`"${filme.titulo}" adicionado à lista!`);
    setBuscaAberta(false);
    setBusca("");
  };

  const handleRemoveFilme = (filme: Filme) => {
    toast.success(`"${filme.titulo}" removido da lista`);
  };

  const initials = lista.criador.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/perfil"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        {/* Header da Lista */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {lista.nome}
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {lista.descricao}
              </p>
            </div>
          </div>

          {/* Criador + Ações */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                por <span className="font-medium text-foreground">{lista.criador.nome}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="gap-1.5"
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                {likesCount}
              </Button>

              {!isOwner && (
                <Button
                  variant={seguindo ? "secondary" : "outline"}
                  size="sm"
                  onClick={handleFollow}
                  className="gap-1.5"
                >
                  {seguindo ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {seguindo ? "Seguindo" : "Seguir"}
                </Button>
              )}

              <Badge variant="secondary" className="text-xs">
                {lista.seguidores} seguidores
              </Badge>
              <Badge variant="outline" className="text-xs">
                {filmesNaLista.length} filmes
              </Badge>
            </div>
          </div>
        </div>

        {/* Adicionar filme (apenas dono) */}
        {isOwner && (
          <div className="mb-6">
            {!buscaAberta ? (
              <Button variant="outline" size="sm" onClick={() => setBuscaAberta(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Adicionar filme
              </Button>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar filme para adicionar..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button variant="ghost" size="icon" onClick={() => { setBuscaAberta(false); setBusca(""); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {busca && (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {filmesDisponiveis.length > 0 ? (
                        filmesDisponiveis.map((filme) => (
                          <button
                            key={filme.id}
                            onClick={() => handleAddFilme(filme)}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className="w-8 h-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <FilmIcon className="w-3.5 h-3.5 text-primary/40" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{filme.titulo}</p>
                              <p className="text-xs text-muted-foreground">{filme.ano} · {filme.diretor}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground py-2 text-center">Nenhum filme encontrado</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Grid de Filmes */}
        {filmesNaLista.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filmesNaLista.map((filme) => {
              const generos = typeof filme.genero === "string" ? filme.genero.split(",") : (filme.genero ?? []);
              return (
                <div
                  key={filme.id}
                  className="group rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-card transition-all cursor-pointer relative"
                >
                  <div
                    className="aspect-[2/3] bg-muted/30 flex items-center justify-center"
                    onClick={() => navigate(`/filme/${filme.id}`)}
                  >
                    {filme.imagens ? (
                      <img src={filme.imagens} alt={filme.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <FilmIcon className="w-10 h-10 text-primary/20" />
                    )}
                  </div>

                  <div className="p-3" onClick={() => navigate(`/filme/${filme.id}`)}>
                    <p className="text-sm font-semibold text-foreground truncate">{filme.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{filme.ano}</span>
                      <span className="text-xs text-secondary font-medium">★ {filme.nota_externa}</span>
                    </div>
                    {generos.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {generos.slice(0, 2).map((g: string) => (
                          <span key={g.trim()} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {g.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isOwner && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveFilme(filme); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <FilmIcon className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">Esta lista ainda está vazia</p>
            {isOwner && <p className="text-sm mt-1">Adicione filmes usando o botão acima</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaDetalhe;
