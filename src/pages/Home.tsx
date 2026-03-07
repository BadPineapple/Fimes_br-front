import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Film, Star, Clapperboard, Loader2 } from "lucide-react";
import FilmCard from "@/components/FilmCard";
import api from "@/services/api";

const banners = [
  {
    titulo: "Descubra o melhor do",
    destaque: "cinema brasileiro",
    descricao: "Explore nossa curadoria especial do cinema nacional. De clássicos atemporais a obras contemporâneas.",
  },
  {
    titulo: "Encontre seu próximo",
    destaque: "filme favorito",
    descricao: "Use nossa indicação inteligente e descubra filmes que combinam com seu gosto pessoal.",
  },
  {
    titulo: "Apoie o",
    destaque: "cinema nacional",
    descricao: "Cada visualização conta. Ajude a fortalecer a indústria cinematográfica brasileira.",
  },
];

const Home = () => {
  const [filmes, setFilmes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const carregarDestaques = async () => {
      try {
        const response = await api.get("/filmes");
        setFilmes(response.data);
      } catch (error) {
        console.error("Erro ao carregar filmes da Home:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDestaques();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const destaques = filmes.slice(0, 6);
  const notaMedia = filmes.length > 0
    ? (filmes.reduce((acc, f) => acc + (Number(f.nota_externa) || 0), 0) / filmes.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const banner = banners[bannerIndex];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-secondary/50 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-5 transition-opacity duration-500" key={bannerIndex}>
            <div className="flex items-center gap-2 text-secondary">
              <Clapperboard className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Cinema Nacional</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight animate-fade-in">
              {banner.titulo} <span className="text-secondary">{banner.destaque}</span>
            </h1>
            <p className="text-base text-primary-foreground/80 leading-relaxed animate-fade-in">
              {banner.descricao}
            </p>
            <Link
              to="/filmes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Explorar Filmes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Dots */}
          <div className="flex gap-2 mt-6">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === bannerIndex ? "bg-secondary w-6" : "bg-primary-foreground/30"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 gradient-warm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
            <div>
              <Film className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-display font-bold text-foreground">{filmes.length}</div>
              <div className="text-sm text-muted-foreground">Filmes</div>
            </div>
            <div>
              <Star className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <div className="text-2xl font-display font-bold text-foreground">{notaMedia}</div>
              <div className="text-sm text-muted-foreground">Nota Média</div>
            </div>
            <div>
              <Clapperboard className="w-6 h-6 mx-auto mb-2 text-primary" />
              {/* O número de diretores foi mantido fixo temporariamente até criarmos uma rota específica de estatísticas no backend */}
              <div className="text-2xl font-display font-bold text-foreground">50+</div>
              <div className="text-sm text-muted-foreground">Diretores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Filmes em Destaque
              </h2>
              <p className="text-muted-foreground mt-2">Os melhores do cinema nacional</p>
            </div>
            <Link
              to="/filmes"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {destaques.map((filme, i) => (
              <div key={filme.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <FilmCard filme={filme} />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/filmes"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Ver todos os filmes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
