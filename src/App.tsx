import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import Filmes from "./pages/Filmes";
import FilmeDetalhe from "./pages/FilmeDetalhe";
import Indicacao from "./pages/Indicacao";
import Apoio from "./pages/Apoio";
import Entrar from "./pages/Entrar";
import Registrar from "./pages/Registrar";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFilmes from "./pages/admin/AdminFilmes";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminDenuncias from "./pages/admin/AdminDenuncias";
import AdminMetricas from "./pages/admin/AdminMetricas";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filmes" element={<Filmes />} />
            <Route path="/filme/:id" element={<FilmeDetalhe />} />
            <Route path="/indicacao" element={<Indicacao />} />
            <Route path="/apoio" element={<Apoio />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="filmes" element={<AdminFilmes />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="denuncias" element={<AdminDenuncias />} />
              <Route path="metricas" element={<AdminMetricas />} />
              <Route path="configuracoes" element={<AdminConfiguracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
