"use client"

import Link from "next/link"
import { useCart } from "@/components/CartProvider"

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
  } = useCart()

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  )

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <main className="container cart-page">
        <div className="empty-cart">
          <h1>Your Cart</h1>

          <p>
            Your cart is empty.
          </p>

          <Link
            href="/products"
            className="primary-button"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container cart-page">
      <div className="cart-header">
        <div>
          <h1>Your Cart</h1>

          <p>
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>

        <Link
          href="/products"
          className="secondary-button"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">

        <div className="cart-items">

          {items.map((item) => (
            <div
              key={item.variantId}
              className="cart-item"
            >

              <div className="cart-item-image">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName}
                  />
                ) : (
                  <span>
                    No Image
                  </span>
                )}
              </div>

              <div className="cart-item-details">

                <h2>
                  {item.productName}
                </h2>

                <p>
                  Size:{" "}
                  <strong>
                    {item.size}
                  </strong>
                </p>

                <p className="cart-item-price">
                  {Number(item.price).toFixed(2)} ETB
                </p>

                <div className="cart-item-actions">

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.variantId,
                          Math.max(
                            1,
                            item.quantity - 1
                          )
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.variantId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeItem(
                        item.variantId
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

              <div className="cart-item-total">
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}{" "}
                ETB
              </div>

            </div>
          ))}

        </div>

        <aside className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">
            <span>
              Products
            </span>

            <span>
              {totalItems}
            </span>
          </div>

          <div className="summary-row">
            <span>
              Subtotal
            </span>

            <span>
              {total.toFixed(2)} ETB
            </span>
          </div>

          <div className="summary-row">
            <span>
              Delivery
            </span>

            <span>
              To be arranged
            </span>
          </div>

          <div className="summary-row total-row">

            <strong>
              Total
            </strong>

            <strong>
              {total.toFixed(2)} ETB
            </strong>

          </div>

          <Link
            href="/checkout"
            className="primary-button checkout-button"
          >
            Proceed to Checkout
          </Link>

        </aside>

      </div>
    </main>
  )
}
