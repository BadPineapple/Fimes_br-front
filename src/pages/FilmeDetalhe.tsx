import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Film as FilmIcon, MessageSquare, ExternalLink, Loader2 } from "lucide-react";
import GenreBadge from "@/components/GenreBadge";
import StarRating from "@/components/StarRating";
import FilmeSidebar from "@/components/FilmeSidebar";
import { useState, useEffect } from "react";
import api from "@/services/api";

const FilmeDetalhe = () => {
  const { id } = useParams();
  
  const [filme, setFilme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const carregarFilme = async () => {
      try {
        setLoading(true);
        // Certifique-se que sua rota GET /filmes/:id faz os JOINs com tblgen e tblpes
        const response = await api.get(`/filmes/${id}`);
        setFilme(response.data);
      } catch (err) {
        setErro("Não foi possível carregar as informações do filme.");
      } finally {
        setLoading(false);
      }
    };
    carregarFilme();
  }, [id]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (erro || !filme) return <div className="text-center p-20 text-red-500">{erro || "Filme não encontrado"}</div>;

  // 1. Corrigido para GENEROS (Maiúsculo)
  const listaGeneros = Array.isArray(filme?.GENEROS) 
    ? filme.GENEROS 
    : (typeof filme?.GENEROS === 'string' ? filme.GENEROS.split(',').map(g => g.trim()) : []);

  // 2. Corrigido para PLATAFORMAS (Maiúsculo e Plural, vindo da tblpla)
  const listaPlataformas = Array.isArray(filme?.PLATAFORMAS)
    ? filme.PLATAFORMAS
    : (typeof filme?.PLATAFORMAS === 'string' ? filme.PLATAFORMAS.split(',').map(p => p.trim()) : []);
  
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

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Conteúdo principal */}
          <div>
            {/* Detalhes do Filme */}
            <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
              {/* Poster */}
              <div className="aspect-[2/3] rounded-xl overflow-hidden bg-card border border-border flex items-center justify-center shadow-card">
                {filme.imagens ? (
                  <img src={filme.IMAGEM} alt={filme.NOMFIL} className="w-full h-full object-cover" />
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
                    {filme.NOMFIL}
                  </h1>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Geral:</span>
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="font-medium">{filme.NOTEXT || "N/A"}/10</span>
                  </div>
                </div>

                {/* Gêneros */}
                <div className="flex gap-2">
                  {listaGeneros.map((g, index) => (
                    <span key={g.IDGEN || index}>{g.NOMGEN || g}</span>
                  ))}
                </div>


                {filme.sinopse && (
                  <div>
                    <h2 className="font-display text-xl font-semibold text-primary mb-2">Sinopse</h2>
                    <p className="text-foreground/80 leading-relaxed">{filme.SINOPSE}</p>
                  </div>
                )}

                {listaPlataformas.length > 0 && (
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-3">Onde Assistir</h2>
                    <div className="flex flex-wrap gap-2">
                      {listaPlataformas.map((p, index) =>(
                        <span
                          key={p.IDPLA || index}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {p.NOMPLA || p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seção de Comentários */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold text-primary mb-4">Sua Avaliação</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Nota (1-5 estrelas):</label>
                    <StarRating rating={userRating} max={5} size="md" interactive onChange={setUserRating} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Comentário (opcional):</label>
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

          {/* Sidebar direita */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilmeSidebar filme={filme} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FilmeDetalhe;
