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
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

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

  // No useEffect ou ao fechar o modal
  useEffect(() => {
    fetchFilmes();
    fetchListasSecundarias();
    return () => {
      if (imagemPreview && imagemPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagemPreview);
      }
    };

  }, [imagemPreview]);

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
    setImagemFile(null);
    setImagemPreview(null);
    setDialogOpen(true);
  };

  const openEdit = (filme: any) => {
    setEditingFilme(filme);
    
    // Filtra cargos corretamente baseado no que vem do backend
    const diretores = filme.DIRETORES?.filter((p: any) => p.CARGO === 'Diretor').map((d: any) => d.NOMPES) || [];
    const atores = filme.DIRETORES?.filter((p: any) => p.CARGO === 'Ator').map((d: any) => d.NOMPES) || [];
  
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
    
    setImagemFile(null);
    // O preview usa a URL processada pelo JOIN (URL_IMAGEM)
    setImagemPreview(filme.URL_IMAGEM || null); 
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.ano) {
      toast.error("Título e Ano são obrigatórios!");
      return;
    }

    setLoading(true); // Bloqueia o botão para evitar duplicação

    try {
      let idImagemFinal = form.imagens;

      // 1. FAZ O UPLOAD DA IMAGEM PRIMEIRO (se o utilizador selecionou um ficheiro novo)
      if (imagemFile) {
        const formData = new FormData();
        formData.append('imagem', imagemFile);
        formData.append('tipo', 'poster'); // Parametrizado como pede o seu backend
        formData.append('hint', `Poster do filme ${form.titulo}`);
        formData.append('public', '1');

        // Faz o upload para a sua nova rota
        const uploadResponse = await api.post('/img/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // O backend (imagemController.js) devolve 'idImagem'
        idImagemFinal = uploadResponse.data.idImagem; 
      }

      // 2. MONTA O PAYLOAD DO FILME COM O ID DA IMAGEM ATUALIZADO
      const payload = {
        titulo: form.titulo,
        ano: Number(form.ano),
        nota_externa: form.nota_externa ? parseFloat(form.nota_externa) : null,
        sinopse: form.sinopse,
        idImagem: idImagemFinal, 
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
      fetchListasSecundarias(); 
    } catch (error: any) {
      console.error("Erro detalhado do backend:", error.response?.data || error);
      const mensagemErro = error.response?.data?.detalhe 
                        || error.response?.data?.erro 
                        || "Erro desconhecido ao salvar o filme.";
      toast.error(`Falha: ${mensagemErro}`);
    } finally {
      setLoading(false);
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

               {/* UPLOAD DE CAPA */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Capa (Pôster)</Label>
                <div className="col-span-3 flex items-end gap-4">
                  {/* Pré-visualização da Imagem */}
                  {imagemPreview ? (
                    <img 
                      src={imagemPreview.startsWith('http') || imagemPreview.startsWith('blob') ? imagemPreview : `http://localhost:3000${imagemPreview}`} 
                      alt="Preview" 
                      className="w-24 h-36 object-cover rounded border border-border shadow-sm" 
                    />
                  ) : (
                    <div className="w-24 h-36 bg-muted flex items-center justify-center rounded border border-border">
                      <Film className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImagemFile(file);
                          // Gera um preview local temporário instantâneo (Blob) para o utilizador
                          setImagemPreview(URL.createObjectURL(file)); 
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Formatos aceites: JPG, PNG, WEBP. Tamanho máximo: 5MB.
                    </p>
                  </div>
                </div>
              </div>
                
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