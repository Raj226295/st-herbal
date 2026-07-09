import { ProductVisual } from './Illustrations.jsx'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function ProductCard({ product, detailed = false }) {
  return (
    <article className={`product-card ${detailed ? 'product-card--detailed' : ''}`}>
      {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}

      <div className="product-card__visual">
        {product.image ? (
          <img className="product-card__image" src={product.image} alt={product.name} />
        ) : (
          <ProductVisual kind={product.kind} />
        )}
      </div>

      <div className="product-card__body">
        <h3>{product.name}</h3>

        {detailed ? <p className="product-card__description">{product.summary}</p> : null}

        <div className="rating">{'\u2605'.repeat(product.rating)}</div>

        <div className="price-row">
          <strong>{currency.format(product.price)}</strong>
          <span>MRP (incl. of all taxes)</span>
        </div>

        <div className="original-price">{currency.format(product.originalPrice)}</div>

        {detailed ? (
          <ul className="benefit-list">
            {product.benefits.slice(0, 3).map((benefit) => (
              <li key={`${product.id}-${benefit}`}>{benefit}</li>
            ))}
          </ul>
        ) : null}

        <div className="tag-row">
          {product.tags.map((tag) => (
            <span className="mini-tag" key={`${product.id}-${tag}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
