"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export type CartItem = {
  variantId: number
  productId: number
  productName: string
  size: string
  price: number
  quantity: number
  image?: string | null
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: number) => void
  updateQuantity: (variantId: number, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("baltena-cart")

      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      setItems([])
    }

    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("baltena-cart", JSON.stringify(items))
    }
  }, [items, loaded])

  function addItem(item: CartItem) {
    setItems((current) => {
      const existing = current.find(
        (x) => x.variantId === item.variantId,
      )

      if (existing) {
        return current.map((x) =>
          x.variantId === item.variantId
            ? {
                ...x,
                quantity: x.quantity + item.quantity,
              }
            : x,
        )
      }

      return [...current, item]
    })
  }

  function removeItem(variantId: number) {
    setItems((current) =>
      current.filter((x) => x.variantId !== variantId),
    )
  }

  function updateQuantity(
    variantId: number,
    quantity: number,
  ) {
    if (quantity <= 0) {
      removeItem(variantId)
      return
    }

    setItems((current) =>
      current.map((x) =>
        x.variantId === variantId
          ? { ...x, quantity }
          : x,
      ),
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [items],
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used inside CartProvider")
  }

  return context
}