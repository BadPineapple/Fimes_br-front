import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clapperboard, Film, PenTool, Skull, Loader2 } from "lucide-react";
import { blogApi } from '@/services/api';

// 1. Interfaces espelhando a resposta do backend
interface Filme {
  titulo: string;
  papel: string;
  ano: number;
}

interface Artista {
  id: string | number;
  nome: string;
  tipo: string;
  nascimento: string | null;
  falecimento: string | null;
  naturalidade: string | null;
  biografia: string | null;
  filmografia: Filme[];
}

// 2. Funções auxiliares ajustadas para lidar com nulls
const calcularIdade = (nascimento: string, falecimento?: string | null) => {
  if (!nascimento) return 0;
  const ref = falecimento ? new Date(falecimento) : new Date();
  const nasc = new Date(nascimento);
  let idade = ref.getFullYear() - nasc.getFullYear();
  const m = ref.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < nasc.getDate())) idade--;
  return idade;
};

// Ajuste seguro para lidar com datas no formato YYYY-MM-DDTHH:mm:ss.sssZ do banco
const formatarData = (data: string | null) => {
  if (!data) return "Não informada";
  const apenasData = data.split("T")[0]; // Pega apenas a data "YYYY-MM-DD"
  const [ano, mes, dia] = apenasData.split("-");
  return new Date(Number(ano), Number(mes) - 1, Number(dia)).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

const tipoLabel = (tipo: string | null) => {
  if (!tipo) return "Não informado";
  const map: Record<string, string> = { ator: "Ator/Atriz", diretor: "Diretor(a)", roteirista: "Roteirista", ambos: "Ator & Diretor" };
  return map[tipo.toLowerCase()] ?? tipo;
};

const tipoIcon = (tipo: string | null) => {
  const t = tipo?.toLowerCase() || "";
  if (t === "diretor") return <Clapperboard className="w-4 h-4" />;
  if (t === "roteirista") return <PenTool className="w-4 h-4" />;
  return <Film className="w-4 h-4" />;
};

const ArtistaDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  
  // 3. Gerenciamento de estado
  const [artista, setArtista] = useState<Artista | null>(null);
  const [loading, setLoading] = useState(true);

  // 4. Busca do artista na API
  useEffect(() => {
    const fetchArtista = async () => {
      try {
        setLoading(true);
        // Utiliza a rota buscarPorId que criamos no pessoasController
        const res = await blogApi.get(`/artista/${id}`);
        setArtista(res.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do artista:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArtista();
  }, [id]);

  // Tela de Loading enquanto espera o backend
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  // Se o backend retornar 404
  if (!artista) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Artista não encontrado.</p>
        <Link to="/artistas" className="text-secondary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>
    );
  }

  const idade = artista.nascimento ? calcularIdade(artista.nascimento, artista.falecimento) : "?";
  const filmografia = artista.filmografia || [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link to="/artistas" className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para Artistas
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Foto / Avatar */}
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-card/20 border-4 border-secondary/40 flex items-center justify-center text-4xl font-bold text-secondary shrink-0 uppercase">
              {artista.nome ? artista.nome.split(" ").map((n) => n[0]).join("").slice(0, 2) : "?"}
            </div>

            <div className="text-center md:text-left">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {artista.nome}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-primary-foreground/70 text-sm">
                <span className="inline-flex items-center gap-1 bg-secondary/20 text-secondary px-3 py-1 rounded-full font-medium">
                  {tipoIcon(artista.tipo)}
                  {tipoLabel(artista.tipo)}
                </span>
                
                {artista.nascimento && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {idade} anos
                  </span>
                )}
                
                {artista.naturalidade && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {artista.naturalidade}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biografia */}
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">Biografia</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {artista.biografia || "Biografia não informada."}
              </p>
            </section>

            {/* Filmografia */}
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Filmografia ({filmografia.length})
              </h2>
              
              {filmografia.length === 0 ? (
                <p className="text-muted-foreground italic">Nenhum filme cadastrado para este artista.</p>
              ) : (
                <div className="space-y-3">
                  {filmografia
                    .sort((a, b) => b.ano - a.ano)
                    .map((filme, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-secondary/30 hover:shadow-card-hover transition-all"
                      >
                        <div className="w-12 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Film className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm">{filme.titulo}</h3>
                          <p className="text-muted-foreground text-xs mt-0.5">{filme.papel}</p>
                        </div>
                        <span className="text-sm font-mono text-muted-foreground shrink-0">{filme.ano}</span>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar info */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Informações</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome completo</span>
                  <span className="text-foreground font-medium text-right">{artista.nome}</span>
                </div>
                
                <div className="border-t border-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nascimento</span>
                  <span className="text-foreground font-medium">{formatarData(artista.nascimento)}</span>
                </div>
                
                <div className="border-t border-border" />
                {artista.falecimento && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Skull className="w-3.5 h-3.5" /> Falecimento
                      </span>
                      <span className="text-foreground font-medium">{formatarData(artista.falecimento)}</span>
                    </div>
                    <div className="border-t border-border" />
                  </>
                )}
                
                {artista.nascimento && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Idade</span>
                      <span className="text-foreground font-medium">
                        {idade} anos {artista.falecimento ? "(ao falecer)" : ""}
                      </span>
                    </div>
                    <div className="border-t border-border" />
                  </>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Naturalidade</span>
                  <span className="text-foreground font-medium text-right max-w-[150px]">{artista.naturalidade || "—"}</span>
                </div>
                
                <div className="border-t border-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profissão</span>
                  <span className="text-foreground font-medium">{tipoLabel(artista.tipo)}</span>
                </div>
                
                <div className="border-t border-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Filmes</span>
                  <span className="text-foreground font-medium">{filmografia.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistaDetalhe;