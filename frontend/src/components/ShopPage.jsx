import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDownIcon,
  CloseIcon,
  GridIcon,
  HeartIcon,
  ListIcon,
  MinusIcon,
  PlusIcon,
} from './Illustrations.jsx'
import ProductCard from './ProductCard.jsx'
import SiteChrome from './SiteChrome.jsx'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const wishlistStorageKey = 'st-herbal-wishlist'
const wishlistUpdatedEventName = 'st-herbal-wishlist-updated'
const cartStorageKey = 'st-herbal-cart'
const cartUpdatedEventName = 'st-herbal-cart-updated'

const sortOptions = [
  { value: 'default', label: 'Default sorting' },
  { value: 'popularity', label: 'Sort by popularity' },
  { value: 'rating', label: 'Sort by average rating' },
  { value: 'latest', label: 'Sort by latest' },
  { value: 'price-low', label: 'Sort by price: low to high' },
  { value: 'price-high', label: 'Sort by price: high to low' },
]

const showOptions = [12, 16, 20, 24]

function readStoredJson(key, fallbackValue) {
  try {
    const rawValue = window.localStorage.getItem(key)
    const parsedValue = JSON.parse(rawValue ?? 'null')
    return parsedValue ?? fallbackValue
  } catch {
    return fallbackValue
  }
}

function createCartEntry(product, quantity = 1, autoSaved = false) {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    originalPrice: product.originalPrice,
    summary: product.summary,
    category: product.category,
    quantity,
    autoSaved,
  }
}

function persistWishlist(nextWishlistIds) {
  window.localStorage.setItem(wishlistStorageKey, JSON.stringify(nextWishlistIds))
  window.dispatchEvent(new CustomEvent(wishlistUpdatedEventName, { detail: nextWishlistIds }))
}

function persistCart(nextCartItems) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(nextCartItems))
  window.dispatchEvent(new CustomEvent(cartUpdatedEventName, { detail: nextCartItems }))
}

