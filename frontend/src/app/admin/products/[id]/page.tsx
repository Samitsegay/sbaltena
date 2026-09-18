"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  useParams,
  usePathname,
  useRouter,
} from "next/navigation"

import Link from "next/link"

import {
  getAdminProduct,
  createProduct,
  updateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  getCategories,
  uploadProductImage,
} from "@/lib/admin-api"

type Category = {
  id: number
  name: string
}

type Variant = {
  id: number
  size: string
  price: number | string
  stock: number
}

export default function ProductEditorPage() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()

  const id = String(params.id)
  const isNew = pathname.endsWith("/new")

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [error, setError] = useState("")
  const [imageError, setImageError] = useState("")

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const [categories, setCategories] = useState<Category[]>([])
  const [variants, setVariants] = useState<Variant[]>([])

  const [newSize, setNewSize] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newStock, setNewStock] = useState("")

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()

        setCategories(
          Array.isArray(data)
            ? data
            : data?.categories || []
        )
      } catch (err) {
        console.error(err)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }

    async function loadProduct() {
      try {
        setLoading(true)
        setError("")

        const data = await getAdminProduct(id)
        const product = data?.product || data

        setName(product.name || "")
        setSlug(product.slug || "")
        setDescription(product.description || "")
        setImage(product.image || "")

        setCategoryId(
          product.categoryId
            ? String(product.categoryId)
            : ""
        )

        setVariants(
          Array.isArray(product.variants)
            ? product.variants
            : []
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product"
        )
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, isNew])

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    setImageError("")

    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file.")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be smaller than 5MB.")
      event.target.value = ""
      return
    }

    try {
      setUploadingImage(true)

      const result = await uploadProductImage(file)

      if (!result?.url) {
        throw new Error(
          "Upload succeeded but no image URL was returned."
        )
      }

      const fullImageUrl =
        result.url.startsWith("http")
          ? result.url
          : `http://localhost:3000${result.url}`

      setImage(fullImageUrl)
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : "Image upload failed"
      )
    } finally {
      setUploadingImage(false)
      event.target.value = ""
    }
  }

  async function handleCreateProduct(
    event: React.FormEvent
  ) {
    event.preventDefault()

    try {
      setSaving(true)
      setError("")

      if (!name.trim()) {
        throw new Error("Product name is required.")
      }

      if (!slug.trim()) {
        throw new Error("Product slug is required.")
      }

      const result = await createProduct({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        categoryId: categoryId
          ? Number(categoryId)
          : undefined,
      })

      const product = result?.product || result

      if (!product?.id) {
        throw new Error(
          "Product was created but no product ID was returned."
        )
      }

      router.push(`/admin/products/${product.id}`)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create product"
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateProduct(
    event: React.FormEvent
  ) {
    event.preventDefault()

    try {
      setSaving(true)
      setError("")

      if (!name.trim()) {
        throw new Error("Product name is required.")
      }

      if (!slug.trim()) {
        throw new Error("Product slug is required.")
      }

      await updateProduct(id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        categoryId: categoryId
          ? Number(categoryId)
          : null,
      })

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update product"
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleAddVariant() {
    if (!newSize.trim()) {
      setError("Variant size is required.")
      return
    }

    const price = Number(newPrice)
    const stock = Number(newStock)

    if (Number.isNaN(price) || price < 0) {
      setError("Enter a valid price.")
      return
    }

    if (Number.isNaN(stock) || stock < 0) {
      setError("Enter a valid stock quantity.")
      return
    }

    try {
      setError("")

      const result = await addVariant(
        Number(id),
        {
          size: newSize.trim(),
          price,
          stock,
        }
      )

      const variant = result?.variant || result

      setVariants((current) => [
        ...current,
        variant,
      ])

      setNewSize("")
      setNewPrice("")
      setNewStock("")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add variant"
      )
    }
  }

  async function handleVariantUpdate(
    variantId: number,
    field: "size" | "price" | "stock",
    value: string
  ) {
    try {
      const updateData: {
        size?: string
        price?: number
        stock?: number
      } = {}

      if (field === "size") {
        updateData.size = value
      }

      if (field === "price") {
        updateData.price = Number(value)
      }

      if (field === "stock") {
        updateData.stock = Number(value)
      }

      const result = await updateVariant(
        variantId,
        updateData
      )

      const updated = result?.variant || result

      setVariants((current) =>
        current.map((variant) =>
          variant.id === variantId
            ? { ...variant, ...updated }
            : variant
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update variant"
      )
    }
  }

  async function handleDeleteVariant(
    variantId: number
  ) {
    if (!window.confirm("Delete this variant?")) {
      return
    }

    try {
      await deleteVariant(variantId)

      setVariants((current) =>
        current.filter(
          (variant) => variant.id !== variantId
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete variant"
      )
    }
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-content">
          <div className="admin-card">
            Loading product...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          Baltena Market
        </div>

        <Link
          href="/admin/products"
          className="admin-header-back"
        >
          ← Products
        </Link>
      </header>

      <div className="admin-content">
        <div className="admin-section-title">
          <div>
            <h1>
              {isNew ? "Add Product" : "Edit Product"}
            </h1>

            <p>
              {isNew
                ? "Create a new product"
                : "Update product information"}
            </p>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <form
          onSubmit={
            isNew
              ? handleCreateProduct
              : handleUpdateProduct
          }
          className="admin-form-card"
        >
          <div className="admin-form-grid">
            <div>
              <label>Product Name</label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Product name"
                required
              />
            </div>

            <div>
              <label>Slug</label>

              <input
                type="text"
                value={slug}
                onChange={(event) =>
                  setSlug(event.target.value)
                }
                placeholder="product-slug"
                required
              />
            </div>

            <div className="admin-full">
              <label>Description</label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Product description"
                rows={5}
              />
            </div>

            <div className="admin-full">
              <label>Product Image</label>

              <div className="admin-image-upload">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                />

                {uploadingImage && (
                  <p className="admin-uploading">
                    Uploading image...
                  </p>
                )}

                {imageError && (
                  <p className="admin-error">
                    {imageError}
                  </p>
                )}

                {image && (
                  <div className="admin-image-preview">
                    <img
                      src={image}
                      alt={
                        name || "Product preview"
                      }
                    />

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() => setImage("")}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-full">
              <label>Category</label>

              <select
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
              >
                <option value="">
                  No category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-actions">
            <Link
              href="/admin/products"
              className="admin-secondary-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving || uploadingImage}
            >
              {saving
                ? "Saving..."
                : isNew
                ? "Create Product"
                : "Save Changes"}
            </button>
          </div>
        </form>

        {!isNew && (
          <section className="admin-form-card">
            <div className="admin-section-title">
              <div>
                <h2>Product Variants</h2>
                <p>
                  Add sizes, prices and stock.
                </p>
              </div>
            </div>

            <div className="admin-variant-add">
              <input
                type="text"
                value={newSize}
                onChange={(event) =>
                  setNewSize(event.target.value)
                }
                placeholder="Size e.g. 1L"
              />

              <input
                type="number"
                value={newPrice}
                onChange={(event) =>
                  setNewPrice(event.target.value)
                }
                placeholder="Price"
                min="0"
                step="0.01"
              />

              <input
                type="number"
                value={newStock}
                onChange={(event) =>
                  setNewStock(event.target.value)
                }
                placeholder="Stock"
                min="0"
              />

              <button
                type="button"
                className="admin-primary-button"
                onClick={handleAddVariant}
              >
                Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="admin-empty">
                No variants yet.
              </div>
            ) : (
              <div className="admin-variant-list">
                {variants.map((variant) => (
                  <div
                    className="admin-variant-row"
                    key={variant.id}
                  >
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(event) =>
                        setVariants((current) =>
                          current.map((item) =>
                            item.id === variant.id
                              ? {
                                  ...item,
                                  size: event.target.value,
                                }
                              : item
                          )
                        )
                      }
                      onBlur={(event) =>
                        handleVariantUpdate(
                          variant.id,
                          "size",
                          event.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      value={Number(variant.price)}
                      min="0"
                      step="0.01"
                      onChange={(event) =>
                        setVariants((current) =>
                          current.map((item) =>
                            item.id === variant.id
                              ? {
                                  ...item,
                                  price: event.target.value,
                                }
                              : item
                          )
                        )
                      }
                      onBlur={(event) =>
                        handleVariantUpdate(
                          variant.id,
                          "price",
                          event.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      value={variant.stock}
                      min="0"
                      onChange={(event) =>
                        setVariants((current) =>
                          current.map((item) =>
                            item.id === variant.id
                              ? {
                                  ...item,
                                  stock: Number(
                                    event.target.value
                                  ),
                                }
                              : item
                          )
                        )
                      }
                      onBlur={(event) =>
                        handleVariantUpdate(
                          variant.id,
                          "stock",
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDeleteVariant(variant.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
