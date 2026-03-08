import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { List, Plus, Heart, Users, Film, Lock, Globe, X, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { filmesData } from "@/data/filmes";

const mockListas = [
  {
    id: "1",
    nome: "Favoritos de Sempre",
    descricao: "Minha coleção dos melhores filmes brasileiros de todos os tempos.",
    privada: false,
    likes: 42,
    seguidores: 18,
    filmes: [1, 2, 3, 5],
    atualizadaEm: "2026-03-05",
  },
  {
    id: "2",
    nome: "Para Assistir",
    descricao: "Filmes que ainda quero ver. Recomendações de amigos e críticos.",
    privada: false,
    likes: 15,
    seguidores: 7,
    filmes: [4, 6],
    atualizadaEm: "2026-03-01",
  },
  {
    id: "3",
    nome: "Watchlist Secreta",
    descricao: "Minha lista privada de filmes que ninguém precisa saber.",
    privada: true,
    likes: 0,
    seguidores: 0,
    filmes: [1, 4, 6],
    atualizadaEm: "2026-02-20",
  },
  {
    id: "4",
    nome: "Melhores Comédias",
    descricao: "Seleção curada de comédias nacionais imperdíveis.",
    privada: false,
    likes: 31,
    seguidores: 12,
    filmes: [5],
    atualizadaEm: "2026-02-15",
  },
];

const MinhasListas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("recente");
  const [novaListaAberta, setNovaListaAberta] = useState(false);
  const [novaListaNome, setNovaListaNome] = useState("");
  const [novaListaDesc, setNovaListaDesc] = useState("");
  const [novaListaPrivada, setNovaListaPrivada] = useState(false);

  if (!user) {
    navigate("/entrar");
    return null;
  }

  const listasFiltradas = mockListas
    .filter((l) => l.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      if (ordem === "recente") return b.atualizadaEm.localeCompare(a.atualizadaEm);
      if (ordem === "nome") return a.nome.localeCompare(b.nome);
      if (ordem === "filmes") return b.filmes.length - a.filmes.length;
      if (ordem === "likes") return b.likes - a.likes;
      return 0;
    });

  const handleCriar = () => {
    if (!novaListaNome.trim()) return;
    toast.success(`Lista "${novaListaNome}" criada!`);
    setNovaListaNome("");
    setNovaListaDesc("");
    setNovaListaPrivada(false);
    setNovaListaAberta(false);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="gradient-hero h-32 sm:h-40" />

      <div className="container mx-auto px-4 -mt-10 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Minhas Listas
            </h1>
            <p className="text-muted-foreground mt-1">
              {mockListas.length} listas · {mockListas.reduce((acc, l) => acc + l.filmes.length, 0)} filmes no total
            </p>
          </div>
          <Button onClick={() => setNovaListaAberta(true)} className="gap-1.5">
            <Plus className="w-4 h-4" />
            Nova Lista
          </Button>
        </div>

        {/* Create form */}
        {novaListaAberta && (
          <Card className="mb-6 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-foreground">Criar nova lista</h3>
                <button onClick={() => setNovaListaAberta(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Nome da lista</Label>
                    <Input
                      placeholder="Ex: Melhores Dramas"
                      value={novaListaNome}
                      onChange={(e) => setNovaListaNome(e.target.value)}
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Descrição (opcional)</Label>
                    <Textarea
                      placeholder="Descreva sua lista..."
                      value={novaListaDesc}
                      onChange={(e) => setNovaListaDesc(e.target.value)}
                      maxLength={200}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Visibilidade</Label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant={!novaListaPrivada ? "default" : "outline"}
                        onClick={() => setNovaListaPrivada(false)}
                        className="gap-1.5 flex-1"
                      >
                        <Globe className="w-3.5 h-3.5" /> Pública
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={novaListaPrivada ? "default" : "outline"}
                        onClick={() => setNovaListaPrivada(true)}
                        className="gap-1.5 flex-1"
                      >
                        <Lock className="w-3.5 h-3.5" /> Privada
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleCriar}
                    disabled={!novaListaNome.trim()}
                    className="w-full mt-4"
                  >
                    Criar Lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nas suas listas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={ordem} onValueChange={setOrdem}>
            <SelectTrigger className="w-full sm:w-48">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recente">Mais recentes</SelectItem>
              <SelectItem value="nome">Nome (A-Z)</SelectItem>
              <SelectItem value="filmes">Mais filmes</SelectItem>
              <SelectItem value="likes">Mais curtidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lists grid */}
        {listasFiltradas.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listasFiltradas.map((lista) => {
              const filmesPreview = filmesData.filter((f) => lista.filmes.includes(f.id)).slice(0, 4);
              return (
                <Card
                  key={lista.id}
                  className="shadow-card hover:shadow-lg cursor-pointer transition-all group overflow-hidden"
                  onClick={() => navigate(`/lista/${lista.id}`)}
                >
                  {/* Poster grid preview */}
                  <div className="grid grid-cols-4 h-28 bg-muted/30">
                    {filmesPreview.map((filme) => (
                      <div key={filme.id} className="bg-primary/5 flex items-center justify-center border-r border-border last:border-r-0">
                        {filme.imagens ? (
                          <img src={filme.imagens} alt={filme.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <Film className="w-5 h-5 text-primary/20" />
                        )}
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - filmesPreview.length) }).map((_, i) => (
                      <div key={`empty-${i}`} className="bg-muted/20 flex items-center justify-center border-r border-border last:border-r-0">
                        <Film className="w-4 h-4 text-muted-foreground/20" />
                      </div>
                    ))}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {lista.nome}
                      </h3>
                      {lista.privada && (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {lista.descricao}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Film className="w-3 h-3" /> {lista.filmes.length} filmes
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {lista.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {lista.seguidores}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <List className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">Nenhuma lista encontrada</p>
            <p className="text-sm mt-1">Crie sua primeira lista clicando no botão acima</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MinhasListas;
