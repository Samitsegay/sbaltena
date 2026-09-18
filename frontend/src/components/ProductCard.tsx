import Link from "next/link"

type Variant = {
  id: number
  size: string
  price: string | number
  stock: number
}

type Product = {
  id: number
  name: string
  description?: string
  image?: string
  variants?: Variant[]
}

export default function ProductCard({
  product,
}: {
  product: Product
}) {
  const availableVariants =
    product.variants?.filter(
      (variant) => variant.stock > 0
    ) || []

  const lowestPrice =
    availableVariants.length > 0
      ? Math.min(
          ...availableVariants.map(
            (variant) => Number(variant.price)
          )
        )
      : null

  return (
    <article className="product-card">
      <Link
        href={`/products/${product.id}`}
        className="product-card-link"
      >
        <div className="product-card-image">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
            />
          ) : (
            <div className="product-image-placeholder">
              No Image
            </div>
          )}
        </div>

        <div className="product-card-content">
          <h2>{product.name}</h2>

          {product.description && (
            <p>{product.description}</p>
          )}

          <div className="product-card-price">
            {lowestPrice !== null
              ? `From ${lowestPrice.toFixed(2)} ETB`
              : "Out of stock"}
          </div>
        </div>
      </Link>

      <Link
        href={`/products/${product.id}`}
        className="primary-button product-card-button"
      >
        {availableVariants.length > 0
          ? "View Product"
          : "View Details"}
      </Link>
    </article>
  )
}
