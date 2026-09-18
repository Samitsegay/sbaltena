"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/CartProvider"
import { createOrder } from "@/lib/api"

const regions = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Central Ethiopia",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "Southwest Ethiopia",
  "Tigray",
]

export default function CheckoutPage() {
  const router = useRouter()

  const {
    items,
    clearCart,
  } = useCart()

  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("")
  const [city, setCity] = useState("")
  const [subCity, setSubCity] = useState("")
  const [woreda, setWoreda] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [address, setAddress] = useState("")
  const [note, setNote] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  )

  const totalItems = items.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  )

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (items.length === 0) {
      setError("Your cart is empty.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),

        region: region.trim(),
        city: city.trim(),
        subCity: subCity.trim(),
        woreda: woreda.trim(),
        houseNumber: houseNumber.trim(),
        address: address.trim(),
        note: note.trim(),

        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      })

      clearCart()

      router.push(
        `/checkout/success?order=${encodeURIComponent(
          order.orderNumber
        )}`
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to place order"
      )
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="container checkout-page">
        <div className="empty-cart">
          <h1>Your Cart Is Empty</h1>
          <p>
            Add products to your cart before checkout.
          </p>

          <Link
            href="/products"
            className="primary-button"
          >
            Browse Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>
          Enter your information and delivery
          location.
        </p>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <section className="checkout-section">
            <h2>Customer Information</h2>

            <div className="form-group">
              <label htmlFor="customerName">
                Full Name *
              </label>

              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number *
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="09xxxxxxxx or +251..."
                required
              />
            </div>
          </section>

          <section className="checkout-section">
            <h2>Ethiopian Delivery Location</h2>

            <div className="form-group">
              <label htmlFor="region">
                Region *
              </label>

              <select
                id="region"
                value={region}
                onChange={(e) =>
                  setRegion(e.target.value)
                }
                required
              >
                <option value="">
                  Select your region
                </option>

                {regions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="city">
                  City *
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="e.g. Addis Ababa"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subCity">
                  Sub-city / Town
                </label>

                <input
                  id="subCity"
                  type="text"
                  value={subCity}
                  onChange={(e) =>
                    setSubCity(e.target.value)
                  }
                  placeholder="e.g. Bole"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="woreda">
                  Woreda
                </label>

                <input
                  id="woreda"
                  type="text"
                  value={woreda}
                  onChange={(e) =>
                    setWoreda(e.target.value)
                  }
                  placeholder="Woreda number/name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="houseNumber">
                  House / Building / Office No.
                </label>

                <input
                  id="houseNumber"
                  type="text"
                  value={houseNumber}
                  onChange={(e) =>
                    setHouseNumber(e.target.value)
                  }
                  placeholder="House or building number"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">
                Additional Address
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Street, landmark, area, building name..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="note">
                Delivery Note
              </label>

              <textarea
                id="note"
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Anything the delivery person should know?"
                rows={3}
              />
            </div>
          </section>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button checkout-submit"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

          <p className="payment-note">
            No online payment is required.
            We will contact you using the phone
            number provided.
          </p>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {items.map((item) => (
            <div
              key={item.variantId}
              className="checkout-item"
            >
              <div>
                <strong>
                  {item.productName}
                </strong>

                <p>
                  Size: {item.size} ×{" "}
                  {item.quantity}
                </p>
              </div>

              <span>
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}{" "}
                ETB
              </span>
            </div>
          ))}

          <div className="summary-row">
            <span>Products</span>
            <span>{totalItems}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              {total.toFixed(2)} ETB
            </span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>To be arranged</span>
          </div>

          <div className="summary-row total-row">
            <strong>Total</strong>
            <strong>
              {total.toFixed(2)} ETB
            </strong>
          </div>
        </aside>
      </div>
    </main>
  )
}
