import type { Metadata } from "next";
import { TRPCProvider } from "@/trpc/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gerenciador de Tarefas",
  description: "Aplicação de gerenciamento de tarefas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}