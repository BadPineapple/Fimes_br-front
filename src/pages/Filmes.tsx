import { useState, useMemo, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import FilmCard from "@/components/FilmCard";
import api from "@/services/api";

const Filmes = () => {
  // 1. Estados dinâmicos vindos do banco de dados
  const [filmes, setFilmes] = useState<any[]>([]);
  const [generos, setGeneros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // 2. Estados de Filtro
  const [busca, setBusca] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState<string | null>(null);

  // 3. Buscar os dados na API ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        // Busca filmes e gêneros simultaneamente para maior rapidez
        const [resFilmes, resGeneros] = await Promise.all([
          api.get("/filmes"),
          api.get("/generos") // Certifique-se de que tem uma rota GET /generos no backend
        ]);

        setFilmes(resFilmes.data);
        setGeneros(resGeneros.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro("Não foi possível carregar o catálogo de filmes.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // 4. Lógica de filtragem com base nos dados do backend
  const filmesFiltrados = useMemo(() => {
    return filmes.filter((f) => {
      const matchBusca = f.titulo?.toLowerCase().includes(busca.toLowerCase());
      
      // Converte os gêneros para array, prevenindo erros caso o backend devolva uma string separada por vírgulas
      const listaGeneros = Array.isArray(f.genero) 
        ? f.genero 
        : (typeof f.genero === 'string' ? f.genero.split(',') : []);

      // Verifica se o filme contém o gênero selecionado
      const matchGenero = !generoFiltro || listaGeneros.some((g: string) => g.trim() === generoFiltro);
      
      return matchBusca && matchGenero;
    });
  }, [busca, generoFiltro, filmes]);

  // Telas de Carregamento e Erro
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-3 text-lg font-medium text-muted-foreground">Carregando catálogo...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-red-500 font-bold mb-4">{erro}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          Filmografia Brasileira
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar filmes..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Filtrar por gênero:
            </label>
            <select
              value={generoFiltro ?? ""}
              onChange={(e) => setGeneroFiltro(e.target.value || null)}
              className="px-3 py-2.5 rounded-lg border border-primary bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todos os gêneros</option>
              {generos.map((g) => (
                <option key={g.id} value={g.genero}>{g.genero}</option>
              ))}
            </select>
          </div>
        </div>

        {generoFiltro && (
          <button
            onClick={() => setGeneroFiltro(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 hover:bg-primary/20 transition-colors"
          >
            Filtrando por: {generoFiltro}
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filmesFiltrados.map((filme, i) => (
            <div key={filme.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <FilmCard filme={filme} />
            </div>
          ))}
        </div>

        {filmesFiltrados.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Nenhum filme encontrado.</p>
            <p className="text-sm mt-1">Tente alterar os filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filmes;