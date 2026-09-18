import { getProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <section className="section products-page">
      <div className="container">
        <div className="page-heading">
          <span className="eyebrow">SHOP</span>
          <h1>All Products</h1>
          <p>Browse everything currently available at Baltena Market.</p>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-box">
            No products available yet.
          </div>
        )}
      </div>
    </section>
  )
}