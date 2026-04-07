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

const AdminArtistas = () => {
  // Estados usando any[] já que removemos as interfaces
  const [artistas, setArtistas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const [filmesDisponiveis, setFilmesDisponiveis] = useState<any[]>([]);

  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    naturalidade: "",
    nascimento: "",
    falecimento: "",
    biografia: "",
    idImagem: null as number | null,
    filmografia: [] as any[] 
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

  // 1. Carrega os dados do banco de dados (Roda apenas UMA vez)
  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const res = await api.get("/filmes"); 
        setFilmesDisponiveis(res.data);
      } catch (error) {
        console.error("Erro ao carregar a lista de filmes", error);
      }
    };

    fetchFilmes();
    fetchArtistas();
  }, []);

  // 2. Limpa o cache da imagem para não causar vazamento de memória
  useEffect(() => {
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
      idImagem: null, 
      filmografia: [],
    });
    setImagemFile(null);
    setImagemPreview(null);
    setIsModalOpen(true);
  };

  // Trocado o parâmetro para "any" para aceitar o retorno direto do banco
  const openEdit = (artista: any) => {
    setEditingId(artista.IDPES || artista.id);
    
    setForm({
      nome: artista.NOMPES || artista.nome || "",
      tipo: artista.CARGO || artista.tipo || "",
      naturalidade: artista.NATU || artista.naturalidade || "",
      nascimento: formatarDataInput(artista.DTANASC || artista.nascimento),
      falecimento: formatarDataInput(artista.DTAFAL || artista.falecimento),
      biografia: artista.BIO || artista.biografia || "",
      idImagem: artista.IMG || artista.idImagem || null, 
      filmografia: [], // Filmografia isolada por enquanto
    });
    
    setImagemFile(null);
    
    // Mesma lógica de preview do AdminFilmes adaptada
    const localImg = artista.IMAGEM?.[0]?.LOCAL || artista.CAMINHO_IMAGEM || artista.foto;
    setImagemPreview(localImg ? `${API_BASE_URL}${localImg}` : null);
    
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let idImagemFinal = form.idImagem;

      // 1. Upload da Imagem (Exatamente igual ao AdminFilmes)
      if (imagemFile) {
        const formData = new FormData();
        formData.append('imagem', imagemFile);
        formData.append('tipo', 'foto_artista'); 
        formData.append('hint', `Foto do artista ${form.nome}`);
        formData.append('public', '1');

        const uploadResponse = await api.post('/img/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        idImagemFinal = uploadResponse.data.idImagem; 
      }

      // 2. Monta o Payload JSON (Sem a filmografia por enquanto)
      const payload = {
        nompes: form.nome,
        cargo: form.tipo,
        nascimento: form.nascimento || null,
        falecimento: form.falecimento || null,
        naturalidade: form.naturalidade || null,
        biografia: form.biografia || null,
        idImagem: idImagemFinal,
        // filmografia: [] -> Retirado do envio até você querer reativar
      };

      // 3. Salva os dados do artista
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
    } finally {
      setLoading(false);
    }
  };

  // Trocado para any
  const handleDelete = async (artista: any) => {
    const nomeArtista = artista.NOMPES || artista.nome;
    const idArtista = artista.IDPES || artista.id;

    if (window.confirm(`Tem certeza que deseja excluir ${nomeArtista}?`)) {
      try {
        await api.delete(`/artista/${idArtista}`);
        toast.success("Artista excluído com sucesso!");
        fetchArtistas();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        toast.error("Erro ao excluir o artista.");
      }
    }
  };

  const getTipoLabel = (tipo: string) => {
    const option = tipoOptions.find(o => o.value === tipo?.toLowerCase());
    return option ? option.label : tipo;
  };

  const filteredArtistas = artistas.filter(a => {
    const nome = a.NOMPES || a.nome || "";
    return nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
                  <Input 
                    id="nome" 
                    value={form.nome} 
                    onChange={(e) => setForm({ ...form, nome: e.target.value })} 
                    className="col-span-3" 
                  />
                </div>

                {/* Tipo / Cargo */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipo" className="text-right font-semibold">Profissão</Label>
                  <select
                    id="tipo"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="" disabled>Selecione a profissão</option>
                    {tipoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Nascimento */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nascimento" className="text-right font-semibold">Nascimento</Label>
                  <Input 
                    id="nascimento" 
                    type="date" 
                    value={form.nascimento} 
                    onChange={(e) => setForm({ ...form, nascimento: e.target.value })} 
                    className="col-span-3" 
                  />
                </div>

                {/* Falecimento */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="falecimento" className="text-right font-semibold">Falecimento</Label>
                  <Input 
                    id="falecimento" 
                    type="date" 
                    value={form.falecimento} 
                    onChange={(e) => setForm({ ...form, falecimento: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Deixe vazio se vivo" 
                  />
                </div>

                {/* Naturalidade */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="naturalidade" className="text-right font-semibold">Naturalidade</Label>
                  <Input 
                    id="naturalidade" 
                    value={form.naturalidade} 
                    onChange={(e) => setForm({ ...form, naturalidade: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Ex: São Paulo, SP" 
                  />
                </div>

                {/* Biografia */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="biografia" className="text-right pt-2 font-semibold">Biografia</Label>
                  <Textarea 
                    id="biografia" 
                    value={form.biografia} 
                    onChange={(e) => setForm({ ...form, biografia: e.target.value })} 
                    className="col-span-3 min-h-[120px]" 
                  />
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
              <Input 
                placeholder="Buscar por nome..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-9 bg-background" 
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">Profissão</th>
                    <th className="px-4 py-3 font-semibold hidden md:table-cell">Naturalidade</th>
                    <th className="px-4 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                      </td>
                    </tr>
                  ) : filteredArtistas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-muted-foreground">
                        Nenhum artista encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredArtistas.map((artista, idx) => (
                      <tr key={artista.IDPES || artista.id || idx} className="hover:bg-muted/30 transition-colors">
                        {/* Adaptado para as colunas do banco (NOMPES, etc) com fallback */}
                        <td className="px-4 py-3 font-medium text-foreground">
                          {artista.NOMPES || artista.nome}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {getTipoLabel(artista.CARGO || artista.tipo || "")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {artista.NATU || artista.naturalidade || "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => openEdit(artista)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                              onClick={() => handleDelete(artista)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
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
