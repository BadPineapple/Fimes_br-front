import { useState } from "react";
import { Flag, CheckCircle, XCircle, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Denuncia {
  id: number; tipo: string; conteudo: string; autor: string;
  denunciante: string; data: string; status: "pendente" | "resolvida" | "descartada";
}

const mockDenuncias: Denuncia[] = [
  { id: 1, tipo: "Comentário", conteudo: "Conteúdo ofensivo na avaliação de Cidade de Deus", autor: "user123", denunciante: "maria_s", data: "2026-03-06", status: "pendente" },
  { id: 2, tipo: "Perfil", conteudo: "Foto de perfil inapropriada", autor: "carlos_o", denunciante: "ana_santos", data: "2026-03-05", status: "pendente" },
  { id: 3, tipo: "Lista", conteudo: "Lista com título ofensivo", autor: "troll99", denunciante: "joao_p", data: "2026-03-04", status: "pendente" },
  { id: 4, tipo: "Comentário", conteudo: "Spam repetido em várias avaliações", autor: "bot_user", denunciante: "admin", data: "2026-03-03", status: "resolvida" },
];

const AdminDenuncias = () => {
  const [denuncias, setDenuncias] = useState(mockDenuncias);

  const resolver = (id: number) => {
    setDenuncias(prev => prev.map(d => d.id === id ? { ...d, status: "resolvida" as const } : d));
    toast.success("Denúncia resolvida");
  };

  const descartar = (id: number) => {
    setDenuncias(prev => prev.map(d => d.id === id ? { ...d, status: "descartada" as const } : d));
    toast.info("Denúncia descartada");
  };

  const pendentes = denuncias.filter(d => d.status === "pendente");
  const resolvidas = denuncias.filter(d => d.status !== "pendente");

  const statusBadge = (s: string) => {
    if (s === "pendente") return <Badge variant="destructive" className="text-[10px]">Pendente</Badge>;
    if (s === "resolvida") return <Badge className="text-[10px] bg-primary/20 text-primary border-0">Resolvida</Badge>;
    return <Badge variant="outline" className="text-[10px]">Descartada</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Flag className="w-6 h-6 text-destructive" /> Denúncias
        </h1>
        <p className="text-sm text-muted-foreground">{pendentes.length} pendentes</p>
      </div>

      {pendentes.length === 0 && (
        <Card className="shadow-card"><CardContent className="py-12 text-center text-muted-foreground">Nenhuma denúncia pendente 🎉</CardContent></Card>
      )}

      <div className="space-y-3">
        {pendentes.map(d => (
          <Card key={d.id} className="shadow-card border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{d.tipo}</Badge>
                    {statusBadge(d.status)}
                  </div>
                  <p className="text-sm text-foreground">{d.conteudo}</p>
                  <p className="text-xs text-muted-foreground">
                    Por <span className="font-medium">@{d.autor}</span> · Denunciado por <span className="font-medium">@{d.denunciante}</span> · {d.data}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => resolver(d.id)}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolver
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => descartar(d.id)}>
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Descartar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {resolvidas.length > 0 && (
        <>
          <h2 className="text-lg font-display font-semibold text-foreground mt-8">Histórico</h2>
          <div className="space-y-2">
            {resolvidas.map(d => (
              <Card key={d.id} className="shadow-card opacity-60">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">{statusBadge(d.status)}<Badge variant="outline" className="text-[10px]">{d.tipo}</Badge></div>
                    <p className="text-sm text-foreground">{d.conteudo}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{d.data}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDenuncias;
