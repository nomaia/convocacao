# 🏆 Monte Sua Seleção – Copa do Mundo 2026

Escolha seus 26 convocados da pré-lista de Ancelotti para a Copa do Mundo 2026 e gere uma figurinha personalizada com seu nome!

## ✨ Funcionalidades

- 🃏 **Figurinhas estilo Panini** – cada jogador exibido como uma figurinha colecionável
- ⚽ **55 jogadores** da pré-lista oficial enviada pela CBF à FIFA
- 🔍 Filtro por posição + busca por nome/clube
- 🏆 Selecione até **26 jogadores** para montar sua seleção
- 🖼️ Gera um **poster personalizável** com seu nome e baixa como imagem PNG

## 🚀 Deploy no Vercel

### Opção 1 – GitHub + Vercel (recomendado)

1. Crie um repositório no GitHub e envie este projeto:
   ```bash
   git init
   git add .
   git commit -m "feat: monte sua seleção copa 2026"
   git remote add origin https://github.com/SEU_USUARIO/selecao-brasil-2026.git
   git push -u origin main
   ```

2. Acesse [vercel.com](https://vercel.com), clique em **New Project**
3. Importe o repositório do GitHub
4. Clique em **Deploy** – pronto! 🎉

### Opção 2 – Vercel CLI

```bash
npm install -g vercel
cd selecao-brasil-2026
vercel --prod
```

## 🛠️ Desenvolvimento local

```bash
npm install
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🗂️ Estrutura

```
src/
├── app/
│   ├── layout.tsx       # Layout raiz
│   ├── page.tsx         # Página principal
│   └── globals.css      # Estilos globais
├── components/
│   ├── JogadorCard.tsx  # Figurinha do jogador
│   └── PosterModal.tsx  # Modal de geração do poster
└── data/
    └── jogadores.ts     # Lista completa dos 55 pré-convocados
```

## 📋 Jogadores incluídos

A lista inclui os 55 jogadores da pré-convocação enviada pela CBF à FIFA em maio de 2026, com dados de:
- Nome, clube e país onde joga
- Posição (GOL/DEF/MEI/ATA)
- Número preferencial, idade, caps e gols pela Seleção

## 🎨 Tecnologias

- **Next.js 14** – framework React
- **TypeScript** – tipagem
- **Tailwind CSS** – utilitários
- **html2canvas** – geração da imagem/poster
- **Bebas Neue + Barlow** – tipografia estilo esportivo
