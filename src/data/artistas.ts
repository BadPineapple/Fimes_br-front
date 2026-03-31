export interface ArtistaCompleto {
  id: string;
  nome: string;
  tipo: "ator" | "diretor" | "roteirista" | "ambos";
  nascimento: string;
  falecimento?: string;
  naturalidade: string;
  biografia: string;
  foto?: string;
  filmografia: { titulo: string; ano: number; papel: string }[];
}

export const artistasCompletos: ArtistaCompleto[] = [
  {
    id: "fernando-meirelles",
    nome: "Fernando Meirelles",
    tipo: "diretor",
    nascimento: "1955-11-09",
    naturalidade: "São Paulo, SP",
    biografia: "Fernando Meirelles é um dos mais reconhecidos cineastas brasileiros no cenário internacional. Ganhou notoriedade mundial com Cidade de Deus (2002), que lhe rendeu uma indicação ao Oscar de Melhor Diretor. Formado em Arquitetura pela FAU-USP, migrou para o audiovisual nos anos 80. Também dirigiu O Jardineiro Fiel e Ensaio Sobre a Cegueira.",
    filmografia: [
      { titulo: "Cidade de Deus", ano: 2002, papel: "Diretor" },
      { titulo: "O Jardineiro Fiel", ano: 2005, papel: "Diretor" },
      { titulo: "Ensaio Sobre a Cegueira", ano: 2008, papel: "Diretor" },
    ],
  },
  {
    id: "walter-salles",
    nome: "Walter Salles",
    tipo: "diretor",
    nascimento: "1956-04-12",
    naturalidade: "Rio de Janeiro, RJ",
    biografia: "Walter Salles é um diretor e produtor brasileiro premiado internacionalmente. Central do Brasil (1998) venceu o Urso de Ouro em Berlim e foi indicado ao Oscar de Melhor Filme Estrangeiro. É conhecido por seu estilo humanista e por retratar jornadas pessoais profundas.",
    filmografia: [
      { titulo: "Central do Brasil", ano: 1998, papel: "Diretor" },
      { titulo: "Diários de Motocicleta", ano: 2004, papel: "Diretor" },
      { titulo: "Na Estrada", ano: 2012, papel: "Diretor" },
    ],
  },
  {
    id: "jose-padilha",
    nome: "José Padilha",
    tipo: "diretor",
    nascimento: "1967-08-01",
    naturalidade: "Rio de Janeiro, RJ",
    biografia: "José Padilha é diretor e produtor conhecido pelos filmes Tropa de Elite (2007) e sua sequência. O primeiro filme venceu o Urso de Ouro em Berlim. Também dirigiu o remake de RoboCop (2014) em Hollywood e a série Mecanismo na Netflix.",
    filmografia: [
      { titulo: "Tropa de Elite", ano: 2007, papel: "Diretor" },
      { titulo: "Tropa de Elite 2", ano: 2010, papel: "Diretor" },
      { titulo: "RoboCop", ano: 2014, papel: "Diretor" },
    ],
  },
  {
    id: "kleber-mendonca-filho",
    nome: "Kleber Mendonça Filho",
    tipo: "diretor",
    nascimento: "1968-11-19",
    naturalidade: "Recife, PE",
    biografia: "Kleber Mendonça Filho é um cineasta pernambucano aclamado pela crítica internacional. Seus filmes Aquarius e Bacurau foram selecionados para o Festival de Cannes. Começou como crítico de cinema e curta-metragista antes de se consolidar como um dos nomes mais importantes do cinema brasileiro contemporâneo.",
    filmografia: [
      { titulo: "O Som ao Redor", ano: 2012, papel: "Diretor e Roteirista" },
      { titulo: "Aquarius", ano: 2016, papel: "Diretor e Roteirista" },
      { titulo: "Bacurau", ano: 2019, papel: "Diretor e Roteirista" },
    ],
  },
  {
    id: "guel-arraes",
    nome: "Guel Arraes",
    tipo: "diretor",
    nascimento: "1953-09-24",
    naturalidade: "Recife, PE",
    biografia: "Guel Arraes é um dos maiores nomes da televisão e do cinema brasileiro. Diretor de O Auto da Compadecida e Lisbela e o Prisioneiro, é conhecido por adaptar a cultura nordestina com humor afiado. Trabalhou por décadas na TV Globo, onde criou programas icônicos.",
    filmografia: [
      { titulo: "O Auto da Compadecida", ano: 2000, papel: "Diretor" },
      { titulo: "Lisbela e o Prisioneiro", ano: 2003, papel: "Diretor" },
    ],
  },
  {
    id: "fernanda-montenegro",
    nome: "Fernanda Montenegro",
    tipo: "ator",
    nascimento: "1929-10-16",
    naturalidade: "Rio de Janeiro, RJ",
    biografia: "Fernanda Montenegro é considerada a maior atriz brasileira de todos os tempos. Foi indicada ao Oscar de Melhor Atriz por Central do Brasil (1998), a primeira brasileira a receber tal honra. Com mais de 70 anos de carreira, atuou no teatro, cinema e televisão com maestria incomparável.",
    filmografia: [
      { titulo: "Central do Brasil", ano: 1998, papel: "Dora" },
      { titulo: "O Outro Lado da Rua", ano: 2004, papel: "Regina" },
      { titulo: "O Auto da Compadecida", ano: 2000, papel: "Nossa Senhora" },
    ],
  },
  {
    id: "wagner-moura",
    nome: "Wagner Moura",
    tipo: "ator",
    nascimento: "1976-06-27",
    naturalidade: "Salvador, BA",
    biografia: "Wagner Moura é um ator e diretor baiano com carreira internacional. Ficou mundialmente conhecido por interpretar Pablo Escobar na série Narcos da Netflix e o Capitão Nascimento em Tropa de Elite. Formado em Jornalismo pela UFBA, migrou para a atuação e se tornou um dos atores mais respeitados do Brasil.",
    filmografia: [
      { titulo: "Tropa de Elite", ano: 2007, papel: "Capitão Nascimento" },
      { titulo: "Tropa de Elite 2", ano: 2010, papel: "Capitão Nascimento" },
      { titulo: "Elysium", ano: 2013, papel: "Spider" },
    ],
  },
  {
    id: "sonia-braga",
    nome: "Sônia Braga",
    tipo: "ator",
    nascimento: "1950-06-08",
    naturalidade: "Maringá, PR",
    biografia: "Sônia Braga é uma das atrizes brasileiras mais reconhecidas internacionalmente. Estrelou filmes como Dona Flor e Seus Dois Maridos e, mais recentemente, Aquarius de Kleber Mendonça Filho. Com carreira em Hollywood, atuou ao lado de grandes estrelas americanas.",
    filmografia: [
      { titulo: "Dona Flor e Seus Dois Maridos", ano: 1976, papel: "Dona Flor" },
      { titulo: "O Beijo da Mulher Aranha", ano: 1985, papel: "Leni / Marta / Mulher Aranha" },
      { titulo: "Aquarius", ano: 2016, papel: "Clara" },
    ],
  },
  {
    id: "matheus-nachtergaele",
    nome: "Matheus Nachtergaele",
    tipo: "ator",
    nascimento: "1969-01-03",
    naturalidade: "São Paulo, SP",
    biografia: "Matheus Nachtergaele é um dos atores mais versáteis do cinema brasileiro. Ficou eternizado como João Grilo em O Auto da Compadecida. Com formação no teatro, construiu uma carreira sólida transitando entre comédia e drama com naturalidade.",
    filmografia: [
      { titulo: "O Auto da Compadecida", ano: 2000, papel: "João Grilo" },
      { titulo: "Cidade de Deus", ano: 2002, papel: "Cenoura" },
      { titulo: "Amarelo Manga", ano: 2002, papel: "Dunga" },
    ],
  },
  {
    id: "selton-mello",
    nome: "Selton Mello",
    tipo: "ator",
    nascimento: "1972-12-30",
    naturalidade: "Passos, MG",
    biografia: "Selton Mello é ator e diretor mineiro com uma das carreiras mais prolíficas do cinema nacional. Conhecido por papéis em filmes como O Palhaço (que também dirigiu) e Lisbela e o Prisioneiro, é admirado por sua sensibilidade e talento tanto em frente quanto atrás das câmeras.",
    filmografia: [
      { titulo: "Lisbela e o Prisioneiro", ano: 2003, papel: "Leléu" },
      { titulo: "O Palhaço", ano: 2011, papel: "Benjamin" },
      { titulo: "O Filme da Minha Vida", ano: 2017, papel: "Tony" },
    ],
  },
  {
    id: "lazaro-ramos",
    nome: "Lázaro Ramos",
    tipo: "ator",
    nascimento: "1978-11-01",
    naturalidade: "Salvador, BA",
    biografia: "Lázaro Ramos é ator, diretor e escritor baiano. Um dos maiores representantes da diversidade no cinema brasileiro, atuou em filmes como Madame Satã e Ó Paí, Ó. Também é autor de livros e ativista por causas sociais e raciais.",
    filmografia: [
      { titulo: "Madame Satã", ano: 2002, papel: "Madame Satã" },
      { titulo: "Ó Paí, Ó", ano: 2007, papel: "Roque" },
    ],
  },
  {
    id: "seu-jorge",
    nome: "Seu Jorge",
    tipo: "ambos",
    nascimento: "1970-06-08",
    naturalidade: "Rio de Janeiro, RJ",
    biografia: "Seu Jorge é músico, ator e compositor carioca. Mundialmente reconhecido por sua participação em Cidade de Deus e A Vida Marinha com Steve Zissou, onde interpretou canções de David Bowie em português. Sua música e atuação capturam a alma da cultura brasileira.",
    filmografia: [
      { titulo: "Cidade de Deus", ano: 2002, papel: "Mané Galinha" },
      { titulo: "A Vida Marinha com Steve Zissou", ano: 2004, papel: "Pelé dos Santos" },
    ],
  },
  {
    id: "braulio-mantovani",
    nome: "Bráulio Mantovani",
    tipo: "roteirista",
    nascimento: "1966-08-04",
    naturalidade: "São Paulo, SP",
    biografia: "Bráulio Mantovani é roteirista brasileiro indicado ao Oscar de Melhor Roteiro Adaptado por Cidade de Deus. É um dos roteiristas mais respeitados do país, tendo trabalhado também em Tropa de Elite e outras produções de destaque.",
    filmografia: [
      { titulo: "Cidade de Deus", ano: 2002, papel: "Roteirista" },
      { titulo: "Tropa de Elite", ano: 2007, papel: "Roteirista" },
    ],
  },
  {
    id: "jorge-furtado",
    nome: "Jorge Furtado",
    tipo: "roteirista",
    nascimento: "1959-06-09",
    naturalidade: "Porto Alegre, RS",
    biografia: "Jorge Furtado é cineasta e roteirista gaúcho, conhecido pelo premiado curta-metragem Ilha das Flores e por roteiros de séries e filmes da TV Globo. É um dos roteiristas mais importantes e influentes do audiovisual brasileiro.",
    filmografia: [
      { titulo: "Ilha das Flores", ano: 1989, papel: "Diretor e Roteirista" },
      { titulo: "O Homem que Copiava", ano: 2003, papel: "Diretor e Roteirista" },
      { titulo: "Saneamento Básico, o Filme", ano: 2007, papel: "Diretor e Roteirista" },
    ],
  },
  {
    id: "anna-muylaert",
    nome: "Anna Muylaert",
    tipo: "roteirista",
    nascimento: "1964-03-20",
    naturalidade: "São Paulo, SP",
    biografia: "Anna Muylaert é roteirista e diretora paulista. Seu filme Que Horas Ela Volta? (2015) foi aclamado pela crítica e selecionado para representar o Brasil no Oscar. É conhecida por abordar temas sociais com sensibilidade e inteligência em seus roteiros.",
    filmografia: [
      { titulo: "Durval Discos", ano: 2002, papel: "Diretora e Roteirista" },
      { titulo: "Que Horas Ela Volta?", ano: 2015, papel: "Diretora e Roteirista" },
    ],
  },
];
