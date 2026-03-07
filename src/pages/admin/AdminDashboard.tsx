import { Film, Users, Flag, Eye, TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Total de Filmes", value: "1.247", icon: Film, color: "text-primary" },
  { label: "Usuários Ativos", value: "3.892", icon: Users, color: "text-secondary" },
  { label: "Denúncias Pendentes", value: "12", icon: Flag, color: "text-destructive" },
  { label: "Visitas Hoje", value: "8.421", icon: Eye, color: "text-accent-foreground" },
  { label: "Avaliações/Dia", value: "156", icon: Star, color: "text-secondary" },
  { label: "Crescimento Mensal", value: "+18%", icon: TrendingUp, color: "text-primary" },
];

const recentActivity = [
  { type: "filme", text: 'Filme "Ainda Estou Aqui" adicionado', time: "2 min atrás" },
  { type: "user", text: "Novo usuário: maria.silva@email.com", time: "15 min atrás" },
  { type: "denuncia", text: 'Denúncia em "Comentário ofensivo"', time: "1h atrás" },
  { type: "filme", text: 'Filme "O Pagador de Promessas" atualizado', time: "3h atrás" },
  { type: "user", text: "Usuário joão.pedro promovido a moderador", time: "5h atrás" },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === "denuncia" ? "bg-destructive" : activity.type === "user" ? "bg-secondary" : "bg-primary"
                }`} />
                <span className="text-sm text-foreground">{activity.text}</span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{activity.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
