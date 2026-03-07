import { useState } from "react";
import { Settings, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminConfiguracoes = () => {
  const [config, setConfig] = useState({
    nomeSite: "Filmes.br",
    descricao: "A maior plataforma de cinema brasileiro",
    emailContato: "contato@filmes.br",
    manutencao: false,
    cadastroAberto: true,
    moderacaoComentarios: true,
    maxFilmesPorPagina: "24",
  });

  const handleSave = () => {
    toast.success("Configurações salvas!");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Configurações
        </h1>
        <p className="text-sm text-muted-foreground">Configurações gerais do site</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg">Informações do Site</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Nome do Site</Label><Input value={config.nomeSite} onChange={e => setConfig({...config, nomeSite: e.target.value})} /></div>
            <div><Label>Descrição</Label><Textarea value={config.descricao} onChange={e => setConfig({...config, descricao: e.target.value})} rows={2} /></div>
            <div><Label>Email de Contato</Label><Input value={config.emailContato} onChange={e => setConfig({...config, emailContato: e.target.value})} /></div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg">Funcionalidades</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {[
              { key: "manutencao", label: "Modo Manutenção", desc: "Exibe uma página de manutenção para visitantes" },
              { key: "cadastroAberto", label: "Cadastro Aberto", desc: "Permite que novos usuários se cadastrem" },
              { key: "moderacaoComentarios", label: "Moderação de Comentários", desc: "Comentários precisam de aprovação antes de serem publicados" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={config[item.key as keyof typeof config] as boolean}
                  onCheckedChange={v => setConfig({...config, [item.key]: v})}
                />
              </div>
            ))}
            <div>
              <Label>Filmes por Página</Label>
              <Input type="number" value={config.maxFilmesPorPagina} onChange={e => setConfig({...config, maxFilmesPorPagina: e.target.value})} className="max-w-[120px]" />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-fit">
          <Save className="w-4 h-4 mr-1" /> Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
