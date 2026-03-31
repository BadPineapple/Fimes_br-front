import { useState } from "react";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contato = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Mensagem enviada!", description: "Responderemos em breve." });
      setForm({ nome: "", email: "", assunto: "", mensagem: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <div className="gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Mail className="w-10 h-10 mx-auto mb-4 text-secondary" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Fale Conosco
          </h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto">
            Dúvidas, sugestões ou parcerias? Entre em contato com a equipe do Filmes.br.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">E-mail</h3>
                  <p className="text-muted-foreground text-sm">contato@filmes.br</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Localização</h3>
                  <p className="text-muted-foreground text-sm">São Paulo, Brasil</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Resposta</h3>
                  <p className="text-muted-foreground text-sm">Até 48 horas úteis</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label>
                  <Input placeholder="Seu nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">E-mail</label>
                  <Input type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Assunto</label>
                <Input placeholder="Sobre o que deseja falar?" value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Mensagem</label>
                <Textarea placeholder="Escreva sua mensagem..." rows={5} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
