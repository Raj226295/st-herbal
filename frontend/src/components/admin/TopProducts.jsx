function TopProducts({ products }) {
  return (
    <div className="admin-panel-card">
      <div className="admin-section-heading">
        <div>
          <h3>Top Selling Products</h3>
          <p>Best performing herbal and Ayurvedic products this period.</p>
        </div>
      </div>

      <div className="admin-top-products">
        {products.map((product) => (
          <article className="admin-top-product" key={product.id}>
            <div className="admin-top-product__media">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="admin-top-product__content">
              <strong>{product.name}</strong>
              <span>{product.soldQuantity}</span>
            </div>

            <div className="admin-top-product__meta">
              <strong>{product.revenue}</strong>
              <span className={`admin-stock-pill admin-stock-pill--${product.stockStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                {product.stockStatus}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default TopProducts
