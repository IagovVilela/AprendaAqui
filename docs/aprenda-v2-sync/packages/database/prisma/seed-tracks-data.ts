import { LessonType } from "@prisma/client";

export type LessonSeed = {
  title: string;
  type: LessonType;
  order: number;
  xpReward: number;
  content: Record<string, unknown>;
  solution: Record<string, unknown>;
};

export type UnitSeed = {
  title: string;
  order: number;
  pathOffset: number;
  lessons: LessonSeed[];
};

export type TrackSeed = {
  title: string;
  slug: string;
  icon: string;
  description: string;
  order: number;
  colorPrimary: string;
  colorDark: string;
  colorLight: string;
  colorMuted: string;
  colorOnPrimary: string;
  units: UnitSeed[];
};

function quizLesson(
  title: string,
  order: number,
  xpReward: number,
  question: string,
  options: string[],
  correctIndex: number
): LessonSeed {
  return {
    title,
    type: LessonType.QUIZ,
    order,
    xpReward,
    content: { questions: [{ question, options, correctIndex }] },
    solution: { correctIndex },
  };
}

function codeLesson(
  title: string,
  order: number,
  xpReward: number,
  instructions: string,
  starterCode: string,
  solutionContains: string,
  hint?: string
): LessonSeed {
  return {
    title,
    type: LessonType.CODE,
    order,
    xpReward,
    content: {
      instructions,
      starterCode,
      ...(hint ? { hint } : {}),
    },
    solution: { contains: solutionContains },
  };
}

function buildTwoUnitTrack(
  meta: Omit<TrackSeed, "units">,
  unit1: { title: string; pathOffset: number; lessons: LessonSeed[] },
  unit2: { title: string; pathOffset: number; lessons: LessonSeed[] }
): TrackSeed {
  return {
    ...meta,
    units: [
      { title: unit1.title, order: 1, pathOffset: unit1.pathOffset, lessons: unit1.lessons },
      { title: unit2.title, order: 2, pathOffset: unit2.pathOffset, lessons: unit2.lessons },
    ],
  };
}

