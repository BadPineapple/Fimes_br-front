import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Film as FilmIcon, MessageSquare, ExternalLink, Loader2 } from "lucide-react";
import GenreBadge from "@/components/GenreBadge";
import StarRating from "@/components/StarRating";
import { useState, useEffect } from "react";
import api from "@/services/api";

const FilmeDetalhe = () => {
  const { id } = useParams();
  
  // Estados vindos do Banco de Dados
  const [filme, setFilme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Estados do Formulário de Avaliação
  const [userRating, setUserRating] = useState(0);
  const [comentario, setComentario] = useState("");

  // Busca os dados do filme na API assim que a página carrega
  useEffect(() => {
    const carregarFilme = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/filmes/${id}`);
        setFilme(response.data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do filme:", err);
        setErro("Não foi possível carregar as informações do filme.");
      } finally {
        setLoading(false);
      }
    };

    carregarFilme();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-3 text-lg font-medium text-muted-foreground">Carregando detalhes...</span>
      </div>
    );
  }

  if (erro || !filme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-500 font-medium">{erro || "Filme não encontrado"}</p>
          <Link to="/filmes" className="text-primary hover:underline font-semibold">Voltar para o catálogo</Link>
        </div>
      </div>
    );
  }

  // Tratamento de dados caso o backend retorne strings separadas por vírgula em vez de arrays
  const listaGeneros = Array.isArray(filme.genero) 
    ? filme.genero 
    : (typeof filme.genero === 'string' ? filme.genero.split(',') : []);
    
  // Como alterámos onde_assistir para as plataformas do banco
  const listaPlataformas = Array.isArray(filme.plataforma)
    ? filme.plataforma
    : (typeof filme.plataforma === 'string' ? filme.plataforma.split(',') : []);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/filmes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para filmes
        </Link>

        {/* Detalhes do Filme */}
        <div className="grid md:grid-cols-[350px_1fr] gap-8 mb-12">
          {/* Poster */}
          <div className="aspect-[2/3] rounded-xl overflow-hidden gradient-card flex items-center justify-center shadow-card">
            {/* Alterado de imagem_capa para imagens */}
            {filme.imagens ? (
              <img src={filme.imagens} alt={filme.titulo} className="w-full h-full object-cover" />
            ) : (
              <FilmIcon className="w-20 h-20 text-primary/25" />
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 text-muted-foreground mb-2">
                <span className="text-lg font-semibold text-foreground">{filme.ano}</span>
                {filme.diretor && (
                  <>
                    <span>·</span>
                    <span>Direção: {filme.diretor}</span>
                  </>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {filme.titulo}
              </h1>
            </div>

            {/* Avaliações */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">Geral:</span>
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                {/* Alterado de nota para nota_externa */}
                <span className="font-medium">{filme.nota_externa || "N/A"}/10</span>
              </div>
            </div>

            {/* Géneros */}
            {listaGeneros.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {listaGeneros.map((g: string) => (
                  <GenreBadge key={g.trim()} genre={g.trim()} />
                ))}
              </div>
            )}

            {/* Sinopse */}
            {filme.sinopse && (
              <div>
                <h2 className="font-display text-xl font-semibold text-primary mb-2">Sinopse</h2>
                <p className="text-foreground/80 leading-relaxed">{filme.sinopse}</p>
              </div>
            )}

            {/* Onde Assistir (Plataformas) */}
            {listaPlataformas.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Onde Assistir</h2>
                <div className="flex flex-wrap gap-2">
                  {listaPlataformas.map((plat: string) => (
                    <span
                      key={plat.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {plat.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Comentários */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Avaliação do Utilizador */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold text-primary mb-4">Sua Avaliação</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nota (1-5 estrelas):
                </label>
                <StarRating rating={userRating} max={5} size="md" interactive onChange={setUserRating} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Comentário (opcional):
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="O que você achou do filme?"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none h-28"
                />
              </div>
              <button 
                onClick={() => alert("Função de salvar comentário a ser integrada com o backend!")}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Salvar Avaliação
              </button>
            </div>
          </div>

          {/* Avaliações da Comunidade (Placeholder) */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold text-primary mb-4">
              Avaliações da Comunidade (0)
            </h3>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
              <p>Ainda não há avaliações para este filme</p>
              <p className="text-sm mt-1">Seja o primeiro a avaliar!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmeDetalhe;