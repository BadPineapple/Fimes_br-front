import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Film as FilmIcon } from "lucide-react";
import FilmCard from "@/components/FilmCard";
import api from "@/services/api";

const generosInfo: Record<string, { descricao: string; cor: string }> = {
  "Drama": { descricao: "Histórias profundas que exploram a condição humana, emoções e conflitos pessoais.", cor: "from-primary/80 to-primary/40" },
  "Comédia": { descricao: "Filmes que trazem leveza, humor e diversão ao cinema brasileiro.", cor: "from-secondary/80 to-secondary/40" },
  "Ação": { descricao: "Adrenalina e emoção em produções nacionais cheias de energia.", cor: "from-destructive/60 to-destructive/30" },
  "Crime": { descricao: "Tramas policiais e investigativas que retratam o submundo brasileiro.", cor: "from-primary/70 to-muted/50" },
  "Romance": { descricao: "Histórias de amor que tocam o coração do público brasileiro.", cor: "from-accent/70 to-secondary/40" },
  "Ficção Científica": { descricao: "Visões futuristas e alternativas da realidade no cinema nacional.", cor: "from-ring/60 to-primary/40" },
  "Thriller": { descricao: "Suspense e tensão em narrativas que prendem do início ao fim.", cor: "from-foreground/60 to-muted-foreground/40" },
  "Aventura": { descricao: "Jornadas épicas e descobertas pelo Brasil e além.", cor: "from-secondary/70 to-accent/40" },
  "Documentário": { descricao: "Retratos reais da cultura, sociedade e história brasileira.", cor: "from-primary/60 to-accent/30" },
  "Terror": { descricao: "O lado sombrio do cinema brasileiro com sustos e tensão.", cor: "from-foreground/70 to-destructive/40" },
  "Animação": { descricao: "A arte da animação brasileira em suas diversas formas.", cor: "from-accent/80 to-secondary/50" },
  "Musical": { descricao: "A riqueza musical brasileira traduzida para as telas.", cor: "from-secondary/60 to-primary/30" },
};

const GeneroDetalhe = () => {
  const { nome } = useParams();
  const [filmes, setFilmes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const generoNome = decodeURIComponent(nome || "");
  const info = generosInfo[generoNome] || { descricao: `Explore os melhores filmes de ${generoNome} do cinema brasileiro.`, cor: "from-primary/60 to-muted/40" };

  useEffect(() => {
    const carregar = async () => {
      try {
        const response = await api.get("/filmes");
        const todos = response.data;
        const filtrados = todos.filter((f: any) => {
          const generos = Array.isArray(f.GENEROS)
            ? f.GENEROS.map((g: any) => (typeof g === "string" ? g : g.NOMGEN))
            : typeof f.GENEROS === "string" ? f.GENEROS.split(",").map((g: string) => g.trim()) : [];
          return generos.some((g: string) => g.toLowerCase() === generoNome.toLowerCase());
        });
        setFilmes(filtrados);
      } catch (error) {
        console.error("Erro ao carregar filmes do gênero:", error);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [generoNome]);

  return (
    <div className="min-h-screen">
      {/* Hero do gênero */}
      <section className={`relative h-[280px] flex items-end overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${info.cor}`} />
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="container mx-auto px-4 relative z-10 pb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-primary-foreground">
            {generoNome}
          </h1>
          <p className="text-primary-foreground/80 mt-2 max-w-xl">{info.descricao}</p>
        </div>
      </section>

      {/* Filmes */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filmes.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <FilmIcon className="w-16 h-16 mx-auto text-muted-foreground/40" />
              <h2 className="text-xl font-display font-bold text-foreground">Nenhum filme encontrado</h2>
              <p className="text-muted-foreground">Ainda não temos filmes cadastrados neste gênero.</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8">{filmes.length} filme{filmes.length !== 1 ? "s" : ""} encontrado{filmes.length !== 1 ? "s" : ""}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {filmes.map((filme, i) => (
                  <div key={filme.IDFIL} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    <FilmCard filme={filme} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default GeneroDetalhe;
