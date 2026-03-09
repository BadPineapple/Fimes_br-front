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
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [tagFiltro, setTagFiltro] = useState(""); 
  const [plataformaFiltro, setPlataformaFiltro] = useState(""); 
  const [pessoaFiltro, setPessoaFiltro] = useState(""); 
  const [anoFiltro, setAnoFiltro] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("nome_asc");

  // 3. Buscar os dados na API ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Constrói os parâmetros dinâmicos para a API
        const params = new URLSearchParams();
        if (busca) params.append("titulo", busca);
        if (generoFiltro) params.append("genero", generoFiltro);
        if (tagFiltro) params.append("tag", tagFiltro);
        if (plataformaFiltro) params.append("plataforma", plataformaFiltro);
        if (pessoaFiltro) params.append("pessoa", pessoaFiltro);
        if (anoFiltro) params.append("ano", anoFiltro);
        if (ordenarPor) params.append("ordenarPor", ordenarPor);

        const [resFilmes, resGeneros, resPlataformas, resPessoas, resTags] = await Promise.all([
          api.get(`/filmes?${params.toString()}`),
          api.get("/opcoes/generos"),
          api.get("/opcoes/plataformas"),
          api.get("/opcoes/pessoas"),
          api.get("/opcoes/tags"),
        ]);

        setFilmes(resFilmes.data);
        setGeneros(resGeneros.data);
        setGeneros(resPlataformas.data);
        setGeneros(resPessoas.data);
        setGeneros(resTags.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro("Não foi possível carregar o catálogo de filmes.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce: Aguarda 500ms após o usuário parar de interagir antes de chamar a API
    const timeoutId = setTimeout(() => {
      carregarDados();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [busca, generoFiltro, tagFiltro, plataformaFiltro, pessoaFiltro, anoFiltro, ordenarPor]);

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

        {/* Filters & Sorting */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Ordenar:
              </label>
              <select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-primary bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="nome_asc">Nome (A-Z)</option>
                <option value="nome_desc">Nome (Z-A)</option>
                <option value="nota_desc">Maior Nota</option>
                <option value="nota_asc">Menor Nota</option>
                <option value="ano_desc">Mais Recentes</option>
                <option value="ano_asc">Mais Antigos</option>
              </select>
            </div>
          </div>

          {/* Grid de Filtros Avançados */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={generoFiltro}
              onChange={(e) => setGeneroFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Gêneros (Todos)</option>
              {generos.map((g) => (
                <option key={g.IDGEN} value={g.IDGEN}>{g.NOMGEN}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Ano de Lançamento"
              value={anoFiltro}
              onChange={(e) => setAnoFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            {/* NOTA: Para Tag, Plataforma e Pessoa, utilizei inputs de texto para receber o ID.
                O ideal seria criar rotas no Backend para buscar essas listas e transformar em <select> iguais ao do Gênero. */}
            <input
              type="text"
              placeholder="ID da Tag..."
              value={tagFiltro}
              onChange={(e) => setTagFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
             <input
              type="text"
              placeholder="ID da Plataforma..."
              value={plataformaFiltro}
              onChange={(e) => setPlataformaFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              placeholder="ID da Pessoa..."
              value={pessoaFiltro}
              onChange={(e) => setPessoaFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filmes.map((filme, i) => (
            <div key={filme.IDFIL} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <FilmCard filme={filme} />
            </div>
          ))}
        </div>

        {filmes.length === 0 && (
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