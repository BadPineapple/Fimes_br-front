import { useState } from "react";
import { Search, Shield, ShieldCheck, UserX, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Usuario {
  id: number; nome: string; email: string; roles: string[];
  cadastro: string; status: "ativo" | "banido" | "inativo";
}

const mockUsers: Usuario[] = [
  { id: 1, nome: "Maria Silva", email: "maria@email.com", roles: ["user"], cadastro: "2026-01-15", status: "ativo" },
  { id: 2, nome: "João Pedro", email: "joao@email.com", roles: ["moderator"], cadastro: "2026-01-20", status: "ativo" },
  { id: 3, nome: "Ana Santos", email: "ana@email.com", roles: ["user"], cadastro: "2026-02-01", status: "ativo" },
  { id: 4, nome: "Carlos Oliveira", email: "carlos@email.com", roles: ["user"], cadastro: "2026-02-10", status: "banido" },
  { id: 5, nome: "Admin Master", email: "admin@filmes.br", roles: ["admin"], cadastro: "2025-12-01", status: "ativo" },
];

const AdminUsuarios = () => {
  const [users, setUsers] = useState(mockUsers);
  const [busca, setBusca] = useState("");

  const filtrados = users.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase())
  );

  const toggleBan = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "banido" ? "ativo" : "banido" as const } : u));
    toast.success("Status do usuário atualizado");
  };

  const promoteToMod = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, roles: [...u.roles.filter(r => r !== "user"), "moderator"] } : u));
    toast.success("Usuário promovido a moderador");
  };

  const statusColor = (s: string) => s === "ativo" ? "bg-primary/20 text-primary" : s === "banido" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground";
  const roleIcon = (roles: string[]) => roles.includes("admin") ? <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> : roles.includes("moderator") ? <Shield className="w-3.5 h-3.5 text-primary" /> : null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Usuários</h1>
        <p className="text-sm text-muted-foreground">{users.length} usuários cadastrados</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar por nome ou email..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usuário</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Cadastro</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(user => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                            {user.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-1.5">
                            {user.nome} {roleIcon(user.roles)}
                          </p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="outline" className="text-[10px] capitalize">{user.roles[user.roles.length - 1]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{user.cadastro}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor(user.status)}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => promoteToMod(user.id)}>
                            <Shield className="w-3.5 h-3.5 mr-2" /> Promover a Moderador
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleBan(user.id)} className="text-destructive focus:text-destructive">
                            <UserX className="w-3.5 h-3.5 mr-2" /> {user.status === "banido" ? "Desbanir" : "Banir"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsuarios;
