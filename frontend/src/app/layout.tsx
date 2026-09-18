import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/components/CartProvider"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "Baltena Market",
  description: "Baltena Market - Shop online",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}