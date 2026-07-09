import ProductCard from './ProductCard.jsx'
import SiteChrome from './SiteChrome.jsx'

function ShopPage({ currentUser, data, flashMessage, onLogout }) {
  const allProducts = data.shop.products
  const categories = [...new Set(allProducts.map((product) => product.category))]

  return (
    <SiteChrome
      currentPage="shop"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
      <section className="shop-page">
        <div className="shop-hero-banner surface-card">
          <div className="shop-hero-banner__copy">
            <span>{data.shop.banner.eyebrow}</span>
            <h1>{data.shop.banner.title}</h1>
            <p>{data.shop.banner.description}</p>
            <a className="shop-hero-banner__button" href="#/shop">
              {data.shop.banner.ctaLabel}
            </a>
          </div>
          <img
            className="shop-hero-banner__image"
            src={data.shop.banner.image}
            alt={data.shop.banner.title}
          />
        </div>

        <div className="shop-breadcrumbs">
          <a href="#/">Home Page</a>
          <span>/</span>
          <strong>Shop</strong>
        </div>

        <div className="shop-heading-row">
          <h2 className="shop-title">shop</h2>
          <p>All herbal medicines in one place, linked from the homepage cards and shop menu.</p>
        </div>

        <div className="shop-layout">
          <aside className="shop-sidebar surface-card">
            <section className="filter-panel">
              <h3>categories</h3>
              <div className="filter-list">
                {categories.map((category) => (
                  <label className="filter-option" key={category}>
                    <input type="radio" name="category" readOnly />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="filter-panel">
              <h3>product status</h3>
              <div className="filter-list">
                <label className="filter-option">
                  <input type="checkbox" readOnly />
                  <span>In Stock</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" readOnly />
                  <span>On Sale</span>
                </label>
              </div>
            </section>

            <section className="filter-panel">
              <h3>why choose us</h3>
              <ul className="sidebar-points">
                <li>100% herbal and vegetarian formulations</li>
                <li>Digestive, immunity and wellness focused range</li>
                <li>Same ST Herbal Care branding across home and shop pages</li>
              </ul>
            </section>
          </aside>

          <section className="shop-results surface-card">
            <div className="results-bar">
              <div className="results-bar__meta">
                <strong>Showing 1-{allProducts.length}</strong>
                <span>of {allProducts.length} herbal medicines</span>
              </div>
              <div className="results-bar__chips">
                <span className="results-chip">Default sorting</span>
                <span className="results-chip">Show {allProducts.length}</span>
              </div>
            </div>

            <div className="shop-grid">
              {allProducts.map((product) => (
                <ProductCard detailed key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </SiteChrome>
  )
}

export default ShopPage