function ToolbarDropdown({ isOpen, label, onSelect, onToggle, options }) {
  return (
    <div className={`results-dropdown ${isOpen ? 'is-open' : ''}`}>
      <button
        aria-expanded={isOpen}
        className="results-dropdown__trigger"
        onClick={onToggle}
        type="button"
      >
        <span>{label}</span>
        <ChevronDownIcon />
      </button>

      {isOpen ? (
        <div className="results-dropdown__menu">
          {options.map((option) => (
            <button
              className="results-dropdown__option"
              key={option.value}
              onClick={() => onSelect(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function QuickViewModal({
  isWishlisted,
  onAddToCart,
  onBuyNow,
  onClose,
  onToggleWishlist,
  product,
}) {
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setQuantity(1)
  }, [product?.id])

  if (!product) {
    return null
  }

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-modal surface-card" onClick={(event) => event.stopPropagation()}>
        <button
          aria-label="Close quick view"
          className="quick-view-modal__close"
          onClick={onClose}
          type="button"
        >
          <CloseIcon />
        </button>

        <div className="quick-view-modal__media">
          <div className={`quick-view-modal__poster quick-view-modal__poster--${product.visualTheme ?? 'sage'}`}>
            <img src={product.image} alt={product.name} />
            <div className="quick-view-modal__poster-copy">
              <strong>{product.category}</strong>
              <ul>
                {product.benefits.slice(0, 4).map((benefit) => (
                  <li key={`${product.id}-${benefit}`}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="quick-view-modal__content">
          <h2>{product.name}</h2>

          <div className="product-card__rating-row product-card__rating-row--modal">
            <div className="rating rating--shop">
              {Array.from({ length: 5 }, (_, index) => (
                <span className={index < product.rating ? 'is-filled' : ''} key={`${product.id}-modal-star-${index}`}>
                  {'\u2605'}
                </span>
              ))}
            </div>
            <span>({product.reviewCount ?? 0} reviews)</span>
          </div>

          <div className="quick-view-modal__price-row">
            <strong>{currency.format(product.price)}</strong>
            <span>MRP (incl. of all taxes)</span>
          </div>

          <p className="quick-view-modal__description">{product.summary}</p>

          <div className="quick-view-modal__actions">
            <div className="product-card__quantity quick-view-modal__quantity">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((currentValue) => Math.max(1, currentValue - 1))}
                type="button"
              >
                <MinusIcon />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((currentValue) => currentValue + 1)}
                type="button"
              >
                <PlusIcon />
              </button>
            </div>

            <button className="product-card__cta quick-view-modal__cta" onClick={() => onAddToCart(product, quantity)} type="button">
              Add to cart
            </button>

            <button className="quick-view-modal__buy" onClick={() => onBuyNow(product, quantity)} type="button">
              Buy Now
            </button>

            <button
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
              className={`quick-view-modal__wishlist ${isWishlisted ? 'is-active' : ''}`}
              onClick={() => onToggleWishlist(product)}
              type="button"
            >
              <HeartIcon />
            </button>
          </div>

          <div className="quick-view-modal__meta">
            <p>
              <strong>Categories:</strong> {product.category}
            </p>
            <p>
              <strong>Tags:</strong> {product.tags.join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShopPage({ currentUser, data, flashMessage, onLogout }) {
  const allProducts = data.shop.products
  const toolbarRef = useRef(null)
  const categoryOptions = ['All Categories', ...new Set(allProducts.map((product) => product.category))]
  const minPrice = Math.min(...allProducts.map((product) => product.price))
  const maxPrice = Math.max(...allProducts.map((product) => product.price))
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [sortKey, setSortKey] = useState('default')
  const [viewMode, setViewMode] = useState('grid')
  const [itemsPerPage, setItemsPerPage] = useState(showOptions[0])
  const [openMenu, setOpenMenu] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [priceDraft, setPriceDraft] = useState(maxPrice)
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(maxPrice)
  const [statusFilters, setStatusFilters] = useState({
    inStock: false,
    onSale: false,
  })
  const [wishlistIds, setWishlistIds] = useState(() => readStoredJson(wishlistStorageKey, []))
  const [cartItems, setCartItems] = useState(() => readStoredJson(cartStorageKey, []))
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    function handlePointerDown(event) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlistIds))
  }, [wishlistIds])

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems))
    window.dispatchEvent(new CustomEvent(cartUpdatedEventName, { detail: cartItems }))
  }, [cartItems])

  useEffect(() => {
    function syncStorageState(nextWishlistIds, nextCartItems) {
      const resolvedWishlistIds = nextWishlistIds ?? readStoredJson(wishlistStorageKey, [])
      const resolvedCartItems = nextCartItems ?? readStoredJson(cartStorageKey, [])
      setWishlistIds(Array.isArray(resolvedWishlistIds) ? resolvedWishlistIds : [])
      setCartItems(Array.isArray(resolvedCartItems) ? resolvedCartItems : [])
    }

    function handleStorage(event) {
      if (event.key && ![wishlistStorageKey, cartStorageKey].includes(event.key)) {
        return
      }

      syncStorageState()
    }

    function handleWishlistUpdated(event) {
      syncStorageState(Array.isArray(event.detail) ? event.detail : undefined)
    }

    function handleCartUpdated(event) {
      syncStorageState(undefined, Array.isArray(event.detail) ? event.detail : undefined)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(wishlistUpdatedEventName, handleWishlistUpdated)
    window.addEventListener(cartUpdatedEventName, handleCartUpdated)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(wishlistUpdatedEventName, handleWishlistUpdated)
      window.removeEventListener(cartUpdatedEventName, handleCartUpdated)
    }
  }, [])

  useEffect(() => {
    if (!quickViewProduct) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [quickViewProduct])

  useEffect(() => {
    if (!actionMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setActionMessage('')
    }, 2600)

    return () => window.clearTimeout(timeoutId)
  }, [actionMessage])

  const filteredProducts = useMemo(() => {
    let nextProducts = [...allProducts]

    if (selectedCategory !== 'All Categories') {
      nextProducts = nextProducts.filter((product) => product.category === selectedCategory)
    }

    nextProducts = nextProducts.filter((product) => product.price <= appliedMaxPrice)

    if (statusFilters.inStock) {
      nextProducts = nextProducts.filter((product) => product.inStock)
    }

    if (statusFilters.onSale) {
      nextProducts = nextProducts.filter((product) => product.onSale)
    }

    switch (sortKey) {
      case 'popularity':
        nextProducts.sort((left, right) => (right.reviewCount ?? 0) - (left.reviewCount ?? 0))
        break
      case 'rating':
        nextProducts.sort((left, right) => right.rating - left.rating)
        break
      case 'latest':
        nextProducts.sort(
          (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        )
        break
      case 'price-low':
        nextProducts.sort((left, right) => left.price - right.price)
        break
      case 'price-high':
        nextProducts.sort((left, right) => right.price - left.price)
        break
      default:
        break
    }

    return nextProducts
  }, [allProducts, appliedMaxPrice, selectedCategory, sortKey, statusFilters.inStock, statusFilters.onSale])

  const totalResults = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const visibleProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, itemsPerPage, safeCurrentPage])

  const resultsStart = totalResults === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1
  const resultsEnd = totalResults === 0 ? 0 : resultsStart + visibleProducts.length - 1
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortKey)?.label ?? 'Default sorting'

  function handleCategoryChange(category) {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  function handleStatusChange(key) {
    setStatusFilters((currentValue) => ({
      ...currentValue,
      [key]: !currentValue[key],
    }))
    setCurrentPage(1)
  }

  function applyPriceFilter() {
    setAppliedMaxPrice(priceDraft)
    setCurrentPage(1)
  }

  function handleSortSelect(nextSortKey) {
    setSortKey(nextSortKey)
    setCurrentPage(1)
    setOpenMenu(null)
  }

  function handleShowSelect(nextItemsPerPage) {
    setItemsPerPage(Number(nextItemsPerPage))
    setCurrentPage(1)
    setOpenMenu(null)
  }

  function handleToggleWishlist(product) {
    const isStored = wishlistIds.includes(product.id)
    const nextWishlistIds = isStored
      ? wishlistIds.filter((productId) => productId !== product.id)
      : [...wishlistIds, product.id]

    setWishlistIds(nextWishlistIds)
    persistWishlist(nextWishlistIds)

    setActionMessage(
      isStored
        ? `${product.name} removed from wishlist.`
        : `${product.name} saved to wishlist.`,
    )
  }

  function handleAddToCart(product, quantity) {
    const nextCartItems = (() => {
      const existingItem = cartItems.find((item) => item.id === product.id)

      if (existingItem) {
        return cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, autoSaved: false }
            : item,
        )
      }

      return [...cartItems, createCartEntry(product, quantity, false)]
    })()

    setCartItems(nextCartItems)
    persistCart(nextCartItems)

    setActionMessage(`${product.name} added to cart.`)
  }

  function handleBuyNow(product, quantity) {
    handleAddToCart(product, quantity)
    setActionMessage(`${product.name} is ready for checkout.`)
  }

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
          <img
            className="shop-hero-banner__image shop-hero-banner__image--full"
            src={data.shop.banner.image}
            alt={data.shop.banner.title}
          />
          <a className="shop-hero-banner__button shop-hero-banner__button--floating" href="#shop-products">
            {data.shop.banner.ctaLabel}
          </a>
        </div>

        <div className="shop-breadcrumbs">
          <a href="#/">Home Page</a>
          <span>/</span>
          <strong>Shop</strong>
        </div>

        <div className="shop-heading-row">
          <h2 className="shop-title">shop</h2>
          <p>Browse the full herbal range with working categories, price filter, sorting, show controls and quick view.</p>
        </div>

        {actionMessage ? <div className="shop-action-message">{actionMessage}</div> : null}

        <div className="shop-layout">
          <aside className="shop-sidebar surface-card">
            <section className="filter-panel">
              <h3>categories</h3>
              <div className="filter-list">
                {categoryOptions.map((category) => (
                  <label className="filter-option" key={category}>
                    <input
                      checked={selectedCategory === category}
                      name="category"
                      onChange={() => handleCategoryChange(category)}
                      type="radio"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="filter-panel">
              <h3>filter by price</h3>
              <div className="price-filter">
                <input
                  className="price-filter__slider"
                  max={maxPrice}
                  min={minPrice}
                  onChange={(event) => {
                    const nextPrice = Number(event.target.value)
                    setPriceDraft(nextPrice)
                    setAppliedMaxPrice(nextPrice)
                    setCurrentPage(1)
                  }}
                  step={10}
                  type="range"
                  value={priceDraft}
                />
                <div className="price-filter__meta">
                  <span className="price-filter__meta-value">{`Price: Rs ${minPrice} - Rs ${priceDraft}`}</span>
                  <span>
                    Price: ₹{minPrice} - ₹{priceDraft}
                  </span>
                  <button onClick={applyPriceFilter} type="button">
                    Filter
                  </button>
                </div>
              </div>
            </section>

            <section className="filter-panel">
              <h3>product status</h3>
              <div className="filter-list">
                <label className="filter-option">
                  <input
                    checked={statusFilters.inStock}
                    onChange={() => handleStatusChange('inStock')}
                    type="checkbox"
                  />
                  <span>In Stock</span>
                </label>
                <label className="filter-option">
                  <input
                    checked={statusFilters.onSale}
                    onChange={() => handleStatusChange('onSale')}
                    type="checkbox"
                  />
                  <span>On Sale</span>
                </label>
              </div>
            </section>

            <section className="filter-panel">
              <h3>why choose us</h3>
              <ul className="sidebar-points">
                <li>100% herbal and vegetarian formulations</li>
                <li>Digestive, immunity and wellness focused range</li>
                <li>Same ST Herbal India branding across home and shop pages</li>
              </ul>
            </section>
          </aside>

          <section className="shop-results surface-card" id="shop-products">
            <div className="results-bar" ref={toolbarRef}>
              <div className="results-bar__meta">
                <div className="results-bar__view-toggle">
                  <button
                    aria-label="Grid view"
                    className={`results-bar__view-button ${viewMode === 'grid' ? 'is-active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    type="button"
                  >
                    <GridIcon />
                  </button>
                  <button
                    aria-label="List view"
                    className={`results-bar__view-button ${viewMode === 'list' ? 'is-active' : ''}`}
                    onClick={() => setViewMode('list')}
                    type="button"
                  >
                    <ListIcon />
                  </button>
                </div>
                <strong>
                  Showing {resultsStart}-{resultsEnd}
                </strong>
                <span>of {totalResults} results</span>
              </div>

              <div className="results-bar__chips">
                <ToolbarDropdown
                  isOpen={openMenu === 'sort'}
                  label={selectedSortLabel}
                  onSelect={handleSortSelect}
                  onToggle={() => setOpenMenu((currentValue) => (currentValue === 'sort' ? null : 'sort'))}
                  options={sortOptions}
                />

                <ToolbarDropdown
                  isOpen={openMenu === 'show'}
                  label={`Show ${itemsPerPage}`}
                  onSelect={handleShowSelect}
                  onToggle={() => setOpenMenu((currentValue) => (currentValue === 'show' ? null : 'show'))}
                  options={showOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                />
              </div>
            </div>

            {visibleProducts.length > 0 ? (
              <>
                <div className={`shop-grid ${viewMode === 'list' ? 'shop-grid--list' : ''}`}>
                  {visibleProducts.map((product) => (
                    <ProductCard
                      detailed
                      isWishlisted={wishlistIds.includes(product.id)}
                      key={product.id}
                      onAddToCart={handleAddToCart}
                      onQuickView={setQuickViewProduct}
                      onToggleWishlist={handleToggleWishlist}
                      product={product}
                      viewMode={viewMode}
                      visualTheme={product.visualTheme}
                    />
                  ))}
                </div>

                <div className="shop-pagination">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1

                    return (
                      <button
                        className={`shop-pagination__button ${safeCurrentPage === pageNumber ? 'is-active' : ''}`}
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        type="button"
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="shop-results__empty">
                <h3>No products matched these filters.</h3>
                <p>Try another category, a higher price range, or reset the sale filter.</p>
              </div>
            )}
          </section>
        </div>
      </section>

      <QuickViewModal
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onClose={() => setQuickViewProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        product={quickViewProduct}
      />
    </SiteChrome>
  )
}

export default ShopPage
