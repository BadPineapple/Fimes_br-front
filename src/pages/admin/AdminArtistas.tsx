import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, User, Loader2, X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const tipoOptions = [
  { value: "ator", label: "Ator/Atriz" },
  { value: "diretor", label: "Diretor(a)" },
  { value: "roteirista", label: "Roteirista" },
  { value: "ambos", label: "Ator & Diretor" },
];

const cargoOptions = ["Ator", "Atriz", "Diretor", "Diretora", "Roteirista", "Produtor", "Produtora"];

interface FilmItem {
  idfil: string | number; // Obrigatório para ligar no banco de dados!
  titulo?: string; // Apenas para exibição
  ano?: string | number; // Apenas para exibição
  papel: string;
  cargo?: string;
}

interface Artista {
  id: string | number;
  nome: string;
  tipo: string;
  naturalidade: string | null;
  nascimento: string | null;
  falecimento: string | null;
  biografia: string | null;
  filmografia: FilmItem[];
}

const AdminArtistas = () => {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    naturalidade: "",
    nascimento: "",
    falecimento: "",
    biografia: "",
    filmografia: [] as FilmItem[]
  });

  const [novoFilme, setNovoFilme] = useState({ 
    idfil: "", 
    titulo: "", 
    ano: "", 
    papel: "", 
    cargo: "Ator" 
  });

  const fetchArtistas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/artista");
      setArtistas(res.data);
    } catch (error) {
      console.error("Erro ao buscar artistas:", error);
      toast.error("Erro ao carregar os artistas");
    } finally {
      setLoading(false);
    }
  };

  const formatarDataInput = (dataIso: string | null) => {
    if (!dataIso) return "";
    return dataIso.split("T")[0];
  };

  useEffect(() => {
    fetchArtistas();
    return () => {
      if (imagemPreview && imagemPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagemPreview);
      }
    };
  }, [imagemPreview]);

  const openNew = () => {
    setEditingId(null);
    setForm({
      nome: "",
      tipo: "",
      naturalidade: "",
      nascimento: "",
      falecimento: "",
      biografia: "",
      filmografia: [],
    });
    setIsModalOpen(true);
  };

  const openEdit = (artista: Artista) => {
    setEditingId(artista.id);
    setForm({
      nome: artista.nome || "",
      tipo: artista.tipo || "",
      naturalidade: artista.naturalidade || "",
      nascimento: formatarDataInput(artista.nascimento),
      falecimento: formatarDataInput(artista.falecimento),
      biografia: artista.biografia || "",
      filmografia: artista.filmografia || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mapeando os campos do React para os nomes que o controller backend espera
    const payload = {
      nompes: form.nome,
      cargo: form.tipo, 
      nascimento: form.nascimento || null,
      falecimento: form.falecimento || null,
      naturalidade: form.naturalidade || null,
      biografia: form.biografia || null,
      // Garante que o IDFIL seja enviado como número para não dar erro no SQL
      filmografia: form.filmografia.map(f => ({
        idfil: parseInt(f.idfil as string), 
        papel: f.papel
      }))
    };

    try {
      if (editingId) {
        await api.put(`/artista/${editingId}`, payload);
        toast.success("Artista atualizado com sucesso!");
      } else {
        await api.post("/artista", payload);
        toast.success("Artista criado com sucesso!");
      }
      setIsModalOpen(false);
      fetchArtistas();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar o artista. Verifique os dados.");
    }
  };

  const handleDelete = async (artista: Artista) => {
    if (window.confirm(`Tem certeza que deseja excluir ${artista.nome}?`)) {
      try {
        await api.delete(`/artista/${artista.id}`);
        toast.success("Artista excluído com sucesso!");
        fetchArtistas();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        toast.error("Erro ao excluir o artista.");
      }
    }
  };

  const addFilmografia = () => {
    setForm({
      ...form,
      filmografia: [...form.filmografia, { idfil: "", papel: "" }],
    });
  };

  const removeFilmografia = (index: number) => {
    const novaLista = [...form.filmografia];
    novaLista.splice(index, 1);
    setForm({ ...form, filmografia: novaLista });
  };

  const updateFilmografia = (index: number, campo: keyof FilmItem, valor: string) => {
    const novaLista = [...form.filmografia];
    novaLista[index] = { ...novaLista[index], [campo]: valor };
    setForm({ ...form, filmografia: novaLista });
  };

  const getTipoLabel = (tipo: string) => {
    const option = tipoOptions.find(o => o.value === tipo?.toLowerCase());
    return option ? option.label : tipo;
  };

  const filteredArtistas = artistas.filter(a =>
    a.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Gerenciar Artistas</h1>
            <p className="text-muted-foreground mt-1">Adicione, edite ou remova atores, diretores e roteiristas.</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="gap-2">
                <Plus className="w-4 h-4" /> Novo Artista
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingId ? "Editar Artista" : "Adicionar Novo Artista"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                {/* Foto */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Foto</Label>
                  <div className="col-span-3 flex items-end gap-4">
                    {imagemPreview ? (
                      <img
                        src={imagemPreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-full border border-border shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted flex items-center justify-center rounded-full border border-border">
                        <User className="w-8 h-8 text-muted-foreground" />
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
                            setImagemPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP. Máx: 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Nome */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right font-semibold">Nome</Label>
                  <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="col-span-3" />
                </div>

                {/* Tipo */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipo" className="text-right font-semibold">Tipo</Label>
                  <select
                    id="tipo"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {tipoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Nascimento */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nascimento" className="text-right font-semibold">Nascimento</Label>
                  <Input id="nascimento" type="date" value={form.nascimento} onChange={(e) => setForm({ ...form, nascimento: e.target.value })} className="col-span-3" />
                </div>

                {/* Falecimento */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="falecimento" className="text-right font-semibold">Falecimento</Label>
                  <Input id="falecimento" type="date" value={form.falecimento} onChange={(e) => setForm({ ...form, falecimento: e.target.value })} className="col-span-3" placeholder="Deixe vazio se vivo" />
                </div>

                {/* Naturalidade */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="naturalidade" className="text-right font-semibold">Naturalidade</Label>
                  <Input id="naturalidade" value={form.naturalidade} onChange={(e) => setForm({ ...form, naturalidade: e.target.value })} className="col-span-3" placeholder="Ex: São Paulo, SP" />
                </div>

                {/* Biografia */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="biografia" className="text-right pt-2 font-semibold">Biografia</Label>
                  <Textarea id="biografia" value={form.biografia} onChange={(e) => setForm({ ...form, biografia: e.target.value })} className="col-span-3 min-h-[120px]" />
                </div>

                {/* Filmografia */}
                <div className="border-t pt-5 mt-2">
                  <Label className="text-sm font-semibold text-primary flex items-center gap-2 mb-3">
                    <Film className="w-4 h-4" /> Filmografia
                  </Label>

                  {/* Lista de filmes adicionados */}
                  {form.filmografia.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {form.filmografia.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 border border-border/50">
                          <div className="flex-1 min-w-0">
                            {/* Mostra o Título se tiver, senão mostra o ID */}
                            <span className="text-sm font-medium text-foreground">
                              {item.titulo ? item.titulo : `Filme ID: ${item.idfil}`}
                            </span>
                            {item.ano && <span className="text-xs text-muted-foreground ml-2">({item.ano})</span>}
                            <div className="flex gap-2 mt-0.5">
                              {/* Cargo: como Adicionamos no formulário visual, ele é exibido aqui */}
                              {item.cargo && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.cargo}</Badge>}
                              
                              {/* Papel do artista no filme */}
                              {item.papel && <span className="text-xs text-muted-foreground">como {item.papel}</span>}
                            </div>
                          </div>
                          <button
                            type="button" 
                            onClick={() => removeFilmografia(idx)}
                            className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
                            title="Remover filme"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulário para adicionar novo filme */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* CAMPO NOVO E OBRIGATÓRIO: ID do Filme */}
                    <Input
                      placeholder="ID do filme no banco (IDFIL) *"
                      type="number"
                      value={novoFilme.idfil || ""}
                      onChange={(e) => setNovoFilme({ ...novoFilme, idfil: e.target.value })}
                      className="col-span-2 border-primary/50" // Destacado para lembrar que é obrigatório
                    />
                    
                    <Input
                      placeholder="Título (apenas para visualização)"
                      value={novoFilme.titulo || ""}
                      onChange={(e) => setNovoFilme({ ...novoFilme, titulo: e.target.value })}
                      className="col-span-1"
                    />
                    <Input
                      placeholder="Ano"
                      type="number"
                      value={novoFilme.ano || ""}
                      onChange={(e) => setNovoFilme({ ...novoFilme, ano: e.target.value })}
                      className="col-span-1"
                    />
                    
                    <select
                      value={novoFilme.cargo || "Ator"}
                      onChange={(e) => setNovoFilme({ ...novoFilme, cargo: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {cargoOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    
                    <Input
                      placeholder="Papel / Personagem"
                      value={novoFilme.papel || ""}
                      onChange={(e) => setNovoFilme({ ...novoFilme, papel: e.target.value })}
                    />
                    
                    <Button
                      type="button"
                      variant="secondary"
                      className="col-span-2 gap-2 mt-1"
                      onClick={() => {
                        // A validação agora exige o ID do filme em vez do título
                        if (!novoFilme.idfil) return toast.error("O ID do filme (IDFIL) é obrigatório para salvar no banco.");
                        
                        addFilmografia();
                        
                        // Reseta o estado incluindo o idfil
                        setNovoFilme({ idfil: "", titulo: "", ano: "", papel: "", cargo: "Ator" });
                      }}
                    >
                      <Plus className="w-4 h-4" /> Adicionar à Filmografia
                    </Button>
                  </div>
                  </div>
                </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={loading} className="px-8">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="py-4 border-b border-border/50 bg-muted/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-background" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">Tipo</th>
                    <th className="px-4 py-3 font-semibold hidden md:table-cell">Naturalidade</th>
                    <th className="px-4 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
                  ) : filteredArtistas.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-10 text-muted-foreground">Nenhum artista encontrado.</td></tr>
                  ) : (
                    filteredArtistas.map((artista, idx) => (
                      <tr key={artista.id || idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{artista.nome}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {getTipoLabel(artista.tipo || "")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{artista.naturalidade || "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(artista)}><Edit2 className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(artista)}><Trash2 className="w-3.5 h-3.5" /></Button>
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

export default AdminArtistas;
