import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monte Sua Seleção – Copa do Mundo 2026",
  description: "Escolha seus 26 convocados da pré-lista do Brasil para a Copa do Mundo 2026 e gere sua figurinha de convocação!",
  openGraph: {
    title: "Monte Sua Seleção – Copa do Mundo 2026",
    description: "Escolha seus 26 convocados da pré-lista do Brasil para a Copa do Mundo 2026!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="noise">{children}</body>
    </html>
  );
}