function buildHtmlTrack(): TrackSeed {
  return {
    title: "HTML",
    slug: "html",
    icon: "code",
    description: "Aprenda a estruturar páginas web com HTML5.",
    order: 1,
    colorPrimary: "#fb923c",
    colorDark: "#c2410c",
    colorLight: "#fdba74",
    colorMuted: "#ea580c",
    colorOnPrimary: "#ffffff",
    units: [
      {
        title: "Fundamentos",
        order: 1,
        pathOffset: 0,
        lessons: [
          {
            title: "O que é HTML?",
            type: LessonType.QUIZ,
            order: 1,
            xpReward: 10,
            content: {
              questions: [
                {
                  question: "O que significa HTML?",
                  options: [
                    "HyperText Markup Language",
                    "High Tech Modern Language",
                    "Home Tool Markup Language",
                  ],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Tags básicas",
            type: LessonType.QUIZ,
            order: 2,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual tag define um parágrafo?",
                  options: ["<p>", "<div>", "<span>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Títulos e hierarquia",
            type: LessonType.QUIZ,
            order: 3,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual tag representa o título principal da página?",
                  options: ["<h1>", "<title>", "<header>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Primeira página",
            type: LessonType.CODE,
            order: 4,
            xpReward: 20,
            content: {
              instructions: "Crie um título h1 com o texto 'Olá, Mundo!'",
              starterCode: "<!DOCTYPE html>\n<html>\n<head></head>\n<body>\n  \n</body>\n</html>",
            },
            solution: { contains: "olá, mundo!" },
          },
          {
            title: "Parágrafos",
            type: LessonType.CODE,
            order: 5,
            xpReward: 20,
            content: {
              instructions: "Adicione um parágrafo com o texto 'Aprenda HTML com diversão!'",
              starterCode: "<h1>Minha página</h1>\n",
            },
            solution: { contains: "aprenda html com diversão" },
          },
        ],
      },
      {
        title: "Estrutura",
        order: 2,
        pathOffset: 16,
        lessons: [
          {
            title: "Head e Body",
            type: LessonType.QUIZ,
            order: 1,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Onde ficam os metadados da página?",
                  options: ["<head>", "<body>", "<footer>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Meta e charset",
            type: LessonType.QUIZ,
            order: 2,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual meta tag define a codificação de caracteres?",
                  options: [
                    '<meta charset="UTF-8">',
                    '<meta name="viewport">',
                    '<meta http-equiv="refresh">',
                  ],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Listas não ordenadas",
            type: LessonType.CODE,
            order: 3,
            xpReward: 20,
            content: {
              instructions: "Crie uma lista não ordenada com 3 itens (use <li>)",
              starterCode: "<ul>\n  \n</ul>",
            },
            solution: { contains: "<li>" },
          },
          {
            title: "Criar um link",
            type: LessonType.CODE,
            order: 4,
            xpReward: 25,
            content: {
              instructions:
                "Crie um link com <a href=\"https://example.com\"> que exiba o texto 'Saiba mais'",
              starterCode: "<p>Conteúdo da página</p>\n",
            },
            solution: { contains: 'href="https://example.com"' },
          },
          {
            title: "Listas ordenadas",
            type: LessonType.QUIZ,
            order: 5,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual tag cria uma lista numerada?",
                  options: ["<ol>", "<ul>", "<dl>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
        ],
      },
      {
        title: "Texto e mídia",
        order: 3,
        pathOffset: -16,
        lessons: [
          {
            title: "Negrito e ênfase",
            type: LessonType.QUIZ,
            order: 1,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual tag semântica indica texto importante?",
                  options: ["<strong>", "<b>", "<big>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Destacar texto",
            type: LessonType.CODE,
            order: 2,
            xpReward: 20,
            content: {
              instructions: "Envolva a palavra 'importante' com a tag <strong>",
              starterCode: "<p>Este conteúdo é importante para o estudo.</p>",
            },
            solution: { contains: "importante" },
          },
          {
            title: "Inserir imagens",
            type: LessonType.QUIZ,
            order: 3,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual tag insere uma imagem em HTML?",
                  options: ["<img>", "<image>", "<picture>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Tag img na prática",
            type: LessonType.CODE,
            order: 4,
            xpReward: 25,
            content: {
              instructions:
                'Adicione uma imagem com <img src="logo.png" alt="Logo do site">',
              starterCode: "<h1>Bem-vindo</h1>\n",
            },
            solution: { contains: 'alt="logo do site"' },
          },
          {
            title: "Acessibilidade com alt",
            type: LessonType.QUIZ,
            order: 5,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Para que serve o atributo alt em imagens?",
                  options: [
                    "Descrever a imagem para leitores de tela",
                    "Definir o tamanho da imagem",
                    "Aplicar um filtro visual",
                  ],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
        ],
      },
      {
        title: "Formulários",
        order: 4,
        pathOffset: 12,
        lessons: [
          {
            title: "Elemento form",
            type: LessonType.QUIZ,
            order: 1,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual elemento agrupa campos de um formulário?",
                  options: ["<form>", "<fieldset>", "<input>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Campo de texto",
            type: LessonType.CODE,
            order: 2,
            xpReward: 25,
            content: {
              instructions:
                'Dentro de um <form>, adicione um input de texto com name="email" e placeholder="Seu email"',
              starterCode: "<form>\n  \n</form>",
            },
            solution: { contains: 'type="text"' },
          },
          {
            title: "Botão de envio",
            type: LessonType.CODE,
            order: 3,
            xpReward: 25,
            content: {
              instructions: 'Adicione um botão de envio com <button type="submit">Enviar</button>',
              starterCode: '<form>\n  <input type="text" name="nome" />\n</form>',
            },
            solution: { contains: 'type="submit"' },
          },
          {
            title: "Área de texto",
            type: LessonType.QUIZ,
            order: 4,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual tag é usada para textos longos em formulários?",
                  options: ["<textarea>", "<input>", "<text>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Formulário completo",
            type: LessonType.CODE,
            order: 5,
            xpReward: 30,
            content: {
              instructions: 'Adicione um <textarea name="mensagem"></textarea> dentro do form',
              starterCode:
                '<form>\n  <input type="text" name="nome" placeholder="Nome" />\n  <button type="submit">Enviar</button>\n</form>',
            },
            solution: { contains: '<textarea name="mensagem">' },
          },
        ],
      },
      {
        title: "Semântica HTML5",
        order: 5,
        pathOffset: 0,
        lessons: [
          {
            title: "Tags semânticas",
            type: LessonType.QUIZ,
            order: 1,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual tag representa o conteúdo principal da página?",
                  options: ["<main>", "<section>", "<div>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Header e footer",
            type: LessonType.CODE,
            order: 2,
            xpReward: 25,
            content: {
              instructions: "Crie uma estrutura com <header> e <main> (main pode estar vazio)",
              starterCode: "<body>\n  \n</body>",
            },
            solution: { contains: "main" },
          },
          {
            title: "Nav e article",
            type: LessonType.QUIZ,
            order: 3,
            xpReward: 15,
            content: {
              questions: [
                {
                  question: "Qual tag agrupa links de navegação?",
                  options: ["<nav>", "<menu>", "<links>"],
                  correctIndex: 0,
                },
              ],
            },
            solution: { correctIndex: 0 },
          },
          {
            title: "Página semântica",
            type: LessonType.CODE,
            order: 4,
            xpReward: 30,
            content: {
              instructions:
                'Adicione um <nav> com um link <a href="/">Início</a> e um <footer> com texto \'2024\'',
              starterCode: "<header><h1>Meu site</h1></header>\n<main></main>\n",
            },
            solution: { contains: 'href="/"' },
          },
          {
            title: "Desafio final HTML",
            type: LessonType.CODE,
            order: 5,
            xpReward: 40,
            content: {
              instructions:
                "Monte uma mini página: h1 com 'Aprenda Aqui', um parágrafo e um link 'Começar' para /trilhas",
              starterCode:
                '<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>Aprenda Aqui</title></head>\n<body>\n  \n</body>\n</html>',
              hint: "Use h1, p e a com href",
            },
            solution: { contains: 'href="/trilhas"' },
          },
        ],
      },
    ],
  };
}

function buildCssTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "CSS",
      slug: "css",
      icon: "palette",
      description: "Estilize suas páginas com CSS moderno.",
      order: 2,
      colorPrimary: "#3b82f6",
      colorDark: "#1d4ed8",
      colorLight: "#93c5fd",
      colorMuted: "#2563eb",
      colorOnPrimary: "#ffffff",
    },
    {
      title: "Fundamentos",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "Introdução ao CSS",
          1,
          10,
          "Como aplicar CSS diretamente em um elemento HTML?",
          ['Atributo style="..."', 'Tag <css>', 'Atributo class="..."'],
          0
        ),
        codeLesson(
          "Cor do texto",
          2,
          20,
          "Defina a cor do texto do parágrafo como #3b82f6",
          "p {\n  \n}",
          "color"
        ),
        quizLesson(
          "Seletor por classe",
          3,
          15,
          "Qual seletor estiliza elementos com class=\"destaque\"?",
          [".destaque", "#destaque", "destaque"],
          0
        ),
        codeLesson(
          "Estilizar uma classe",
          4,
          20,
          "Crie a regra CSS para .botao com background-color: #3b82f6",
          ".botao {\n  \n}",
          "background-color"
        ),
        quizLesson(
          "Box model",
          5,
          15,
          "Qual propriedade controla o espaço interno entre conteúdo e borda?",
          ["padding", "margin", "border"],
          0
        ),
      ],
    },
    {
      title: "Layout",
      pathOffset: -12,
      lessons: [
        codeLesson(
          "Centralizar com Flexbox",
          1,
          25,
          "Centralize horizontalmente os itens com justify-content: center",
          ".container {\n  display: flex;\n  \n}",
          "justify-content"
        ),
        quizLesson(
          "Display flex",
          2,
          15,
          "Qual propriedade ativa o layout flexível?",
          ["display: flex", "position: flex", "layout: flex"],
          0
        ),
        codeLesson(
          "Espaçamento externo",
          3,
          20,
          "Adicione margin: 16px ao seletor .card",
          ".card {\n  padding: 8px;\n  \n}",
          "margin"
        ),
        quizLesson(
          "Media queries",
          4,
          15,
          "Para que servem as media queries em CSS?",
          [
            "Aplicar estilos conforme o tamanho da tela",
            "Importar fontes externas",
            "Validar HTML automaticamente",
          ],
          0
        ),
        codeLesson(
          "Layout responsivo",
          5,
          30,
          "Defina max-width: 600px no seletor .conteudo",
          ".conteudo {\n  width: 100%;\n  \n}",
          "max-width",
          "Use max-width para limitar a largura em telas grandes"
        ),
      ],
    }
  );
}

function buildJavascriptTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "JavaScript",
      slug: "javascript",
      icon: "braces",
      description: "Domine a linguagem da web interativa.",
      order: 3,
      colorPrimary: "#eab308",
      colorDark: "#a16207",
      colorLight: "#fde047",
      colorMuted: "#ca8a04",
      colorOnPrimary: "#422006",
    },
    {
      title: "Variáveis e tipos",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "let, const e var",
          1,
          10,
          "Qual palavra-chave declara uma constante que não pode ser reatribuída?",
          ["const", "let", "var"],
          0
        ),
        codeLesson(
          "Declarar variável",
          2,
          20,
          "Declare uma constante chamada nome com o valor 'Aprenda Aqui'",
          "// Escreva seu código abaixo\n",
          "const nome"
        ),
        quizLesson(
          "Tipos de dados",
          3,
          15,
          "O que typeof 42 retorna em JavaScript?",
          ["number", "integer", "float"],
          0
        ),
        codeLesson(
          "Template strings",
          4,
          25,
          "Crie a variável saudacao usando template string: `Olá, ${nome}!`",
          'const nome = "Maria";\n',
          "`olá"
        ),
        quizLesson(
          "Operadores",
          5,
          15,
          "Qual operador verifica igualdade de valor e tipo?",
          ["===", "==", "="],
          0
        ),
      ],
    },
    {
      title: "Funções e arrays",
      pathOffset: 12,
      lessons: [
        codeLesson(
          "Função soma",
          1,
          25,
          "Complete a função soma(a, b) para retornar a + b",
          "function soma(a, b) {\n  \n}",
          "return a + b"
        ),
        quizLesson(
          "Arrow functions",
          2,
          15,
          "Qual é a sintaxe correta de uma arrow function?",
          ["() => {}", "function => {}", "=> function {}"],
          0
        ),
        codeLesson(
          "Dobrar números",
          3,
          30,
          "Use .map() para dobrar cada número do array nums",
          "const nums = [1, 2, 3];\nconst doubled = nums.map(/* ... */);",
          "* 2",
          "Use n => n * 2 dentro do map"
        ),
        quizLesson(
          "Método filter",
          4,
          15,
          "Qual método retorna apenas os elementos que passam em um teste?",
          [".filter()", ".map()", ".forEach()"],
          0
        ),
        codeLesson(
          "Filtrar pares",
          5,
          30,
          "Filtre apenas números pares do array numeros",
          "const numeros = [1, 2, 3, 4, 5, 6];\nconst pares = numeros.filter(/* ... */);",
          "% 2"
        ),
      ],
    }
  );
}

function buildPythonTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "Python",
      slug: "python",
      icon: "terminal",
      description: "Aprenda programação com Python de forma prática.",
      order: 4,
      colorPrimary: "#14b8a6",
      colorDark: "#0f766e",
      colorLight: "#5eead4",
      colorMuted: "#0d9488",
      colorOnPrimary: "#ffffff",
    },
    {
      title: "Primeiros passos",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "O que é Python?",
          1,
          10,
          "Python é principalmente uma linguagem de programação...",
          ["de alto nível e interpretada", "compilada apenas para web", "usada só para hardware"],
          0
        ),
        codeLesson(
          "Primeiro print",
          2,
          20,
          "Use print() para exibir 'Olá, Python!'",
          "# Seu código aqui\n",
          "print"
        ),
        quizLesson(
          "Indentação",
          3,
          15,
          "Em Python, o que define blocos de código?",
          ["Indentação (espaços)", "Chaves {}", "Ponto e vírgula ;"],
          0
        ),
        codeLesson(
          "Variáveis",
          4,
          20,
          "Crie a variável idade com valor 25",
          "# Defina idade abaixo\n",
          "idade = 25"
        ),
        quizLesson(
          "Tipos básicos",
          5,
          15,
          "Qual função retorna o tipo de uma variável em Python?",
          ["type()", "typeof()", "class()"],
          0
        ),
      ],
    },
    {
      title: "Estruturas de controle",
      pathOffset: -12,
      lessons: [
        codeLesson(
          "Condicional if",
          1,
          25,
          "Complete o if para imprimir 'Maior' quando idade >= 18",
          "idade = 20\nif idade >= 18:\n    ",
          "print"
        ),
        quizLesson(
          "Laço for",
          2,
          15,
          "Qual estrutura percorre uma sequência em Python?",
          ["for", "foreach", "loop"],
          0
        ),
        codeLesson(
          "Loop com range",
          3,
          25,
          "Use for i in range(3): para imprimir i",
          "# Imprima 0, 1 e 2\n",
          "for"
        ),
        quizLesson(
          "Listas",
          4,
          15,
          "Como criar uma lista com os números 1, 2 e 3?",
          ["[1, 2, 3]", "(1, 2, 3)", "{1, 2, 3}"],
          0
        ),
        codeLesson(
          "Soma de lista",
          5,
          30,
          "Use sum() para somar os valores da lista numeros = [10, 20, 30]",
          "numeros = [10, 20, 30]\n# Calcule a soma\n",
          "sum("
        ),
      ],
    }
  );
}

function buildLogicaTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "Lógica de Programação",
      slug: "logica",
      icon: "puzzle",
      description: "Desenvolva o raciocínio lógico essencial para programar.",
      order: 5,
      colorPrimary: "#a855f7",
      colorDark: "#7e22ce",
      colorLight: "#d8b4fe",
      colorMuted: "#9333ea",
      colorOnPrimary: "#ffffff",
    },
    {
      title: "Pensamento lógico",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "Algoritmo",
          1,
          10,
          "O que é um algoritmo?",
          [
            "Sequência finita de passos para resolver um problema",
            "Um tipo de linguagem de programação",
            "Um erro de compilação",
          ],
          0
        ),
        codeLesson(
          "Sequência de passos",
          2,
          20,
          "Escreva os passos (como comentários) para fazer um café: 1) Ferver água 2) Colocar pó 3) Servir",
          "// Passo 1:\n// Passo 2:\n// Passo 3:\n",
          "ferver"
        ),
        quizLesson(
          "Entrada e saída",
          3,
          15,
          "Em um programa, a 'entrada' geralmente representa...",
          ["Dados recebidos para processar", "O resultado final", "Um erro de sintaxe"],
          0
        ),
        codeLesson(
          "Pseudocódigo: média",
          4,
          25,
          "Escreva em pseudocódigo: ler nota1 e nota2, calcular media = (nota1 + nota2) / 2",
          "INÍCIO\n  // leia nota1 e nota2\n  \nFIM",
          "media"
        ),
        quizLesson(
          "Operadores lógicos",
          5,
          15,
          "Qual operador lógico retorna verdadeiro apenas se AMBAS condições forem verdadeiras?",
          ["E (AND)", "OU (OR)", "NÃO (NOT)"],
          0
        ),
      ],
    },
    {
      title: "Algoritmos e decisões",
      pathOffset: 12,
      lessons: [
        codeLesson(
          "Decisão simples",
          1,
          25,
          "Em pseudocódigo: SE idade >= 18 ENTÃO escreva 'Maior de idade'",
          "idade = 20\nSE idade >= 18 ENTÃO\n  ",
          "maior de idade"
        ),
        quizLesson(
          "Fluxograma",
          2,
          15,
          "Em um fluxograma, qual símbolo representa uma decisão?",
          [
            "Losango (diamante)",
            "Retângulo",
            "Círculo",
          ],
          0
        ),
        codeLesson(
          "Laço de repetição",
          3,
          25,
          "Escreva em pseudocódigo: PARA i DE 1 ATÉ 3 FAÇA escreva i",
          "PARA i DE 1 ATÉ 3 FAÇA\n  ",
          "escreva"
        ),
        quizLesson(
          "Complexidade básica",
          4,
          15,
          "Um laço que percorre N elementos tem complexidade aproximada de...",
          ["O(N)", "O(1)", "O(N²)"],
          0
        ),
        codeLesson(
          "Busca linear",
          5,
          30,
          "Em pseudocódigo, percorra a lista [5, 10, 15] e verifique se contém o valor 10",
          "lista = [5, 10, 15]\nPARA cada item EM lista FAÇA\n  SE item == 10 ENTÃO\n    ",
          "encontrado"
        ),
      ],
    }
  );
}

function buildGitTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "Git",
      slug: "git",
      icon: "wrench",
      description: "Controle versões do seu código com Git.",
      order: 6,
      colorPrimary: "#ef4444",
      colorDark: "#b91c1c",
      colorLight: "#fca5a5",
      colorMuted: "#dc2626",
      colorOnPrimary: "#ffffff",
    },
    {
      title: "Conceitos",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "O que é Git?",
          1,
          10,
          "Git é um sistema de...",
          ["controle de versão", "compilação de código", "hospedagem de sites"],
          0
        ),
        codeLesson(
          "Inicializar repositório",
          2,
          20,
          "Digite o comando para criar um repositório Git na pasta atual",
          "# Comando para iniciar o Git\n",
          "git init"
        ),
        quizLesson(
          "Repositório",
          3,
          15,
          "O que é um commit em Git?",
          [
            "Um snapshot (foto) do código em um momento",
            "Um comando para apagar branches",
            "Um tipo de servidor remoto",
          ],
          0
        ),
        codeLesson(
          "Ver status",
          4,
          20,
          "Digite o comando para ver arquivos modificados e staged",
          "# Verifique o status do repositório\n",
          "git status"
        ),
        quizLesson(
          "Staging area",
          5,
          15,
          "O que faz git add arquivo.txt?",
          [
            "Prepara o arquivo para o próximo commit",
            "Envia o arquivo para o GitHub",
            "Apaga o arquivo do disco",
          ],
          0
        ),
      ],
    },
    {
      title: "Comandos essenciais",
      pathOffset: -12,
      lessons: [
        codeLesson(
          "Adicionar ao stage",
          1,
          20,
          "Adicione todos os arquivos modificados ao staging com git add",
          "# Adicione tudo ao stage\n",
          "git add"
        ),
        quizLesson(
          "Criar commit",
          2,
          15,
          "Qual comando registra um commit com a mensagem 'feat: login'?",
          ['git commit -m "feat: login"', "git push -m feat: login", "git save feat: login"],
          0
        ),
        codeLesson(
          "Fazer commit",
          3,
          25,
          "Crie um commit com a mensagem 'fix: corrige bug'",
          '# Após git add, registre o commit\n',
          'git commit -m "fix: corrige bug"'
        ),
        quizLesson(
          "Branches",
          4,
          15,
          "Para que servem branches em Git?",
          [
            "Desenvolver funcionalidades em paralelo sem afetar a main",
            "Aumentar a velocidade do compilador",
            "Criptografar o código-fonte",
          ],
          0
        ),
        codeLesson(
          "Criar branch",
          5,
          25,
          "Crie e mude para a branch feature/login",
          "# Crie a branch feature/login\n",
          "git checkout -b feature/login"
        ),
      ],
    }
  );
}

function buildSqlTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "SQL",
      slug: "sql",
      icon: "database",
      description: "Consulte e manipule dados com SQL.",
      order: 7,
      colorPrimary: "#6366f1",
      colorDark: "#4338ca",
      colorLight: "#a5b4fc",
      colorMuted: "#4f46e5",
      colorOnPrimary: "#ffffff",
    },
    {
      title: "Consultas básicas",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "O que é SQL?",
          1,
          10,
          "SQL é usado principalmente para...",
          ["consultar e manipular dados em bancos relacionais", "estilizar páginas web", "compilar JavaScript"],
          0
        ),
        codeLesson(
          "SELECT básico",
          2,
          20,
          "Selecione todas as colunas da tabela usuarios",
          "-- Escreva a consulta\n",
          "select * from usuarios"
        ),
        quizLesson(
          "WHERE",
          3,
          15,
          "Qual cláusula filtra registros em uma consulta?",
          ["WHERE", "ORDER", "GROUP"],
          0
        ),
        codeLesson(
          "Filtrar registros",
          4,
          25,
          "Selecione usuarios onde idade > 18",
          "SELECT * FROM usuarios\n",
          "where idade"
        ),
        quizLesson(
          "ORDER BY",
          5,
          15,
          "Como ordenar resultados por nome em ordem alfabética?",
          ["ORDER BY nome ASC", "SORT nome", "GROUP BY nome"],
          0
        ),
      ],
    },
    {
      title: "Relacionamentos",
      pathOffset: 12,
      lessons: [
        codeLesson(
          "Ordenar resultados",
          1,
          25,
          "Ordene produtos por preco em ordem decrescente (DESC)",
          "SELECT nome, preco FROM produtos\n",
          "order by preco desc"
        ),
        quizLesson(
          "Chave primária",
          2,
          15,
          "O que identifica unicamente cada linha em uma tabela?",
          ["Chave primária (PRIMARY KEY)", "Chave estrangeira", "Índice secundário"],
          0
        ),
        codeLesson(
          "INSERT",
          3,
          25,
          "Insira um usuário: INSERT INTO usuarios (nome, email) VALUES ('Ana', 'ana@email.com')",
          "-- Complete o INSERT\n",
          "insert into usuarios"
        ),
        quizLesson(
          "JOIN",
          4,
          15,
          "INNER JOIN serve para...",
          [
            "Combinar linhas de duas tabelas com base em uma condição",
            "Apagar registros duplicados",
            "Criar índices automaticamente",
          ],
          0
        ),
        codeLesson(
          "JOIN na prática",
          5,
          30,
          "Faça JOIN entre pedidos e clientes: SELECT * FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id",
          "SELECT * FROM pedidos\n",
          "join clientes"
        ),
      ],
    }
  );
}

function buildReactTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "React",
      slug: "react",
      icon: "layers",
      description: "Construa interfaces modernas com React.",
      order: 8,
      colorPrimary: "#06b6d4",
      colorDark: "#0e7490",
      colorLight: "#67e8f9",
      colorMuted: "#0891b2",
      colorOnPrimary: "#ffffff",
    },
    {
      title: "Componentes",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "O que é React?",
          1,
          10,
          "React é uma biblioteca para...",
          ["construir interfaces de usuário", "gerenciar bancos de dados", "compilar CSS"],
          0
        ),
        codeLesson(
          "Componente funcional",
          2,
          20,
          "Crie um componente funcional App que retorna <h1>Olá React</h1>",
          "function App() {\n  \n}",
          "return"
        ),
        quizLesson(
          "JSX",
          3,
          15,
          "JSX em React permite...",
          [
            "Escrever HTML-like dentro do JavaScript",
            "Substituir completamente o JavaScript",
            "Compilar apenas no servidor",
          ],
          0
        ),
        codeLesson(
          "Renderizar lista",
          4,
          25,
          "Use .map() para renderizar itens de ['A', 'B'] em <li key={item}>{item}</li>",
          "const itens = ['A', 'B'];\nfunction Lista() {\n  return (\n    <ul>\n      \n    </ul>\n  );\n}",
          ".map("
        ),
        quizLesson(
          "Props",
          5,
          15,
          "Como os componentes recebem dados do pai em React?",
          ["Através de props", "Através de globals", "Através de CSS"],
          0
        ),
      ],
    },
    {
      title: "Estado e interação",
      pathOffset: -12,
      lessons: [
        codeLesson(
          "Usar props",
          1,
          25,
          "Crie Saudacao({ nome }) que retorna <p>Olá, {nome}!</p>",
          "function Saudacao(/* props */) {\n  \n}",
          "{nome}"
        ),
        quizLesson(
          "useState",
          2,
          15,
          "Qual hook armazena estado local em componentes funcionais?",
          ["useState", "useEffect", "useMemo"],
          0
        ),
        codeLesson(
          "Contador",
          3,
          30,
          "Use useState(0) para criar contador e um botão que chama setContador(c => c + 1)",
          "import { useState } from 'react';\n\nfunction Contador() {\n  \n}",
          "usestate",
          "const [contador, setContador] = useState(0)"
        ),
        quizLesson(
          "useEffect",
          4,
          15,
          "useEffect é usado principalmente para...",
          [
            "Efeitos colaterais (fetch, DOM, timers)",
            "Definir estilos CSS",
            "Criar rotas de API",
          ],
          0
        ),
        codeLesson(
          "Evento onClick",
          5,
          30,
          "Adicione onClick={() => alert('Clicou!')} em um <button>",
          "function Botao() {\n  return (\n    <button>\n      Clique\n    </button>\n  );\n}",
          "onclick"
        ),
      ],
    }
  );
}

function buildTypescriptTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "TypeScript",
      slug: "typescript",
      icon: "cpu",
      description: "Adicione tipos estáticos ao JavaScript.",
      order: 9,
      colorPrimary: "#4b5563",
      colorDark: "#1f2937",
      colorLight: "#9ca3af",
      colorMuted: "#374151",
      colorOnPrimary: "#ffffff",
    },
    {
      title: "Tipos básicos",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "Por que TypeScript?",
          1,
          10,
          "TypeScript adiciona ao JavaScript principalmente...",
          ["tipagem estática em tempo de desenvolvimento", "execução mais rápida no browser", "substituição do HTML"],
          0
        ),
        codeLesson(
          "Anotar variável",
          2,
          20,
          "Declare const nome: string = 'Aprenda'",
          "// Tipagem explícita\n",
          "string"
        ),
        quizLesson(
          "Tipos primitivos",
          3,
          15,
          "Qual tipo representa valores verdadeiro/falso em TypeScript?",
          ["boolean", "bool", "logical"],
          0
        ),
        codeLesson(
          "Função tipada",
          4,
          25,
          "Crie function soma(a: number, b: number): number que retorna a + b",
          "function soma(a, b) {\n  return a + b;\n}",
          ": number"
        ),
        quizLesson(
          "Arrays tipados",
          5,
          15,
          "Como tipar um array de strings?",
          ["string[]", "array<string>", "strings"],
          0
        ),
      ],
    },
    {
      title: "Interfaces e generics",
      pathOffset: 12,
      lessons: [
        codeLesson(
          "Array de números",
          1,
          25,
          "Declare const ids: number[] = [1, 2, 3]",
          "// Array tipado\n",
          "number[]"
        ),
        quizLesson(
          "Interface",
          2,
          15,
          "Interfaces em TypeScript servem para...",
          [
            "Definir a forma (shape) de um objeto",
            "Compilar CSS automaticamente",
            "Executar SQL no servidor",
          ],
          0
        ),
        codeLesson(
          "Definir interface",
          3,
          25,
          "Crie interface Usuario { nome: string; idade: number }",
          "// Defina a interface Usuario\n",
          "interface usuario"
        ),
        quizLesson(
          "Generics",
          4,
          15,
          "Generics permitem...",
          [
            "Criar componentes/funções reutilizáveis com tipos flexíveis",
            "Remover todos os tipos do código",
            "Executar código apenas no servidor",
          ],
          0
        ),
        codeLesson(
          "Função genérica",
          5,
          30,
          "Crie function primeiro<T>(arr: T[]): T que retorna arr[0]",
          "function primeiro(arr) {\n  return arr[0];\n}",
          "<t>",
          "Use function primeiro<T>(arr: T[]): T"
        ),
      ],
    }
  );
}

