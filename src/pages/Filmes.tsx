import { useState, useEffect } from "react";
import { Search, Loader2, SlidersHorizontal, X } from "lucide-react";
import FilmCard from "@/components/FilmCard";
import { blogApi } from '@/services/api';

const tabs = [
  { key: "todos", label: "Todos" },
  { key: "recentes", label: "Mais Recentes" },
  { key: "populares", label: "Populares" },
  { key: "bem_avaliados", label: "Bem Avaliados" },
  { key: "classicos", label: "Clássicos" },
];

const Filmes = () => {
  const [filmes, setFilmes] = useState<any[]>([]);
  const [generos, setGeneros] = useState<any[]>([]);
  const [plataformas, setPlataformas] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [sugestoesPessoas, setSugestoesPessoas] = useState<any[]>([]);
  const [textoBuscaPessoa, setTextoBuscaPessoa] = useState(""); // Nome digitado
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [busca, setBusca] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [plataformaFiltro, setPlataformaFiltro] = useState(""); 
  const [pessoaFiltro, setPessoaFiltro] = useState(""); 
  const [anoFiltro, setAnoFiltro] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("nome_asc");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (busca) params.append("titulo", busca);
        if (generoFiltro) params.append("genero", generoFiltro);
        if (anoFiltro) params.append("ano", anoFiltro);
        if (plataformaFiltro) params.append("plataforma", plataformaFiltro);
        if (pessoaFiltro) params.append("pessoa", pessoaFiltro);
        
        let sort = ordenarPor;
        if (activeTab === "recentes") sort = "ano_desc";
        else if (activeTab === "populares" || activeTab === "bem_avaliados") sort = "nota_desc";
        else if (activeTab === "classicos") sort = "ano_asc";
        
        params.set("ordenarPor", sort);

        const [resFilmes, resGeneros, resPlataformas, resPessoas] = await Promise.all([
          blogApi.get(`/filmes?${params.toString()}`),
          blogApi.get("/opcoes/generos"),
          blogApi.get("/opcoes/plataformas"),
          blogApi.get("/opcoes/pessoas")
        ]);

        let filmesData = resFilmes.data;

        // Filtro local por tab
        if (activeTab === "classicos") {
          filmesData = filmesData.filter((f: any) => f.ANO <= 2000);
        }
        
        if (activeTab === "bem_avaliados"){
          filmesData = filmesData.filter((f: any) => f.NOTEXT >= 8.0);
        }

        setFilmes(filmesData);
        setGeneros(resGeneros.data);
        setPlataformas(resPlataformas.data); 
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro("Não foi possível carregar o catálogo de filmes.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => carregarDados(), 500);
    return () => clearTimeout(timeoutId);
  }, [busca, generoFiltro, anoFiltro, plataformaFiltro, pessoaFiltro, ordenarPor, activeTab]);

  const activeFilters = [generoFiltro, anoFiltro, busca, plataformaFiltro].filter(Boolean).length;

  const clearFilters = () => {
    setBusca("");
    setGeneroFiltro("");
    setAnoFiltro("");
    setPlataformaFiltro(""); 
    setPessoaFiltro("");     
    setOrdenarPor("nome_asc");
  };

  if (erro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-destructive font-bold mb-4">{erro}</p>
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
    <div className="min-h-screen">
      {/* Header com tabs estilo Steam */}
      <div className="gradient-hero border-b border-border/30">
        <div className="container mx-auto px-4">
          {/* Título + Busca */}
          <div className="pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
              Filmografia Brasileira
            </h1>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-5 py-3 text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "text-secondary"
                    : "text-primary-foreground/60 hover:text-primary-foreground/90"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-secondary rounded-t-full" />
                )}
              </button>
            ))}
            {/* Botão de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters || activeFilters > 0
                  ? "bg-secondary/20 text-secondary"
                  : "text-primary-foreground/60 hover:text-primary-foreground/90"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFilters > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Painel de filtros expansível */}
      {showFilters && (
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Gênero</label>
                <select
                  value={generoFiltro}
                  onChange={(e) => setGeneroFiltro(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todos</option>
                  {generos.map((g: any) => (
                    <option key={g.IDGEN} value={g.IDGEN}>{g.NOMGEN}</option>
                  ))}
                </select>
                {/* Filtro de Plataforma */}
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Plataforma</label>
                <select
                  value={plataformaFiltro}
                  onChange={(e) => setPlataformaFiltro(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todas</option>
                  {plataformas.map((p: any) => (
                    <option key={p.IDPLA} value={p.IDPLA}>{p.NOMPLA}</option>
                  ))}
                </select>
              </div>
              </div>

              <div className="w-[140px]">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Ano</label>
                <input
                  type="number"
                  placeholder="Ex: 2020"
                  value={anoFiltro}
                  onChange={(e) => setAnoFiltro(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="w-[180px]">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Ordenar por</label>
                <select
                  value={ordenarPor}
                  onChange={(e) => {
                    setOrdenarPor(e.target.value);
                    setActiveTab("todos"); // Desativa abas forçadas para a ordenação manual funcionar
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="nome_asc">Nome (A-Z)</option>
                  <option value="nome_desc">Nome (Z-A)</option>
                  <option value="nota_desc">Maior Nota</option>
                  <option value="nota_asc">Menor Nota</option>
                  <option value="ano_desc">Mais Recentes</option>
                  <option value="ano_asc">Mais Antigos</option>
                </select>
              </div>

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Carregando catálogo...</span>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {filmes.length} filme{filmes.length !== 1 ? "s" : ""} encontrado{filmes.length !== 1 ? "s" : ""}
            </p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Filmes;
