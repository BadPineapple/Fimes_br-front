import { useState } from "react";
import { Sparkles, Send, Film as FilmIcon } from "lucide-react";
import FilmCard from "@/components/FilmCard";
import { Filme } from "@/data/filmes";

const Indicacao = () => {
  const [pergunta, setPergunta] = useState("");
  const [resultado, setResultado] = useState<any | null>(null); // Alterado de any[] para aceitar apenas 1 resultado
  const [loading, setLoading] = useState(false);

  const handleIndicar = async () => {
    if (!pergunta.trim()) return;
    setLoading(true);
    setResultado([]); // Limpa resultados anteriores

    try {
      const response = await fetch("http://localhost:3000/rag/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: pergunta }),
      });

      if (!response.ok) throw new Error("Erro na busca");

      const dados = await response.json();
        
      // Pegamos apenas o primeiro (melhor) resultado do array
      if (dados && dados.length > 0) {
        setResultado(dados[0]);
      } else {
        alert("Não foi possível obter a indicação agora.");
      } 
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-secondary mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Indicação Inteligente</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Qual filme brasileiro você quer assistir?
          </h1>
          <p className="text-muted-foreground">
            Descreva o que você está procurando e nossa IA vai indicar o filme perfeito pra você.
          </p>
        </div>

        {/* Input */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-8">
          <textarea
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Ex: Quero um filme de ação no sertão nordestino..."
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground resize-none h-32 mb-4"
          />
          <button
            onClick={handleIndicar}
            disabled={loading || !pergunta.trim()}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
          >
            {loading ? "Procurando..." : "Pedir Indicação"}
          </button>
        </div>

        {/* Result */}
        {/* Exibição do Resultado vindo da API */}
      {resultado && (
        <div className="animate-fade-in mt-8">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <FilmIcon className="w-5 h-5 text-primary" />
            Nossa indicação pra você:
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 bg-card/30 border border-border p-6 rounded-2xl items-start shadow-sm">
            
            {/* Lado Esquerdo: Card */}
            <div className="w-full md:w-56 shrink-0 mx-auto md:mx-0">
              <FilmCard 
                filme={{
                  // Fazemos um "De -> Para" garantindo que o Card receba as propriedades em maiúsculo
                  IDFIL: resultado.id || resultado.IDFIL,
                  NOMFIL: resultado.titulo || resultado.NOMFIL,
                  // Fallbacks caso a API não tenha retornado esses dados na busca:
                  ANO: resultado.ANO || 0,
                  NOTEXT: resultado.NOTEXT || 0,
                  IMG: resultado.IMG || "",
                  GENEROS: resultado.GENEROS || []
                }} 
              />
            </div>

            {/* Lado Direito: Textos */}
            <div className="flex flex-col flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {resultado.titulo || resultado.NOMFIL}
              </h3>
              
              {resultado.score && (
                <span className="inline-block w-fit px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-xs font-bold mx-auto md:mx-0">
                  {Math.round(resultado.score * 100)}% de Relevância
                </span>
              )}
              
              <p className="text-muted-foreground leading-relaxed text-lg">
                {resultado.sinopse || resultado.SINOPSE}
              </p>
            </div>
            
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Indicacao;
