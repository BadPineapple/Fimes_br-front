import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Film, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/services/api";

const AdminFilmes = () => {
  const [filmes, setFilmes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFilme, setEditingFilme] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para as listas do Banco de Dados (para preencher os selects)
  const [dbGeneros, setDbGeneros] = useState<any[]>([]);
  const [dbPessoas, setDbPessoas] = useState<any[]>([]);
  const [dbPlataformas, setDbPlataformas] = useState<any[]>([]);

  // Form state atualizado para usar Arrays nas relações
  const [form, setForm] = useState({ 
    titulo: "", 
    ano: "", 
    nota_externa: "", 
    sinopse: "", 
    imagens: "",
    generos: [] as string[],
    diretores: [] as string[],
    elenco: [] as string[],
    plataformas: [] as string[]
  });

  useEffect(() => {
    fetchFilmes();
    fetchListasSecundarias();
  }, []);

  const fetchFilmes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/filmes');
      setFilmes(response.data);
    } catch (error) {
      toast.error("Erro ao carregar os filmes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchListasSecundarias = async () => {
    try {
      const [resGen, resPes, resPla] = await Promise.all([
        api.get('/opcoes/generos'),
        api.get('/opcoes/pessoas'),
        api.get('/opcoes/plataformas')
      ]);
      setDbGeneros(resGen.data);
      setDbPessoas(resPes.data);
      setDbPlataformas(resPla.data);
    } catch (error) {
      console.error("Erro ao carregar listas de apoio", error);
    }
  };

  const filtrados = filmes.filter(f => 
    (f.NOMFIL || "").toLowerCase().includes(busca.toLowerCase())
  );

  const openNew = () => {
    setEditingFilme(null);
    setForm({ 
      titulo: "", ano: "", nota_externa: "", sinopse: "", imagens: "", 
      generos: [], diretores: [], elenco: [], plataformas: [] 
    });
    setDialogOpen(true);
  };

  const openEdit = (filme: any) => {
    setEditingFilme(filme);
    
    // Filtra pessoas por cargo caso o seu backend retorne todos juntos
    const diretores = filme.DIRETORES?.filter((p:any) => p.CARGO === 'Diretor').map((d: any) => d.NOMPES) || [];
    const atores = filme.DIRETORES?.filter((p:any) => p.CARGO === 'Ator').map((d: any) => d.NOMPES) || [];

    setForm({
      titulo: filme.NOMFIL || "",
      ano: filme.ANO ? String(filme.ANO) : "",
      nota_externa: filme.NOTEXT ? String(filme.NOTEXT) : "",
      sinopse: filme.SINOPSE || "",
      imagens: filme.IMAGEM || "",
      generos: filme.GENEROS?.map((g: any) => g.NOMGEN) || [],
      diretores: diretores.length > 0 ? diretores : (filme.DIRETORES?.map((d: any) => d.NOMPES) || []), // Fallback
      elenco: atores,
      plataformas: filme.PLATAFORMAS?.map((p: any) => p.NOMPLA) || [],
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.ano) {
      toast.error("Título e Ano são obrigatórios!");
      return;
    }

    try {
      const payload = {
        titulo: form.titulo,
        ano: Number(form.ano),
        nota_externa: form.nota_externa ? parseFloat(form.nota_externa) : null,
        sinopse: form.sinopse,
        imagens: form.imagens,
        generos: form.generos,
        diretor: form.diretores,
        elenco: form.elenco,
        plataformas: form.plataformas
      };

      if (editingFilme) {
        await api.put(`/filmes/${editingFilme.IDFIL}`, payload);
        toast.success("Filme atualizado com sucesso!");
      } else {
        await api.post('/filmes', payload);
        toast.success("Filme adicionado ao catálogo!");
      }

      setDialogOpen(false);
      fetchFilmes();
      fetchListasSecundarias(); // Recarrega listas caso algo novo tenha sido criado
    } catch (error) {
      // 1. Imprime o erro completo no Console (F12)
      console.error("Erro detalhado do backend:", error.response?.data || error);
      
      // 2. Tenta pegar a mensagem de 'detalhe' que configuramos no Node.js
      const mensagemErro = error.response?.data?.detalhe 
                        || error.response?.data?.erro 
                        || "Erro desconhecido ao salvar o filme.";
                        
      // 3. Mostra o erro real na tela
      toast.error(`Falha: ${mensagemErro}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir permanentemente este filme?")) return;
    try {
      await api.delete(`/filmes/${id}`);
      toast.success("Filme removido com sucesso!");
      fetchFilmes();
    } catch (error) {
      toast.error("Erro ao excluir o filme.");
    }
  };

  // --- SUB-COMPONENTE: Gerenciador de Relações ---
  const SeletorRelacional = ({ titulo, itens, opcoesDb, campoNome, campoState }: any) => {
    const [novoValor, setNovoValor] = useState("");

    const adicionar = (valor: string) => {
      if (!valor.trim() || itens.includes(valor.trim())) return;
      setForm(prev => ({ ...prev, [campoState]: [...prev[campoState as keyof typeof prev], valor.trim()] }));
      setNovoValor("");
    };

    const remover = (valor: string) => {
      setForm(prev => ({ 
        ...prev, 
        [campoState]: (prev[campoState as keyof typeof prev] as string[]).filter(i => i !== valor) 
      }));
    };

    return (
      <div className="col-span-4 border border-border/50 rounded-lg p-4 bg-muted/10 space-y-3">
        <Label className="text-sm font-semibold text-primary">{titulo}</Label>
        
        {/* Badges dos itens selecionados */}
        <div className="flex flex-wrap gap-2">
          {itens.length === 0 && <span className="text-xs text-muted-foreground">Nenhum adicionado</span>}
          {itens.map((item: string) => (
            <Badge key={item} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
              {item}
              <button onClick={() => remover(item)} className="hover:bg-foreground/10 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        {/* Controles para adicionar */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onChange={(e) => {
              if (e.target.value) adicionar(e.target.value);
              e.target.value = ""; // Reseta o select após escolher
            }}
            defaultValue=""
          >
            <option value="" disabled>Escolha um existente...</option>
            {opcoesDb.map((op: any, i: number) => (
              <option key={i} value={op[campoNome]}>{op[campoNome]}</option>
            ))}
          </select>
          
          <div className="flex gap-2 w-full">
            <Input 
              placeholder="Ou crie um novo..." 
              value={novoValor} 
              onChange={e => setNovoValor(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionar(novoValor))}
              className="h-9"
            />
            <Button type="button" size="sm" onClick={() => adicionar(novoValor)}>Add</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-10 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Gerenciar Filmes</h1>
            <p className="text-muted-foreground mt-1">Adicione, edite ou remova filmes do catálogo.</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="gap-2">
                <Plus className="w-4 h-4" /> Novo Filme
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">{editingFilme ? "Editar Filme" : "Adicionar Novo Filme"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                
                {/* Campos Básicos */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titulo" className="text-right font-semibold">Título</Label>
                  <Input id="titulo" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="col-span-3" />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ano" className="text-right font-semibold">Ano</Label>
                  <Input id="ano" type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nota_externa" className="text-right font-semibold">Nota IMDb</Label>
                  <Input id="nota_externa" type="number" step="0.1" value={form.nota_externa} onChange={(e) => setForm({ ...form, nota_externa: e.target.value })} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imagens" className="text-right font-semibold">Capa (URL)</Label>
                  <Input id="imagens" placeholder="https://..." value={form.imagens} onChange={(e) => setForm({ ...form, imagens: e.target.value })} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="sinopse" className="text-right pt-2 font-semibold">Sinopse</Label>
                  <Textarea id="sinopse" value={form.sinopse} onChange={(e) => setForm({ ...form, sinopse: e.target.value })} className="col-span-3 min-h-[100px]" />
                </div>

                {/* Relacionamentos Avançados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t pt-6">
                  <SeletorRelacional titulo="Gêneros" itens={form.generos} opcoesDb={dbGeneros} campoNome="NOMGEN" campoState="generos" />
                  <SeletorRelacional titulo="Plataformas" itens={form.plataformas} opcoesDb={dbPlataformas} campoNome="NOMPLA" campoState="plataformas" />
                  <SeletorRelacional titulo="Direção" itens={form.diretores} opcoesDb={dbPessoas} campoNome="NOMPES" campoState="diretores" />
                  <SeletorRelacional titulo="Elenco (Atores)" itens={form.elenco} opcoesDb={dbPessoas} campoNome="NOMPES" campoState="elenco" />
                </div>

              </div>
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSave} className="px-8">Salvar Dados</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela de Filmes (Mantida igual a anterior) */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="py-4 border-b border-border/50 bg-muted/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar filmes por título..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9 bg-background" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Filme</th>
                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">Ano</th>
                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">Nota</th>
                    <th className="px-4 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
                  ) : filtrados.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-10 text-muted-foreground">Nenhum filme encontrado.</td></tr>
                  ) : (
                    filtrados.map((filme) => (
                      <tr key={filme.IDFIL} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">
                          <div className="flex items-center gap-3">
                            {filme.IMAGEM ? <img src={filme.IMAGEM} alt={filme.NOMFIL} className="w-8 h-12 rounded object-cover" /> : <div className="w-8 h-12 rounded bg-muted flex items-center justify-center"><Film className="w-4 h-4 text-muted-foreground" /></div>}
                            <span className="line-clamp-2">{filme.NOMFIL}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{filme.ANO}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{filme.NOTEXT}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(filme)}><Edit2 className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(filme.IDFIL)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFilmes;