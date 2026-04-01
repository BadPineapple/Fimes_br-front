import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, User, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
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

const AdminArtistas = () => {
  const [artistas, setArtistas] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArtista, setEditingArtista] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: "",
    tipo: "ator",
    nascimento: "",
    falecimento: "",
    naturalidade: "",
    biografia: "",
    idImagem: null as number | null,
  });

  useEffect(() => {
    fetchArtistas();
    return () => {
      if (imagemPreview && imagemPreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagemPreview);
      }
    };
  }, [imagemPreview]);

  const fetchArtistas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/artistas");
      setArtistas(response.data);
    } catch (error) {
      toast.error("Erro ao carregar artistas.");
    } finally {
      setLoading(false);
    }
  };

  const filtrados = artistas.filter((a) =>
    (a.NOMPES || a.nome || "").toLowerCase().includes(busca.toLowerCase())
  );

  const openNew = () => {
    setEditingArtista(null);
    setForm({ nome: "", tipo: "ator", nascimento: "", falecimento: "", naturalidade: "", biografia: "", idImagem: null });
    setImagemFile(null);
    setImagemPreview(null);
    setDialogOpen(true);
  };

  const openEdit = (artista: any) => {
    setEditingArtista(artista);
    setForm({
      nome: artista.NOMPES || artista.nome || "",
      tipo: artista.TIPO || artista.tipo || "ator",
      nascimento: artista.NASCIMENTO || artista.nascimento || "",
      falecimento: artista.FALECIMENTO || artista.falecimento || "",
      naturalidade: artista.NATURALIDADE || artista.naturalidade || "",
      biografia: artista.BIOGRAFIA || artista.biografia || "",
      idImagem: artista.IMAGEM || null,
    });
    setImagemFile(null);
    const localImg = artista.IMAGEM?.[0]?.LOCAL || artista.CAMINHO_IMAGEM || artista.foto;
    setImagemPreview(localImg ? (localImg.startsWith("http") ? localImg : `${API_BASE_URL}${localImg}`) : null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome || !form.tipo) return toast.error("Nome e Tipo são obrigatórios!");

    setLoading(true);
    try {
      let idImagemFinal = form.idImagem;

      if (imagemFile) {
        const formData = new FormData();
        formData.append("imagem", imagemFile);
        formData.append("tipo", "foto");
        formData.append("hint", `Foto de ${form.nome}`);
        formData.append("public", "1");

        const uploadResponse = await api.post("/img/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        idImagemFinal = uploadResponse.data.idImagem;
      }

      const payload = {
        nome: form.nome,
        tipo: form.tipo,
        nascimento: form.nascimento || null,
        falecimento: form.falecimento || null,
        naturalidade: form.naturalidade,
        biografia: form.biografia,
        idImagem: idImagemFinal,
      };

      if (editingArtista) {
        const id = editingArtista.IDPES || editingArtista.id;
        await api.put(`/artistas/${id}`, payload);
        toast.success("Artista atualizado com sucesso!");
      } else {
        await api.post("/artistas", payload);
        toast.success("Artista adicionado ao catálogo!");
      }

      setDialogOpen(false);
      fetchArtistas();
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao salvar artista.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (artista: any) => {
    const id = artista.IDPES || artista.id;
    if (!confirm("Tem certeza que deseja excluir este artista?")) return;
    try {
      await api.delete(`/artistas/${id}`);
      toast.success("Artista removido com sucesso!");
      fetchArtistas();
    } catch (error) {
      toast.error("Erro ao excluir o artista.");
    }
  };

  const getTipoLabel = (tipo: string) => {
    return tipoOptions.find((t) => t.value === tipo)?.label || tipo;
  };

  return (
    <div className="min-h-screen py-10 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Gerenciar Artistas</h1>
            <p className="text-muted-foreground mt-1">Adicione, edite ou remova atores, diretores e roteiristas.</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="gap-2">
                <Plus className="w-4 h-4" /> Novo Artista
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingArtista ? "Editar Artista" : "Adicionar Novo Artista"}
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
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSave} disabled={loading} className="px-8">
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
              <Input placeholder="Buscar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9 bg-background" />
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
                  ) : filtrados.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-10 text-muted-foreground">Nenhum artista encontrado.</td></tr>
                  ) : (
                    filtrados.map((artista, idx) => (
                      <tr key={artista.IDPES || artista.id || idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{artista.NOMPES || artista.nome}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {getTipoLabel(artista.TIPO || artista.tipo || "")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{artista.NATURALIDADE || artista.naturalidade || "—"}</td>
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