function buildApisTrack(): TrackSeed {
  return buildTwoUnitTrack(
    {
      title: "APIs HTTP",
      slug: "apis",
      icon: "globe",
      description: "Entenda como aplicativos se comunicam pela web.",
      order: 10,
      colorPrimary: "#10b981",
      colorDark: "#047857",
      colorLight: "#6ee7b7",
      colorMuted: "#059669",
      colorOnPrimary: "#ffffff",
    },
    {
      title: "Fundamentos REST",
      pathOffset: 0,
      lessons: [
        quizLesson(
          "O que é uma API?",
          1,
          10,
          "API significa Application Programming Interface e permite...",
          [
            "Que sistemas se comuniquem e troquem dados",
            "Apenas criar layouts visuais",
            "Compilar código C++",
          ],
          0
        ),
        codeLesson(
          "URL de recurso",
          2,
          20,
          "Escreva a URL REST para listar usuários: GET https://api.exemplo.com/usuarios",
          "GET ",
          "https://api.exemplo.com/usuarios"
        ),
        quizLesson(
          "REST",
          3,
          15,
          "Em REST, cada URL geralmente representa...",
          ["um recurso", "um arquivo CSS", "uma sessão de usuário"],
          0
        ),
        codeLesson(
          "fetch GET",
          4,
          25,
          "Use fetch('/api/trilhas') e .then(res => res.json())",
          "// Busque as trilhas\n",
          "fetch("
        ),
        quizLesson(
          "JSON",
          5,
          15,
          "JSON é um formato de dados baseado em...",
          ["texto legível (chave-valor)", "imagens binárias", "planilhas Excel"],
          0
        ),
      ],
    },
    {
      title: "Métodos e status",
      pathOffset: -12,
      lessons: [
        codeLesson(
          "POST com body",
          1,
          30,
          "Envie POST com fetch: method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'Ana' })",
          "fetch('/api/usuarios', {\n  \n});",
          "method: 'post'"
        ),
        quizLesson(
          "Método GET",
          2,
          15,
          "Qual método HTTP busca dados sem alterar o servidor?",
          ["GET", "POST", "DELETE"],
          0
        ),
        codeLesson(
          "Tratar resposta",
          3,
          25,
          "Verifique if (!response.ok) throw new Error('Falha na requisição')",
          "async function carregar() {\n  const response = await fetch('/api/dados');\n  \n}",
          "response.ok"
        ),
        quizLesson(
          "Status 404",
          4,
          15,
          "O código HTTP 404 significa...",
          ["Recurso não encontrado", "Sucesso", "Erro interno do servidor"],
          0
        ),
        codeLesson(
          "Headers Authorization",
          5,
          30,
          "Adicione o header Authorization: 'Bearer TOKEN' na requisição",
          "fetch('/api/perfil', {\n  headers: {\n    'Content-Type': 'application/json',\n  },\n});",
          "authorization"
        ),
      ],
    }
  );
}

export function buildTracksSeedData(): TrackSeed[] {
  return [
    buildHtmlTrack(),
    buildCssTrack(),
    buildJavascriptTrack(),
    buildPythonTrack(),
    buildLogicaTrack(),
    buildGitTrack(),
    buildSqlTrack(),
    buildReactTrack(),
    buildTypescriptTrack(),
    buildApisTrack(),
  ];
}
