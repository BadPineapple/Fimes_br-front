import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  User, Shield, Eye, EyeOff, Bell, Moon, Sun, Lock, Globe, Trash2, Download,
  FileText, AlertTriangle, ChevronRight, Save, Mail, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type Section = "perfil" | "privacidade" | "conteudo" | "notificacoes" | "dados" | "termos";

const Configuracoes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState<Section>("perfil");

  // Profile settings
  const [nome, setNome] = useState(user?.nome ?? "Usuário");
  const [email, setEmail] = useState(user?.email ?? "usuario@email.com");
  const [bio, setBio] = useState("Amante do cinema brasileiro 🎬🇧🇷");

  // Privacy
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(true);
  const [mostrarListas, setMostrarListas] = useState(true);
  const [mostrarVotacoes, setMostrarVotacoes] = useState(true);

  // Content
  const [conteudo18, setConteudo18] = useState(false);
  const [spoilers, setSpoilers] = useState(true);

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifSeguidores, setNotifSeguidores] = useState(true);
  const [notifNovosFilmes, setNotifNovosFilmes] = useState(false);

  if (!user) {
    navigate("/entrar");
    return null;
  }

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "perfil", label: "Perfil", icon: <User className="w-4 h-4" /> },
    { id: "privacidade", label: "Privacidade", icon: <Shield className="w-4 h-4" /> },
    { id: "conteudo", label: "Conteúdo", icon: <Eye className="w-4 h-4" /> },
    { id: "notificacoes", label: "Notificações", icon: <Bell className="w-4 h-4" /> },
    { id: "dados", label: "Seus Dados", icon: <Download className="w-4 h-4" /> },
    { id: "termos", label: "Termos e Políticas", icon: <FileText className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="gradient-hero h-28 sm:h-36" />

      <div className="container mx-auto px-4 -mt-8 pb-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          Configurações
        </h1>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar nav */}
          <Card className="shadow-card h-fit lg:sticky lg:top-20">
            <CardContent className="p-2">
              <nav className="space-y-0.5">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === s.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {s.icon}
                    {s.label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="space-y-6">
            {/* PERFIL */}
            {activeSection === "perfil" && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Dados do Perfil
                  </CardTitle>
                  <CardDescription>Gerencie suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome completo</Label>
                      <Input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Input value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} placeholder="Fale um pouco sobre você..." />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Alterar senha</Label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input type="password" placeholder="Senha atual" />
                      <Input type="password" placeholder="Nova senha" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Tema</p>
                      <p className="text-xs text-muted-foreground">Alternar entre tema claro e escuro</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-1.5">
                      {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      {theme === "light" ? "Escuro" : "Claro"}
                    </Button>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="gap-1.5">
                      <Save className="w-4 h-4" /> Salvar alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PRIVACIDADE */}
            {activeSection === "privacidade" && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Privacidade
                  </CardTitle>
                  <CardDescription>Controle quem pode ver suas informações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <SettingToggle
                    icon={perfilPublico ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    title="Perfil público"
                    description="Quando desativado, apenas você pode ver seu perfil"
                    checked={perfilPublico}
                    onCheckedChange={setPerfilPublico}
                  />
                  <Separator />
                  <SettingToggle
                    icon={<Eye className="w-4 h-4" />}
                    title="Mostrar filmes favoritos"
                    description="Exibir seus filmes favoritos no perfil público"
                    checked={mostrarFavoritos}
                    onCheckedChange={setMostrarFavoritos}
                    disabled={!perfilPublico}
                  />
                  <SettingToggle
                    icon={<Eye className="w-4 h-4" />}
                    title="Mostrar listas"
                    description="Permitir que outros vejam suas listas públicas"
                    checked={mostrarListas}
                    onCheckedChange={setMostrarListas}
                    disabled={!perfilPublico}
                  />
                  <SettingToggle
                    icon={<Eye className="w-4 h-4" />}
                    title="Mostrar votações"
                    description="Exibir seu histórico de votações no perfil"
                    checked={mostrarVotacoes}
                    onCheckedChange={setMostrarVotacoes}
                    disabled={!perfilPublico}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="gap-1.5">
                      <Save className="w-4 h-4" /> Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CONTEÚDO */}
            {activeSection === "conteudo" && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" /> Preferências de Conteúdo
                  </CardTitle>
                  <CardDescription>Configure o tipo de conteúdo que deseja ver</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <SettingToggle
                    icon={<AlertTriangle className="w-4 h-4" />}
                    title="Conteúdo +18"
                    description="Exibir filmes com classificação indicativa para maiores de 18 anos"
                    checked={conteudo18}
                    onCheckedChange={setConteudo18}
                  />
                  {conteudo18 && (
                    <div className="ml-8 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-xs text-destructive flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Ao ativar, você confirma ter 18 anos ou mais
                      </p>
                    </div>
                  )}
                  <Separator />
                  <SettingToggle
                    icon={<EyeOff className="w-4 h-4" />}
                    title="Ocultar spoilers"
                    description="Esconder automaticamente spoilers em reviews e comentários"
                    checked={spoilers}
                    onCheckedChange={setSpoilers}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="gap-1.5">
                      <Save className="w-4 h-4" /> Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* NOTIFICAÇÕES */}
            {activeSection === "notificacoes" && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" /> Notificações
                  </CardTitle>
                  <CardDescription>Escolha como deseja ser notificado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <SettingToggle
                    icon={<Mail className="w-4 h-4" />}
                    title="Notificações por e-mail"
                    description="Receber atualizações importantes por e-mail"
                    checked={notifEmail}
                    onCheckedChange={setNotifEmail}
                  />
                  <Separator />
                  <SettingToggle
                    icon={<Heart className="w-4 h-4" />}
                    title="Curtidas"
                    description="Quando alguém curtir suas listas ou reviews"
                    checked={notifLikes}
                    onCheckedChange={setNotifLikes}
                  />
                  <SettingToggle
                    icon={<User className="w-4 h-4" />}
                    title="Novos seguidores"
                    description="Quando alguém começar a seguir você ou suas listas"
                    checked={notifSeguidores}
                    onCheckedChange={setNotifSeguidores}
                  />
                  <SettingToggle
                    icon={<Calendar className="w-4 h-4" />}
                    title="Novos filmes"
                    description="Quando novos filmes forem adicionados ao catálogo"
                    checked={notifNovosFilmes}
                    onCheckedChange={setNotifNovosFilmes}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="gap-1.5">
                      <Save className="w-4 h-4" /> Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DADOS */}
            {activeSection === "dados" && (
              <div className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-primary" /> Seus Dados
                    </CardTitle>
                    <CardDescription>Exporte ou exclua seus dados pessoais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">Exportar dados</p>
                        <p className="text-xs text-muted-foreground">Baixe uma cópia de todos os seus dados (perfil, listas, votações)</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Preparando exportação... você receberá um e-mail em breve.")}>
                        <Download className="w-4 h-4 mr-1.5" /> Exportar
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                      <div>
                        <p className="text-sm font-medium text-destructive">Excluir conta</p>
                        <p className="text-xs text-muted-foreground">Essa ação é irreversível. Todos os seus dados serão permanentemente apagados.</p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-1.5" /> Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus dados dos nossos servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => toast.error("Conta excluída (mock)")}
                            >
                              Sim, excluir minha conta
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Conta criada em</p>
                        <p className="font-medium text-foreground">15 de janeiro de 2026</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Último login</p>
                        <p className="font-medium text-foreground">8 de março de 2026</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ID do usuário</p>
                        <p className="font-mono text-xs text-foreground">{user.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Plano</p>
                        <Badge variant="secondary">Gratuito</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TERMOS */}
            {activeSection === "termos" && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Termos e Políticas
                  </CardTitle>
                  <CardDescription>Documentos legais e políticas do Filmes.br</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Termos de Uso", desc: "Regras gerais de uso da plataforma Filmes.br", updated: "01/01/2026" },
                    { title: "Política de Privacidade", desc: "Como coletamos, usamos e protegemos seus dados pessoais", updated: "01/01/2026" },
                    { title: "Política de Cookies", desc: "Informações sobre o uso de cookies e tecnologias similares", updated: "01/01/2026" },
                    { title: "Diretrizes da Comunidade", desc: "Regras de conduta e convivência na plataforma", updated: "15/02/2026" },
                    { title: "LGPD - Seus Direitos", desc: "Informações sobre seus direitos conforme a Lei Geral de Proteção de Dados", updated: "01/01/2026" },
                  ].map((doc) => (
                    <div
                      key={doc.title}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => toast.info(`Abrindo ${doc.title}...`)}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{doc.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">Atualizado em {doc.updated}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

// Reusable toggle component
const SettingToggle = ({
  icon, title, description, checked, onCheckedChange, disabled = false,
}: {
  icon: React.ReactNode; title: string; description: string;
  checked: boolean; onCheckedChange: (v: boolean) => void; disabled?: boolean;
}) => (
  <div className={`flex items-center justify-between gap-4 ${disabled ? "opacity-50" : ""}`}>
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
  </div>
);

export default Configuracoes;
