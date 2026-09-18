const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to load products")
  }

  return response.json()
}

export async function getProduct(id: string) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Product not found")
  }

  return response.json()
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to load categories")
  }

  return response.json()
}

export async function createOrder(data: {
  customerName: string
  phone: string
  region?: string
  city?: string
  subCity?: string
  woreda?: string
  houseNumber?: string
  address?: string
  note?: string
  items: {
    variantId: number
    quantity: number
  }[]
}) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to place order"
    )
  }

  return result
}

export async function deleteProduct(id: number) {
  const token = localStorage.getItem("baltena_admin_token")

  const response = await fetch(
    `${API_URL}/products/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    const text = await response.text()

    throw new Error(
      text || "Failed to delete product"
    )
  }

  return response.json()
}

export async function getAdminProducts() {
  const token = localStorage.getItem("baltena_admin_token")

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/products`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "Failed to load admin products")
  }

  return response.json()
}