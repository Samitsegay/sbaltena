"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

  return (
    <main className="container success-page">
      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>Order Received!</h1>

        <p>
          Thank you for shopping with
          Baltena Market.
        </p>

        {orderNumber && (
          <div className="order-number-box">
            <span>Order Number</span>
            <strong>{orderNumber}</strong>
          </div>
        )}

        <p>
          We received your order successfully.
          We will contact you using the phone
          number you provided.
        </p>

        <div className="success-actions">
          <Link
            href="/products"
            className="primary-button"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="secondary-button"
          >
            Back Home
          </Link>
        </div>

      </div>
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="container success-page">
          <div className="success-card">
            <h1>Loading...</h1>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
