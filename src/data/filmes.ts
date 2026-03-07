export interface Filme {
  id: number;
  titulo: string;
  ano: number;
  nota_externa: number;
  genero?: string | string[];
  imagens: string;
  diretor?: string;
  sinopse?: string;
}

export const filmesData: Filme[] = [
  { id: 1, titulo: "Cidade de Deus", ano: 2002, nota_externa: 8.6, genero: "Drama,Crime", imagens: "", diretor: "Fernando Meirelles", sinopse: "A história de dois jovens crescendo no subúrbio violento do Rio de Janeiro." },
  { id: 2, titulo: "Central do Brasil", ano: 1998, nota_externa: 8.0, genero: "Drama", imagens: "", diretor: "Walter Salles", sinopse: "Uma professora aposentada ajuda um garoto a encontrar seu pai." },
  { id: 3, titulo: "Tropa de Elite", ano: 2007, nota_externa: 8.0, genero: "Ação,Drama", imagens: "", diretor: "José Padilha", sinopse: "O capitão Nascimento precisa encontrar um substituto no BOPE." },
  { id: 4, titulo: "Bacurau", ano: 2019, nota_externa: 7.5, genero: "Ficção Científica,Thriller", imagens: "", diretor: "Kleber Mendonça Filho", sinopse: "Uma pequena comunidade no sertão percebe que está desaparecendo dos mapas." },
  { id: 5, titulo: "O Auto da Compadecida", ano: 2000, nota_externa: 8.3, genero: "Comédia,Aventura", imagens: "", diretor: "Guel Arraes", sinopse: "As aventuras de João Grilo e Chicó no sertão nordestino." },
  { id: 6, titulo: "Aquarius", ano: 2016, nota_externa: 7.6, genero: "Drama", imagens: "", diretor: "Kleber Mendonça Filho", sinopse: "Clara, uma crítica musical aposentada, resiste à pressão de uma construtora." },
];
