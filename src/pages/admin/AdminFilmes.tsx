import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { filmesData, Filme } from "@/data/filmes";

const AdminFilmes = () => {
  const [filmes, setFilmes] = useState<Filme[]>(filmesData);
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFilme, setEditingFilme] = useState<Filme | null>(null);

  // Form state
  const [form, setForm] = useState({ titulo: "", ano: "", nota_externa: "", genero: "", diretor: "", sinopse: "", imagens: "" });

  const filtrados = filmes.filter(f => f.titulo.toLowerCase().includes(busca.toLowerCase()));

  const openNew = () => {
    setEditingFilme(null);
    setForm({ titulo: "", ano: "", nota_externa: "", genero: "", diretor: "", sinopse: "", imagens: "" });
    setDialogOpen(true);
  };

  const openEdit = (filme: Filme) => {
    setEditingFilme(filme);
    setForm({
      titulo: filme.titulo,
      ano: String(filme.ano),
      nota_externa: String(filme.nota_externa),
      genero: Array.isArray(filme.genero) ? filme.genero.join(", ") : (filme.genero ?? ""),
      diretor: filme.diretor ?? "",
      sinopse: filme.sinopse ?? "",
      imagens: filme.imagens,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.titulo || !form.ano) { toast.error("Preencha título e ano"); return; }
    if (editingFilme) {
      setFilmes(prev => prev.map(f => f.id === editingFilme.id ? { ...f, ...form, ano: Number(form.ano), nota_externa: Number(form.nota_externa) } : f));
      toast.success("Filme atualizado!");
    } else {
      const novo: Filme = { id: Date.now(), titulo: form.titulo, ano: Number(form.ano), nota_externa: Number(form.nota_externa), genero: form.genero, imagens: form.imagens, diretor: form.diretor, sinopse: form.sinopse };
      setFilmes(prev => [novo, ...prev]);
      toast.success("Filme adicionado!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setFilmes(prev => prev.filter(f => f.id !== id));
    toast.success("Filme removido!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Gerenciar Filmes</h1>
          <p className="text-sm text-muted-foreground">{filmes.length} filmes cadastrados</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Adicionar Filme</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFilme ? "Editar Filme" : "Novo Filme"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Título *</Label><Input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Ano *</Label><Input type="number" value={form.ano} onChange={e => setForm({...form, ano: e.target.value})} /></div>
                <div><Label>Nota</Label><Input type="number" step="0.1" value={form.nota_externa} onChange={e => setForm({...form, nota_externa: e.target.value})} /></div>
              </div>
              <div><Label>Gêneros (separados por vírgula)</Label><Input value={form.genero} onChange={e => setForm({...form, genero: e.target.value})} placeholder="Drama, Ação" /></div>
              <div><Label>Diretor</Label><Input value={form.diretor} onChange={e => setForm({...form, diretor: e.target.value})} /></div>
              <div><Label>URL da Imagem</Label><Input value={form.imagens} onChange={e => setForm({...form, imagens: e.target.value})} /></div>
              <div><Label>Sinopse</Label><Textarea value={form.sinopse} onChange={e => setForm({...form, sinopse: e.target.value})} rows={3} /></div>
              <Button className="w-full" onClick={handleSave}>{editingFilme ? "Salvar Alterações" : "Adicionar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar filme..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {/* Table */}
      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Filme</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Ano</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Gênero</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Nota</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(filme => (
                  <tr key={filme.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-11 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Film className="w-3.5 h-3.5 text-primary/40" />
                        </div>
                        <span className="font-medium text-foreground">{filme.titulo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{filme.ano}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {(Array.isArray(filme.genero) ? filme.genero : (filme.genero ?? "").split(",")).filter(Boolean).map(g => (
                          <Badge key={g} variant="secondary" className="text-[10px]">{g.trim()}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{filme.nota_externa}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(filme)}><Edit2 className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(filme.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
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

export default AdminFilmes;
