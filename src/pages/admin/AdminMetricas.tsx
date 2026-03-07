import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Film, Eye } from "lucide-react";

const metricas = {
  visitas: [
    { mes: "Jan", valor: 4200 }, { mes: "Fev", valor: 5800 },
    { mes: "Mar", valor: 7100 },
  ],
  topFilmes: [
    { titulo: "Cidade de Deus", views: 12450 },
    { titulo: "Tropa de Elite", views: 9830 },
    { titulo: "O Auto da Compadecida", views: 8720 },
    { titulo: "Bacurau", views: 7100 },
    { titulo: "Central do Brasil", views: 6540 },
  ],
  demografia: [
    { faixa: "18-24", pct: 28 }, { faixa: "25-34", pct: 35 },
    { faixa: "35-44", pct: 20 }, { faixa: "45+", pct: 17 },
  ],
};

const AdminMetricas = () => {
  const maxViews = Math.max(...metricas.topFilmes.map(f => f.views));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Métricas
        </h1>
        <p className="text-sm text-muted-foreground">Dados de desempenho do site</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Visitas (mês)", value: "7.100", icon: Eye, trend: "+22%" },
          { label: "Novos Usuários", value: "342", icon: Users, trend: "+15%" },
          { label: "Filmes Visitados", value: "892", icon: Film, trend: "+8%" },
          { label: "Tempo Médio", value: "4m 32s", icon: TrendingUp, trend: "+12%" },
        ].map(s => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-primary font-medium">{s.trend}</span>
              </div>
              <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Visitas por mês - bar chart simples */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg">Visitas por Mês</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-40">
              {metricas.visitas.map(v => (
                <div key={v.mes} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{(v.valor / 1000).toFixed(1)}k</span>
                  <div
                    className="w-full rounded-t-md bg-primary/80"
                    style={{ height: `${(v.valor / 8000) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{v.mes}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Filmes */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg">Filmes Mais Visitados</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {metricas.topFilmes.map((f, i) => (
              <div key={f.titulo} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{i + 1}. {f.titulo}</span>
                  <span className="text-muted-foreground">{f.views.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-secondary" style={{ width: `${(f.views / maxViews) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Demografia */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Demografia dos Usuários</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {metricas.demografia.map(d => (
                <div key={d.faixa} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-muted" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-primary" strokeWidth="3"
                        strokeDasharray={`${d.pct} ${100 - d.pct}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">{d.pct}%</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{d.faixa}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMetricas;
