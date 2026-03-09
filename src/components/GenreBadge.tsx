interface GenreBadgeProps {
  // Ajustado para aceitar o objeto vindo da tblgen ou uma string (fallback)
  genre: {
    IDGEN?: number;
    NOMGEN: string;
  } | string;
}

const GenreBadge = ({ genre }: GenreBadgeProps) => {
  // Lógica para extrair o nome independentemente do formato
  const nomeGenero = typeof genre === 'string' ? genre : genre.NOMGEN;

  return (
    <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border border-primary/20 bg-primary/5 text-primary">
      {nomeGenero}
    </span>
  );
};

export default GenreBadge;