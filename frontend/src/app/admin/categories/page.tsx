"use client"

import {
  useEffect,
  useState,
} from "react"

import Link from "next/link"

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/admin-api"

type Category = {
  id: number
  name: string
  slug: string
  _count?: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")

  const [name, setName] =
    useState("")

  const [slug, setSlug] =
    useState("")

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [editName, setEditName] =
    useState("")

  const [editSlug, setEditSlug] =
    useState("")

  async function loadCategories() {
    try {
      setLoading(true)
      setError("")

      const data = await getCategories()

      setCategories(
        Array.isArray(data)
          ? data
          : data?.categories || []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load categories"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  function handleNameChange(
    value: string
  ) {
    setName(value)

    if (!slug) {
      setSlug(makeSlug(value))
    }
  }

  async function handleCreate(
    event: React.FormEvent
  ) {
    event.preventDefault()

    if (!name.trim()) {
      setError("Category name is required.")
      return
    }

    if (!slug.trim()) {
      setError("Category slug is required.")
      return
    }

    try {
      setSaving(true)
      setError("")

      const result =
        await createCategory({
          name: name.trim(),
          slug: slug.trim(),
        })

      const category =
        result?.category || result

      setCategories((current) => [
        ...current,
        category,
      ])

      setName("")
      setSlug("")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create category"
      )
    } finally {
      setSaving(false)
    }
  }

  function startEditing(
    category: Category
  ) {
    setEditingId(category.id)
    setEditName(category.name)
    setEditSlug(category.slug)
    setError("")
  }

  function cancelEditing() {
    setEditingId(null)
    setEditName("")
    setEditSlug("")
  }

  async function saveEditing(
    id: number
  ) {
    if (!editName.trim()) {
      setError("Category name is required.")
      return
    }

    if (!editSlug.trim()) {
      setError("Category slug is required.")
      return
    }

    try {
      setSaving(true)
      setError("")

      const result =
        await updateCategory(id, {
          name: editName.trim(),
          slug: editSlug.trim(),
        })

      const updated =
        result?.category || result

      setCategories((current) =>
        current.map((category) =>
          category.id === id
            ? {
                ...category,
                ...updated,
              }
            : category
        )
      )

      cancelEditing()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update category"
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(
    category: Category
  ) {
    const productCount =
      category._count?.products || 0

    if (productCount > 0) {
      setError(
        `Cannot delete "${category.name}" because it has ${productCount} product(s).`
      )
      return
    }

    if (
      !window.confirm(
        `Delete category "${category.name}"?`
      )
    ) {
      return
    }

    try {
      setError("")

      await deleteCategory(category.id)

      setCategories((current) =>
        current.filter(
          (item) =>
            item.id !== category.id
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete category"
      )
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          Baltena Market
        </div>

        <Link
          href="/admin"
          className="admin-header-back"
        >
          ← Dashboard
        </Link>
      </header>

      <div className="admin-content">
        <div className="admin-section-title">
          <div>
            <h1>Categories</h1>

            <p>
              Manage product categories.
            </p>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCreate}
          className="admin-form-card"
        >
          <div className="admin-section-title">
            <div>
              <h2>Add Category</h2>

              <p>
                Create a category for your products.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div>
              <label>
                Category Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  handleNameChange(
                    event.target.value
                  )
                }
                placeholder="e.g. Food"
                required
              />
            </div>

            <div>
              <label>
                Slug
              </label>

              <input
                type="text"
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                  )
                }
                placeholder="food"
                required
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Add Category"}
            </button>
          </div>
        </form>

        <section className="admin-form-card">
          <div className="admin-section-title">
            <div>
              <h2>
                Category List
              </h2>

              <p>
                {categories.length} categor
                {categories.length === 1
                  ? "y"
                  : "ies"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="admin-empty">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="admin-empty">
              No categories yet.
            </div>
          ) : (
            <div className="admin-category-list">
              {categories.map(
                (category) => (
                  <div
                    key={category.id}
                    className="admin-category-row"
                  >
                    {editingId ===
                    category.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(
                            event
                          ) =>
                            setEditName(
                              event.target
                                .value
                            )
                          }
                        />

                        <input
                          type="text"
                          value={editSlug}
                          onChange={(
                            event
                          ) =>
                            setEditSlug(
                              event.target
                                .value
                            )
                          }
                        />

                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-primary-button"
                            disabled={saving}
                            onClick={() =>
                              saveEditing(
                                category.id
                              )
                            }
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={
                              cancelEditing
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="admin-category-info">
                          <strong>
                            {category.name}
                          </strong>

                          <span>
                            /{category.slug}
                          </span>
                        </div>

                        <div className="admin-category-products">
                          {category._count?.products ||
                            0}{" "}
                          product
                          {category._count?.products ===
                          1
                            ? ""
                            : "s"}
                        </div>

                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={() =>
                              startEditing(
                                category
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
