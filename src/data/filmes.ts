export interface Filme {
  id: number;
  titulo: string;
  ano: number;
  nota_externa: number; // Substitui 'nota'
  genero?: string | string[]; // Pode vir do backend como string agrupada
  imagens: string; // Substitui 'imagem_capa'
  diretor?: string;
  sinopse?: string;
}

