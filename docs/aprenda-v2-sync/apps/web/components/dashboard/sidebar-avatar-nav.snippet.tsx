// Trecho para apps/web/components/dashboard/sidebar.tsx (e o equivalente no mobile-nav).
// Importe UserRound de lucide-react e inclua o item na lista de navegação do aluno.

import { UserRound } from "lucide-react";

const studentNav = [
  // ...itens existentes (Início, Trilhas, Loja, Ranking, etc.)
  { href: "/avatar", label: "Avatar", icon: UserRound },
];
