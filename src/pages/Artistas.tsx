import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Search, Film, Clapperboard, Loader2, PenTool } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/services/api";

interface Artista {
  nome: string;
  tipo: "ator" | "diretor" | "ambos";
  filmes: number;
  foto?: string;
}

const artistasLocais: Artista[] = [
  { nome: "Fernando Meirelles", tipo: "diretor", filmes: 1 },
  { nome: "Walter Salles", tipo: "diretor", filmes: 1 },
  { nome: "José Padilha", tipo: "diretor", filmes: 1 },
  { nome: "Kleber Mendonça Filho", tipo: "diretor", filmes: 2 },
  { nome: "Guel Arraes", tipo: "diretor", filmes: 1 },
  { nome: "Fernanda Montenegro", tipo: "ator", filmes: 1 },
  { nome: "Wagner Moura", tipo: "ator", filmes: 2 },
  { nome: "Sônia Braga", tipo: "ator", filmes: 1 },
  { nome: "Matheus Nachtergaele", tipo: "ator", filmes: 2 },
  { nome: "Selton Mello", tipo: "ator", filmes: 1 },
  { nome: "Lázaro Ramos", tipo: "ator", filmes: 1 },
  { nome: "Seu Jorge", tipo: "ambos", filmes: 2 },
];

const Artistas = () => {
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "ator" | "diretor">("todos");
  const [artistas, setArtistas] = useState<Artista[]>(artistasLocais);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtistas = async () => {
      try {
        setLoading(true);
        const res = await api.get("/artistas");
        if (res.data?.length) setArtistas(res.data);
      } catch {
        // usa dados locais
      } finally {
        setLoading(false);
      }
    };
    fetchArtistas();
  }, []);

  const filtrados = artistas.filter((a) => {
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === "todos" || a.tipo === filtroTipo || (filtroTipo === "ator" && a.tipo === "ambos") || (filtroTipo === "diretor" && a.tipo === "ambos");
    return matchBusca && matchTipo;
  });

  const tabs = [
    { key: "todos", label: "Todos", icon: <Users className="w-4 h-4" /> },
    { key: "ator", label: "Atores", icon: <Film className="w-4 h-4" /> },
    { key: "diretor", label: "Diretores", icon: <Clapperboard className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen">
      <div className="gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-10 h-10 mx-auto mb-4 text-secondary" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Atores & Diretores
          </h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto">
            Conheça os talentos que fazem o cinema brasileiro brilhar.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar artista..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFiltroTipo(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filtroTipo === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">Nenhum artista encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtrados.map((artista, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border bg-card p-4 text-center hover:shadow-card-hover hover:border-secondary/30 transition-all cursor-pointer"
              >
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground/60 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                  {artista.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
                  {artista.nome}
                </h3>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                  artista.tipo === "diretor"
                    ? "bg-primary/10 text-primary"
                    : artista.tipo === "ambos"
                    ? "bg-secondary/10 text-secondary"
                    : "bg-accent text-accent-foreground"
                }`}>
                  {artista.tipo === "ambos" ? "Ator & Diretor" : artista.tipo === "diretor" ? "Diretor(a)" : "Ator/Atriz"}
                </span>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {artista.filmes} {artista.filmes === 1 ? "filme" : "filmes"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artistas;
