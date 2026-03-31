import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Film, Edit2, Camera, Star, List, Clock, LogOut, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/services/api";

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados de controlo da página
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados dos Dados do Perfil
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  // Por enquanto, as votações podem ficar como um array vazio até criarmos a tabela de avaliações
  const [votacoesRecentes, setVotacoesRecentes] = useState<any[]>([]);

  // Estados das Listas
  const [listas, setListas] = useState<any[]>([]);
  const [novaListaAberta, setNovaListaAberta] = useState(false);
  const [novaListaNome, setNovaListaNome] = useState("");
  const [novaListaDesc, setNovaListaDesc] = useState("");


  const listaFavoritos = listas.find(l => l.nome === 'Favoritos');
  const favoritos = listaFavoritos?.filmes?.slice(0, 4) || [];

  useEffect(() => {
    const carregarPerfil = async () => {
      if (!user?.id) return;
      
      try {
        const response = await api.get(`/perfil/${user.id}`);
        
        const dados = response.data.perfil;
        const listasDoBanco = response.data.listas;
        
        setNome(dados.nome || "");
        setDescricao(dados.descricao || "");
        setImagemPreview(dados.foto_perfil || null);
        setListas(listasDoBanco || []);
        
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Não foi possível carregar as informações do seu perfil.");
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [user]);

  const handleSalvarPerfil = async () => {
    if (!user?.id) return;
    if (!nome.trim()) {
      toast.error("O nome não pode estar vazio.");
      return;
    }

    setSaving(true);
    try {
      let idImagemFinal = undefined;

      // Se houver uma nova foto selecionada, faz upload primeiro
      if (imagemFile) {
        const formData = new FormData();
        formData.append('imagem', imagemFile);
        formData.append('tipo', 'perfil');
        formData.append('hint', `Foto de perfil de ${nome}`);
        formData.append('public', '1');

        const uploadResponse = await api.post('/imagens/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        idImagemFinal = uploadResponse.data.idImagem; 
      }

      await api.put(`/perfil/${user.id}`, {
        nome: nome,
        descricao: descricao,
        foto_perfil: idImagemFinal 
      });

      toast.success("Perfil atualizado com sucesso!");
      setEditing(false);
      setImagemFile(null);
      
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.response?.data?.erro || "Erro ao salvar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  const handleCriarLista = async () => {
    if (!user?.id) return;
    if (!novaListaNome.trim()) {
      toast.error("Por favor, dê um nome à sua lista.");
      return;
    }

    try {
      // Chama a rota do listController
      const response = await api.post('/listas', {
        nome: novaListaNome,
        descricao: novaListaDesc
      });

      const listaCriada = response.data.novaLista;

      // Atualiza a grelha de listas instantaneamente
      setListas((listasAnteriores) => [...listasAnteriores, listaCriada]);

      toast.success(response.data.mensagem);
      setNovaListaNome("");
      setNovaListaDesc("");
      setNovaListaAberta(false);

    } catch (error: any) {
      console.error("Erro ao criar lista:", error);
      toast.error(error.response?.data?.erro || "Erro ao criar a lista. Tente novamente.");
    }
  };

  // Helper para formar a URL da imagem corretamente
  const getImageUrl = (path: string | null) => {
    if (!path) return undefined;
    if (path.startsWith('blob:') || path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">A carregar o seu perfil...</div>;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Hero banner */}
      <div className="gradient-hero h-40 sm:h-52" />

      <div className="container mx-auto px-4 -mt-16 sm:-mt-20 pb-12">
        {/* Profile header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
              <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                <AvatarImage src={getImageUrl(imagemPreview)} className="object-cover" />
                <AvatarFallback className="text-2xl">{nome?.charAt(0)}</AvatarFallback>
              </Avatar>

              {editing && (
                <>
                  <label htmlFor="foto-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90 shadow-sm transition-transform hover:scale-105">
                    <Camera className="w-4 h-4" />
                  </label>
                  <input 
                    id="foto-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImagemFile(file);
                        setImagemPreview(URL.createObjectURL(file));
                      }
                    }} 
                  />
                </>
              )}
            </div>

            <div className="space-y-1">
              {editing ? (
                <Input 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  className="font-bold text-xl h-8 w-full max-w-[300px]"
                />
              ) : (
                <h1 className="text-3xl font-bold tracking-tight">{nome}</h1>
              )}
              
              {editing ? (
                <Input 
                  value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)} 
                  className="h-8 w-full max-w-[400px]"
                  placeholder="Escreva uma breve descrição..."
                />
              ) : (
                <p className="text-muted-foreground">{descricao || "Sem descrição."}</p>
              )}
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {editing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => {
                  setEditing(false);
                  setImagemPreview(null); // Volta a carregar a imagem original no próximo reload ou criamos uma cópia de segurança
                  window.location.reload(); // Recarrega rápido para cancelar tudo
                }} disabled={saving}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSalvarPerfil} disabled={saving}>
                  <Check className="w-4 h-4 mr-2" />
                  {saving ? "A salvar..." : "Salvar"}
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
            
            <Button variant="destructive" size="sm" onClick={logout} className="ml-auto md:ml-0">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Filmes Avaliados", value: "27", icon: <Star className="w-5 h-5 text-secondary" /> },
            { label: "Listas Criadas", value: listas.length.toString(), icon: <List className="w-5 h-5 text-primary" /> },
            { label: "Horas Assistidas", value: "54h", icon: <Clock className="w-5 h-5 text-accent" /> },
          ].map((stat) => (
            <Card key={stat.label} className="text-center shadow-card">
              <CardContent className="pt-6 pb-4">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Filmes Preferidos (Dinâmico da lista Favoritos) */}
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Film className="w-5 h-5 text-primary" />
                Filmes Preferidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {favoritos.length > 0 ? (
                  favoritos.map((filme) => (
                    <div
                      key={filme.id}
                      className="group rounded-lg overflow-hidden bg-muted/50 cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-primary/20"
                      onClick={() => navigate(`/filme/${filme.id}`)}
                    >
                      <div className="aspect-[2/3] bg-muted flex items-center justify-center overflow-hidden">
                        {filme.imagem ? (
                          <img 
                            src={getImageUrl(filme.imagem)} 
                            alt={filme.titulo} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <Film className="w-5 h-5 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="p-1.5">
                        <p className="text-[10px] font-medium text-foreground truncate">{filme.titulo}</p>
                        <p className="text-[9px] text-muted-foreground">{filme.ano}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 h-32 flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/20">
                    <p className="text-xs text-muted-foreground">Nenhum favorito ainda.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Votações Recentes (Preparado para dados reais) */}
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-primary" />
                Votações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {votacoesRecentes.length > 0 ? (
                votacoesRecentes.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border"
                    onClick={() => navigate(`/filme/${v.id_filme}`)}
                  >
                    <div className="w-10 h-14 rounded bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {v.imagem ? (
                        <img src={getImageUrl(v.imagem)} className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-4 h-4 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{v.titulo}</p>
                      <p className="text-[10px] text-muted-foreground">{v.data_voto}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs bg-primary/10 text-primary border-none">
                      {v.nota}/10
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="h-32 flex items-center justify-center border border-dashed rounded-lg bg-muted/20">
                  <p className="text-xs text-muted-foreground">Você ainda não avaliou filmes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Film className="w-5 h-5" />
              As Minhas Listas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {listas.length > 0 ? (
              listas.map((lista) => (
                
                <Card key={lista.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <List className="w-5 h-5 text-primary" />
                        {lista.nome}
                        {lista.padrao === 1 && (
                          <Badge variant="secondary" className="text-[10px]">Padrão</Badge>
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground font-normal">
                        {lista.total_filmes} filmes
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                      {lista.descricao || "Sem descrição."}
                    </p>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {lista.filmes && lista.filmes.length > 0 ? (
                        lista.filmes.map((filme: any) => (
                          <img
                            key={filme.id}
                            src={getImageUrl(filme.imagem) || "/placeholder-poster.png"}
                            alt={filme.titulo}
                            className="w-16 h-24 object-cover rounded border border-border flex-shrink-0 shadow-sm"
                            title={filme.titulo}
                          />
                        ))
                      ) : (
                        <div className="w-full h-24 flex items-center justify-center border border-dashed rounded bg-muted/30">
                          <p className="text-xs text-muted-foreground">Nenhum filme adicionado</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Ainda não tem listas disponíveis.
              </div>
            )}

            {/* CARD PARA CRIAR NOVA LISTA */}
            <Card className="border-dashed bg-transparent hover:bg-accent/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4">
                {!novaListaAberta ? (
                  <Button variant="ghost" onClick={() => setNovaListaAberta(true)} className="w-full h-full flex flex-col gap-2 rounded-none">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                    <span className="text-muted-foreground">Criar Nova Lista</span>
                  </Button>
                ) : (
                  <div className="w-full space-y-3 p-4">
                    <div>
                      <Label className="text-xs">Nome da lista</Label>
                      <Input
                        placeholder="Ex: Melhores Dramas"
                        value={novaListaNome}
                        onChange={(e) => setNovaListaNome(e.target.value)}
                        maxLength={60}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Descrição (opcional)</Label>
                      <Textarea
                        placeholder="Descreva sua lista..."
                        value={novaListaDesc}
                        onChange={(e) => setNovaListaDesc(e.target.value)}
                        maxLength={200}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setNovaListaAberta(false)}>
                        Cancelar
                      </Button>
                      <Button size="sm" className="flex-1" disabled={!novaListaNome.trim()} onClick={handleCriarLista}>
                        Criar Lista
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
};

export default Perfil;
