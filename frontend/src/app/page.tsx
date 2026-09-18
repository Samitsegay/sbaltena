import Link from "next/link"
import { getProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"

export default async function HomePage() {
  const products = await getProducts()

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div>
            <span className="eyebrow">WELCOME TO BALTENA MARKET</span>

            <h1>
              Quality products.
              <br />
              Simple shopping.
            </h1>

            <p>
              Discover products, choose your preferred size,
              add them to your cart and order easily.
            </p>

            <Link href="/products" className="button">
              Shop Products
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OUR PRODUCTS</span>
              <h2>Featured Products</h2>
            </div>

            <Link href="/products" className="text-link">
              View all â†’
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="product-grid">
              {products.slice(0, 6).map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="empty-box">
              Products will appear here when the admin adds them.
            </div>
          )}
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>Shopping made simple</h2>
          </div>

          <div className="steps">
            <div className="step">
              <span>01</span>
              <h3>Choose</h3>
              <p>Browse our products and select what you need.</p>
            </div>

            <div className="step">
              <span>02</span>
              <h3>Add to Cart</h3>
              <p>Choose your size and quantity, then add it to your cart.</p>
            </div>

            <div className="step">
              <span>03</span>
              <h3>Order</h3>
              <p>Enter your contact information and place your order.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-box">
          <div>
            <span className="eyebrow">BALTENA MARKET</span>
            <h2>Ready to shop?</h2>
            <p>Find the products you need and place your order today.</p>
          </div>

          <Link href="/products" className="button light">
            Browse Products
          </Link>
        </div>
      </section>

      <footer className="bm-footer">

  <div className="bm-footer-container">

    <div className="bm-footer-grid">

      {/* BRAND */}

      <div className="bm-footer-brand">

        <a
          href="/"
          className="bm-footer-logo"
        >
          Baltena Market
        </a>

        <p className="bm-footer-description">
          Your trusted online marketplace for quality
          products in Ethiopia.
        </p>

        <div className="bm-footer-contact-title">
          Contact Us
        </div>

        <div className="bm-footer-social">

          <a
            href="https://wa.me/251925792929"
            target="_blank"
            rel="noopener noreferrer"
            className="bm-social-button bm-whatsapp"
          >

            <span className="bm-social-icon">

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.56 0 .26 5.3.26 11.82c0 2.08.54 4.11 1.57 5.9L.16 24l6.42-1.64a11.78 11.78 0 0 0 5.5 1.36h.01c6.52 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.39-8.42ZM12.09 21.7h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.81.97 1.02-3.71-.23-.38a9.83 9.83 0 1 1 8.41 4.7Zm5.4-7.37c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.65.08-1.76-.88-2.92-1.57-4.08-3.55-.31-.54.31-.5.89-1.66.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.07-.13-.27-.2-.57-.35Z" />
              </svg>

            </span>

            <span className="bm-social-text">
              <strong>WhatsApp</strong>
              <small>+251 925 792 929</small>
            </span>

          </a>


          <a
            href="https://t.me/Summer1444"
            target="_blank"
            rel="noopener noreferrer"
            className="bm-social-button bm-telegram"
          >

            <span className="bm-social-icon">

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M21.94 3.03 18.5 20.1c-.26 1.2-.98 1.5-1.98.94l-5.48-4.04-2.65 2.55c-.29.29-.53.53-1.09.53l.39-5.59L17.87 5.9c.47-.42-.1-.65-.73-.23L4.1 13.95l-5.3-1.66c-1.15-.36-1.17-1.15.24-1.68L20.02 2.8c.97-.36 1.82.24 1.92.23Z" />
              </svg>

            </span>

            <span className="bm-social-text">
              <strong>Telegram</strong>
              <small>@Summer1444</small>
            </span>

          </a>

        </div>

      </div>


      {/* QUICK LINKS */}

      <div className="bm-footer-column">

        <h3>Quick Links</h3>

        <a href="/">Home</a>

        <a href="/products">Products</a>

        <a href="/categories">Categories</a>

        <a href="/cart">Cart</a>

      </div>


      {/* SHOP */}

      <div className="bm-footer-column">

        <h3>Shop</h3>

        <a href="/products">All Products</a>

        <a href="/categories">Browse Categories</a>

        <a href="/cart">Shopping Cart</a>

      </div>


      {/* CONTACT */}

      <div className="bm-footer-column">

        <h3>Contact Us</h3>

        <p>
          Have a question or need help?
        </p>

        <a
          href="https://wa.me/251925792929"
          target="_blank"
          rel="noopener noreferrer"
          className="bm-footer-contact-link"
        >
          <strong>WhatsApp</strong>
          <span>+251 925 792 929</span>
        </a>

        <a
          href="https://t.me/Summer1444"
          target="_blank"
          rel="noopener noreferrer"
          className="bm-footer-contact-link"
        >
          <strong>Telegram</strong>
          <span>@Summer1444</span>
        </a>

      </div>

    </div>


    <div className="bm-footer-bottom">

      <span>
        © {new Date().getFullYear()} Baltena Market
      </span>

      <span>
        All rights reserved.
      </span>

    </div>

  </div>

</footer>
    </>
  )
}