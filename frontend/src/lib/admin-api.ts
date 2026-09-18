const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

function getToken() {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("baltena_admin_token") || ""
}

async function adminRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken()
  const headers = new Headers(options.headers)

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong")
  }

  return data
}

export async function adminLogin(
  email: string,
  password: string
) {
  const response = await fetch(`${API_URL}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || "Invalid email or password")
  }

  const token =
    data?.access_token ||
    data?.token ||
    data?.accessToken

  if (!token) {
    throw new Error("Login succeeded but no token was returned")
  }

  localStorage.setItem("baltena_admin_token", token)

  return data
}

export function adminLogout() {
  localStorage.removeItem("baltena_admin_token")
  window.location.href = "/admin/login"
}

export async function uploadProductImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const token = getToken()

  const response = await fetch(`${API_URL}/uploads/product-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || "Image upload failed")
  }

  return data
}

export async function getAdminProducts() {
  return adminRequest("/products")
}

export async function getAdminProduct(id: string) {
  return adminRequest(`/products/${id}`)
}

export async function createProduct(data: {
  name: string
  slug: string
  description?: string
  image?: string
  categoryId?: number
}) {
  return adminRequest("/products", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateProduct(
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
    image?: string
    categoryId?: number | null
  }
) {
  return adminRequest(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: string) {
  return adminRequest(`/products/${id}`, {
    method: "DELETE",
  })
}

export async function addVariant(
  productId: number,
  data: {
    size: string
    price: number
    stock: number
  }
) {
  return adminRequest(`/products/${productId}/variants`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateVariant(
  variantId: number,
  data: {
    size?: string
    price?: number
    stock?: number
  }
) {
  return adminRequest(`/products/variants/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteVariant(variantId: number) {
  return adminRequest(`/products/variants/${variantId}`, {
    method: "DELETE",
  })
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

export async function createCategory(data: {
  name: string
  slug: string
}) {
  return adminRequest("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateCategory(
  id: number,
  data: {
    name?: string
    slug?: string
  }
) {
  return adminRequest(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteCategory(id: number) {
  return adminRequest(`/categories/${id}`, {
    method: "DELETE",
  })
}

export async function getAdminOrders() {
  return adminRequest("/orders")
}

export async function updateOrderStatus(
  id: number,
  status: string
) {
  return adminRequest(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  })
}

export async function getOrder(orderNumber: string) {
  return adminRequest(`/orders/${orderNumber}`)
}

