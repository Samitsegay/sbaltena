"use client"

import Link from "next/link"
import { useCart } from "./CartProvider"

export default function Header() {
  const { items } = useCart()

  const cartCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="site-logo"
        >
          Baltena Market
        </Link>

        <nav className="site-nav">
          <Link href="/">
            Home
          </Link>

          <Link href="/products">
            Products
          </Link>

          <Link href="/categories">
            Categories
          </Link>

          <Link
            href="/cart"
            className="cart-link"
          >
            Cart
            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/login"
            className="admin-login-button"
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
