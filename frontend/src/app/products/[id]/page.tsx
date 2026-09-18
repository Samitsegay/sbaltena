"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { getProduct } from "@/lib/api"
import { useCart } from "@/components/CartProvider"

type Variant = {
  id: number
  size: string
  price: string | number
  stock: number
}

type Product = {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  category?: {
    name: string
  }
  variants: Variant[]
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] =
    useState<Variant | null>(null)

  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(String(params.id))

        setProduct(data)

        if (data.variants?.length > 0) {
          const available = data.variants.find(
            (variant: Variant) => variant.stock > 0
          )

          if (available) {
            setSelectedVariant(available)
          }
        }
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (loading) {
    return (
      <main className="container">
        <p>Loading product...</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="container">
        <h1>Product not found</h1>

        <Link href="/products">
          Back to Products
        </Link>
      </main>
    )
  }

  const currentProduct = product

  function handleAddToCart() {
    if (!selectedVariant) return

    addItem({
      variantId: selectedVariant.id,
      productId: currentProduct.id,
      productName: currentProduct.name,
      size: selectedVariant.size,
      price: Number(selectedVariant.price),
      quantity,
      image: currentProduct.image || "",
    })

    router.push("/cart")
  }

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : 0

  return (
    <main className="container product-detail-page">
      <div className="product-detail-grid">

        <div className="product-detail-image">
          {currentProduct.image ? (
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
            />
          ) : (
            <div className="product-image-placeholder">
              No Image
            </div>
          )}
        </div>

        <div className="product-detail-info">

          <Link href="/products">
            ← Back to Products
          </Link>

          <h1>
            {currentProduct.name}
          </h1>

          {currentProduct.category && (
            <p className="product-category">
              {currentProduct.category.name}
            </p>
          )}

          {currentProduct.description && (
            <p className="product-description">
              {currentProduct.description}
            </p>
          )}

          <div className="product-price">
            {selectedVariant
              ? `${price.toFixed(2)} ETB`
              : "Select a size"}
          </div>

          <div className="product-option">
            <h3>Choose Size</h3>

            <div className="size-options">
              {currentProduct.variants.map(
                (variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={variant.stock <= 0}
                    className={
                      selectedVariant?.id ===
                      variant.id
                        ? "size-button selected"
                        : "size-button"
                    }
                    onClick={() => {
                      setSelectedVariant(variant)
                      setQuantity(1)
                    }}
                  >
                    {variant.size}

                    {variant.stock <= 0 && (
                      <span>
                        {" "}
                        Sold out
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          {selectedVariant && (
            <>
              <p className="stock-text">
                {selectedVariant.stock} available
              </p>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        selectedVariant.stock,
                        q + 1
                      )
                    )
                  }
                >
                  +
                </button>

              </div>

              <button
                type="button"
                className="primary-button add-cart-button"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </>
          )}

        </div>
      </div>
    </main>
  )
}
