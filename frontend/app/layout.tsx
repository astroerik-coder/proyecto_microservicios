import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { OrdersProvider } from "@/hooks/use-orders";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Distribuidora XYZ - Sistema de Gestión",
  description:
    "Sistema de gestión de pedidos para distribuidora de productos de consumo masivo",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <OrdersProvider>
            <CartProvider>{children}</CartProvider>
          </OrdersProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
