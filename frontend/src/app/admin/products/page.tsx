"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getAdminProducts, deleteProduct } from "@/lib/api"

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
  description?: string | null
  image?: string | null
  category?: {
    id: number
    name: string
  } | null
  variants?: Variant[]
}

export default function AdminProductsPage() {
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadProducts() {
    try {
      setLoading(true)
      setError("")

      const data = await getAdminProducts()

      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError("Failed to load products.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("baltena_admin_token")

    if (!token) {
      router.push("/admin/login")
      return
    }

    loadProducts()
  }, [router])

  async function handleDelete(id: number, name: string) {
    const confirmed = window.confirm(
      `Delete "${name}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      console.error(err)
      alert("Failed to delete product.")
    }
  }

  const totalStock = useMemo(() => {
    return products.reduce((total, product) => {
      return (
        total +
        (product.variants || []).reduce(
          (sum, variant) => sum + Number(variant.stock || 0),
          0
        )
      )
    }, 0)
  }, [products])

  function logout() {
    localStorage.removeItem("baltena_admin_token")
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <main className="admin-products-page">
        <div className="products-loading">
          <div className="products-loading-spinner" />
          <h2>Loading products...</h2>
          <p>Please wait.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-products-page">
      <div className="products-page-header">
        <div>
          <div className="products-breadcrumb">
            <Link href="/admin">Dashboard</Link>
            <span>/</span>
            <strong>Products</strong>
          </div>

          <div className="products-title-row">
            <div>
              <h1>Products</h1>
              <p>Manage your products, prices, sizes and stock.</p>
            </div>

            <div className="products-header-actions">
              <button
                type="button"
                className="products-refresh-button"
                onClick={loadProducts}
              >
                Refresh
              </button>

              <Link
                href="/admin/products/new"
                className="products-add-button"
              >
                + Add Product
              </Link>

              <button
                type="button"
                className="products-logout-button"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="products-overview">
          <div className="products-overview-card">
            <span>Products</span>
            <strong>{products.length}</strong>
          </div>

          <div className="products-overview-card">
            <span>Total Stock</span>
            <strong>{totalStock}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <section className="products-empty">
          <div className="products-empty-icon">+</div>
          <h2>No products yet</h2>
          <p>
            Create your first product to start selling on Baltena Market.
          </p>

          <Link
            href="/admin/products/new"
            className="products-add-button"
          >
            Add Product
          </Link>
        </section>
      ) : (
        <section className="admin-products-grid">
          {products.map((product) => {
            const variants = product.variants || []

            const stock = variants.reduce(
              (sum, variant) => sum + Number(variant.stock || 0),
              0
            )

            const prices = variants.map((variant) =>
              Number(variant.price)
            )

            const lowestPrice =
              prices.length > 0 ? Math.min(...prices) : null

            return (
              <article
                key={product.id}
                className="admin-product-card"
              >
                <div className="admin-product-card-image">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div className="product-no-image">
                      No Image
                    </div>
                  )}

                  {stock === 0 && (
                    <span className="product-stock-overlay">
                      Out of stock
                    </span>
                  )}
                </div>

                <div className="admin-product-card-content">
                  <div className="product-title-row">
                    <div>
                      <h2>{product.name}</h2>

                      {product.category && (
                        <span className="product-category">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.description && (
                    <p className="product-description">
                      {product.description}
                    </p>
                  )}

                  <div className="product-main-price">
                    <span>Starting price</span>

                    <strong>
                      {lowestPrice !== null
                        ? `${lowestPrice.toFixed(2)} ETB`
                        : "No price"}
                    </strong>
                  </div>

                  <div className="product-variants-section">
                    <div className="product-variants-header">
                      <span>Variants</span>
                      <strong>{variants.length}</strong>
                    </div>

                    {variants.length > 0 ? (
                      <div className="product-variants">
                        {variants.map((variant) => (
                          <div
                            key={variant.id}
                            className="product-variant"
                          >
                            <span className="variant-size">
                              {variant.size}
                            </span>

                            <span className="variant-price">
                              {Number(variant.price).toFixed(2)} ETB
                            </span>

                            <span
                              className={`variant-stock ${
                                variant.stock > 0
                                  ? "available"
                                  : "unavailable"
                              }`}
                            >
                              {variant.stock > 0
                                ? `${variant.stock} in stock`
                                : "Out of stock"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-variants">
                        No variants added
                      </div>
                    )}
                  </div>

                  <div className="product-card-footer">
                    <div className="total-stock">
                      <span>Total stock</span>
                      <strong>{stock}</strong>
                    </div>

                    <div className="product-actions">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="product-edit-button"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="product-delete-button"
                        onClick={() =>
                          handleDelete(product.id, product.name)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}