// Trecho para apps/web/components/dashboard/sidebar.tsx (e o equivalente no mobile-nav).
// Importe os ícones de lucide-react e inclua os itens na navegação do aluno.

import { Swords, UserRound } from "lucide-react";

const studentNav = [
  // ...itens existentes (Início, Trilhas, Loja, Ranking, etc.)
  { href: "/avatar", label: "Avatar", icon: UserRound },
  { href: "/equipes", label: "Equipes", icon: Swords },
];
