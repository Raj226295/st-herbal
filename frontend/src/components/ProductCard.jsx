import { useState } from 'react'
import {
  ExpandIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ProductVisual,
} from './Illustrations.jsx'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function ProductCard({
  isWishlisted = false,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  product,
  detailed = false,
  viewMode = 'grid',
  visualTheme = 'sage',
}) {
  const [quantity, setQuantity] = useState(1)

  function increaseQuantity() {
    setQuantity((currentValue) => currentValue + 1)
  }

  function decreaseQuantity() {
    setQuantity((currentValue) => Math.max(1, currentValue - 1))
  }

  return (
    <article
      className={`product-card ${detailed ? 'product-card--detailed product-card--shop product-card--shop-tone-' + visualTheme : ''} ${detailed && viewMode === 'list' ? 'product-card--list' : ''}`}
    >
      {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}

      <div className="product-card__visual">
        {detailed ? (
          <div className="product-card__quick-actions">
            <button
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
              className={`product-card__quick-button ${isWishlisted ? 'is-active' : ''}`}
              onClick={() => onToggleWishlist?.(product)}
              type="button"
            >
              <HeartIcon />
            </button>
            <button
              aria-label="Quick view"
              className="product-card__quick-button"
              onClick={() => onQuickView?.(product)}
              title="Quick view"
              type="button"
            >
              <ExpandIcon />
            </button>
          </div>
        ) : null}

        {product.image ? (
          <img className="product-card__image" src={product.image} alt={product.name} />
        ) : (
          <ProductVisual kind={product.kind} />
        )}
      </div>

      <div className="product-card__body">
        <h3>{product.name}</h3>

        {detailed ? <p className="product-card__description">{product.summary}</p> : null}

        {detailed ? (
          <div className="product-card__rating-row">
            <div className="rating rating--shop">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  className={index < product.rating ? 'is-filled' : ''}
                  key={`${product.id}-star-${index}`}
                >
                  {'\u2605'}
                </span>
              ))}
            </div>
            <span>({product.reviewCount ?? 0})</span>
          </div>
        ) : (
          <div className="rating">{'\u2605'.repeat(product.rating)}</div>
        )}

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

        {detailed ? (
          <div className="product-card__hover-panel">
            <div className="product-card__quantity">
              <button aria-label="Decrease quantity" onClick={decreaseQuantity} type="button">
                <MinusIcon />
              </button>
              <span>{quantity}</span>
              <button aria-label="Increase quantity" onClick={increaseQuantity} type="button">
                <PlusIcon />
              </button>
            </div>
            <button className="product-card__cta" onClick={() => onAddToCart?.(product, quantity)} type="button">
              Add to cart
            </button>
          </div>
        ) : null}
      </div>

      {detailed && viewMode === 'list' ? (
        <aside className="product-card__list-side">
          <div className="price-row">
            <strong>{currency.format(product.price)}</strong>
            <span>MRP (incl. of all taxes)</span>
          </div>

          <div className="original-price">{currency.format(product.originalPrice)}</div>

          <div className="product-card__hover-panel product-card__hover-panel--static">
            <div className="product-card__quantity">
              <button aria-label="Decrease quantity" onClick={decreaseQuantity} type="button">
                <MinusIcon />
              </button>
              <span>{quantity}</span>
              <button aria-label="Increase quantity" onClick={increaseQuantity} type="button">
                <PlusIcon />
              </button>
            </div>
            <button className="product-card__cta" onClick={() => onAddToCart?.(product, quantity)} type="button">
              Add to cart
            </button>
          </div>

          <div className="product-card__list-actions">
            <button
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
              className={`product-card__list-action ${isWishlisted ? 'is-active' : ''}`}
              onClick={() => onToggleWishlist?.(product)}
              type="button"
            >
              <HeartIcon />
            </button>
            <button
              aria-label="Quick view"
              className="product-card__list-action"
              onClick={() => onQuickView?.(product)}
              type="button"
            >
              <ExpandIcon />
            </button>
          </div>
        </aside>
      ) : null}
    </article>
  )
}

export default ProductCard
