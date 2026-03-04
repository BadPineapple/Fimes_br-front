import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, KeyRound, Check, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: { label: string; passed: boolean }[];
}

const getPasswordStrength = (password: string): PasswordStrength => {
  const checks = [
    { label: "Mínimo 8 caracteres", passed: password.length >= 8 },
    { label: "Letra maiúscula", passed: /[A-Z]/.test(password) },
    { label: "Letra minúscula", passed: /[a-z]/.test(password) },
    { label: "Número", passed: /[0-9]/.test(password) },
    { label: "Caractere especial", passed: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.passed).length;
  const labels: Record<number, { label: string; color: string }> = {
    0: { label: "", color: "" },
    1: { label: "Muito fraca", color: "bg-destructive" },
    2: { label: "Fraca", color: "bg-destructive/70" },
    3: { label: "Razoável", color: "bg-accent" },
    4: { label: "Boa", color: "bg-primary/70" },
    5: { label: "Forte", color: "bg-primary" },
  };
  return { score, ...labels[score], checks };
};

const Registrar = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [aceitaPropagandas, setAceitaPropagandas] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [isVerifyingRobot, setIsVerifyingRobot] = useState(false);

  const [code, setCode] = useState("");

  const strength = getPasswordStrength(senha);
  const passwordsMatch = senha === confirmarSenha && confirmarSenha.length > 0;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isRobotVerified) {
      toast.error("Por favor, confirme que não é um robô!");
      return;
    }
    
    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }
    if (strength.score < 4) {
      toast.error("A senha não é forte o suficiente!");
      return;
    }

    setLoading(true);
    try {
      // Chamada real ao backend
      await api.post('/auth/registrar', {
        nome,
        email,
        telefone,
        senha,
        propaganda: aceitaTermos
      });

      toast.success("Conta criada! Verifique o seu e-mail.");
      //setStep(2); // Avança para a etapa de verificação
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao registar utilizador.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Código inválido!");
      return;
    }

    setLoading(true);
    try {
      // Envia o código digitado para o backend validar
      await api.post('/auth/verificar-email', {
        email,
        codigo: code
      });

      toast.success("E-mail verificado com sucesso!");
      navigate("/entrar"); // Redireciona para o login
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Código de verificação incorreto.");
    } finally {
      setLoading(false);
    }
  };

  // NOVA FUNÇÃO: Simula a verificação do reCAPTCHA
  const handleRobotCheck = () => {
    if (isRobotVerified) return;
    setIsVerifyingRobot(true);
    // Simula um delay de rede de 1 segundo
    setTimeout(() => {
      setIsVerifyingRobot(false);
      setIsRobotVerified(true);
    }, 1000);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 gradient-warm">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <Film className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">
              Filmes<span className="text-secondary">.</span>br
            </span>
          </Link>
          <p className="text-muted-foreground text-sm">
            {step === "form" ? "Crie sua conta gratuita" : "Verifique seu e-mail"}
          </p>
        </div>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              {step === "form" ? "Criar Conta" : "Verificação"}
            </CardTitle>
            <CardDescription>
              {step === "form"
                ? "Preencha seus dados para começar"
                : `Enviamos um código para ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === "form" ? (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="nome"
                      placeholder="Seu nome"
                      className="pl-10"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="reg-email">E-mail *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="reg-senha">Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {senha && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              i <= strength.score ? strength.color : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Força: <span className="font-medium text-foreground">{strength.label}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        {strength.checks.map((check) => (
                          <span
                            key={check.label}
                            className={`text-xs flex items-center gap-1 ${
                              check.passed ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            {check.passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {check.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Confirmar senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${
                        confirmarSenha && !passwordsMatch ? "border-destructive" : ""
                      } ${passwordsMatch ? "border-primary" : ""}`}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmarSenha && !passwordsMatch && (
                    <p className="text-xs text-destructive">As senhas não coincidem</p>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone">
                    Telefone <span className="text-muted-foreground font-normal">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      value={telefone}
                      onChange={(e) => setTelefone(formatPhone(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex justify-center py-2">
                  <div 
                    onClick={handleRobotCheck}
                    className={`flex items-center justify-between w-[300px] p-3 border rounded-sm cursor-pointer transition-all ${
                    isRobotVerified ? 'border-green-300 bg-green-50/30' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 flex items-center justify-center rounded-sm border-2 transition-colors ${
                        isRobotVerified ? 'border-green-600 bg-green-600' : 'border-gray-400 bg-white'
                      }`}>
                        {isVerifyingRobot ? (
                           <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : isRobotVerified ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : null}
                      </div>
                      <span className="text-sm font-medium text-gray-700">Não sou um robô</span>
                    </div>
                    <div className="flex flex-col items-center">
                      {/* Um ícone genérico de escudo para simular o logo de segurança */}
                      <div className="w-8 h-8 opacity-60 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-blue-600" /> 
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">Privacidade - Termos</span>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="termos"
                      checked={aceitaTermos}
                      onCheckedChange={(v) => setAceitaTermos(v === true)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="termos" className="text-sm font-normal leading-tight cursor-pointer">
                      Li e aceito os{" "}
                      <Link to="/termos" className="text-primary hover:underline font-medium">
                        Termos de Serviço
                      </Link>{" "}
                      e a{" "}
                      <Link to="/privacidade" className="text-primary hover:underline font-medium">
                        Política de Privacidade
                      </Link>{" "}
                      *
                    </Label>
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="propagandas"
                      checked={aceitaPropagandas}
                      onCheckedChange={(v) => setAceitaPropagandas(v === true)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="propagandas" className="text-sm font-normal leading-tight cursor-pointer">
                      Aceito receber novidades e recomendações por e-mail
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar Conta"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            ) : (
              /* ===== VERIFICATION STEP ===== */
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify-code">Código de Verificação</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="verify-code"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      className="pl-10 text-center tracking-[0.5em] font-mono text-lg"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verificando..." : "Verificar E-mail"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setCode("");
                    toast.info("Novo código enviado!");
                  }}
                  className="text-sm text-primary hover:underline w-full text-center"
                >
                  Reenviar código
                </button>
              </form>
            )}

            {/* LOGIN LINK */}
            <div className="pt-4 text-center border-t border-border mt-4">
              <span className="text-sm text-muted-foreground">Já tem conta? </span>
              <Link to="/entrar" className="text-sm font-semibold text-primary hover:underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Registrar;
