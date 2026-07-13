import { useEffect, useMemo, useState } from 'react'
import SiteChrome from './SiteChrome.jsx'

const wishlistStorageKey = 'st-herbal-wishlist'
const wishlistUpdatedEventName = 'st-herbal-wishlist-updated'
const cartStorageKey = 'st-herbal-cart'
const cartUpdatedEventName = 'st-herbal-cart-updated'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function readStoredJson(key, fallbackValue) {
  try {
    const rawValue = window.localStorage.getItem(key)
    const parsedValue = JSON.parse(rawValue ?? 'null')
    return parsedValue ?? fallbackValue
  } catch {
    return fallbackValue
  }
}

function normalizeWishlistIds(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return [
    ...new Set(
      value
        .map((entry) => (typeof entry === 'string' ? entry : entry?.id))
        .filter(Boolean),
    ),
  ]
}

function createCartEntry(product, quantity = 1) {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    originalPrice: product.originalPrice,
    summary: product.summary,
    category: product.category,
    quantity,
    autoSaved: false,
  }
}

function WishlistPage({ currentUser, data, flashMessage, onLogout }) {
  const [wishlistIds, setWishlistIds] = useState(() =>
    normalizeWishlistIds(readStoredJson(wishlistStorageKey, [])),
  )
  const [cartItems, setCartItems] = useState(() => readStoredJson(cartStorageKey, []))
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    window.localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlistIds))
    window.dispatchEvent(new CustomEvent(wishlistUpdatedEventName, { detail: wishlistIds }))
  }, [wishlistIds])

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems))
    window.dispatchEvent(new CustomEvent(cartUpdatedEventName, { detail: cartItems }))
  }, [cartItems])

  useEffect(() => {
    if (!actionMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setActionMessage('')
    }, 2600)

    return () => window.clearTimeout(timeoutId)
  }, [actionMessage])

  const productMap = useMemo(
    () => new Map((data.shop.products ?? []).map((product) => [product.id, product])),
    [data.shop.products],
  )

  useEffect(() => {
    const validIds = wishlistIds.filter((productId) => productMap.has(productId))

    if (validIds.length !== wishlistIds.length) {
      setWishlistIds(validIds)
    }
  }, [productMap, wishlistIds])

  useEffect(() => {
    function syncState(nextWishlistIds, nextCartItems) {
      const resolvedWishlistIds =
        nextWishlistIds ?? normalizeWishlistIds(readStoredJson(wishlistStorageKey, []))
      const resolvedCartItems = nextCartItems ?? readStoredJson(cartStorageKey, [])

      setWishlistIds(resolvedWishlistIds)
      setCartItems(resolvedCartItems)
    }

    function handleStorage(event) {
      if (event.key && ![wishlistStorageKey, cartStorageKey].includes(event.key)) {
        return
      }

      syncState()
    }

    function handleWishlistUpdated(event) {
      syncState(normalizeWishlistIds(event.detail))
    }

    function handleCartUpdated(event) {
      syncState(undefined, event.detail)
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

  const resolvedItems = useMemo(
    () =>
      wishlistIds
        .map((productId) => productMap.get(productId))
        .filter(Boolean),
    [productMap, wishlistIds],
  )

  const wishlistValue = resolvedItems.reduce((total, item) => total + (item.price ?? 0), 0)
  const estimatedSavings = resolvedItems.reduce(
    (total, item) =>
      total + Math.max((item.originalPrice ?? item.price ?? 0) - (item.price ?? 0), 0),
    0,
  )

  function removeItem(productId) {
    const productName = productMap.get(productId)?.name ?? 'Product'

    setWishlistIds((currentValue) => currentValue.filter((itemId) => itemId !== productId))
    setActionMessage(`${productName} wishlist se remove ho gaya.`)
  }

  function clearWishlist() {
    setWishlistIds([])
    setActionMessage('Wishlist clear ho gayi.')
  }

  function addToCart(product) {
    setCartItems((currentValue) => {
      const matchingItem = currentValue.find((item) => item.id === product.id)

      if (matchingItem) {
        return currentValue.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.max(1, Number(item.quantity) || 1) + 1,
                autoSaved: false,
              }
            : item,
        )
      }

      return [createCartEntry(product), ...currentValue]
    })

    setActionMessage(`${product.name} cart me add ho gaya.`)
  }

  function addAllToCart() {
    if (resolvedItems.length === 0) {
      return
    }

    setCartItems((currentValue) => {
      const nextItems = [...currentValue]

      resolvedItems.forEach((product) => {
        const existingIndex = nextItems.findIndex((item) => item.id === product.id)

        if (existingIndex >= 0) {
          nextItems[existingIndex] = {
            ...nextItems[existingIndex],
            quantity: Math.max(1, Number(nextItems[existingIndex].quantity) || 1) + 1,
            autoSaved: false,
          }
          return
        }

        nextItems.unshift(createCartEntry(product))
      })

      return nextItems
    })

    setActionMessage('Wishlist ke products cart me add ho gaye.')
  }

  return (
    <SiteChrome
      currentPage="wishlist"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
      <section className="wishlist-page">
        <div className="shop-breadcrumbs">
          <a href="#/">Home Page</a>
          <span>/</span>
          <a href="#/shop">Shop</a>
          <span>/</span>
          <strong>Wishlist</strong>
        </div>

        <div className="wishlist-page__header">
          <div>
            <h2 className="shop-title">wishlist</h2>
            <p>
              Heart icon se like kiye hue herbal products yahan save honge. Cart aur wishlist
              dono alag-alag rahenge.
            </p>
          </div>

          <div className="wishlist-page__header-actions">
            <a className="link-button" href="#/shop">
              Continue shopping
            </a>
            {resolvedItems.length > 0 ? (
              <button className="hero-card__button" onClick={addAllToCart} type="button">
                Add all to cart
              </button>
            ) : null}
          </div>
        </div>

        {actionMessage ? <div className="shop-action-message">{actionMessage}</div> : null}

        {resolvedItems.length === 0 ? (
          <div className="wishlist-empty surface-card">
            <h3>Your wishlist is empty</h3>
            <p>Shop page par heart button dabane ke baad medicines yahan show hongi.</p>
            <a className="section-link" href="#/shop">
              Browse products
            </a>
          </div>
        ) : (
          <div className="wishlist-layout">
            <div className="wishlist-table surface-card">
              {resolvedItems.map((item) => {
                const showDiscount =
                  Number(item.originalPrice) > 0 &&
                  Number(item.originalPrice) > Number(item.price)

                return (
                  <article className="wishlist-row" key={item.id}>
                    <button
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="wishlist-row__remove"
                      onClick={() => removeItem(item.id)}
                      type="button"
                    >
                      x
                    </button>

                    <div className="wishlist-row__media">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="wishlist-row__content">
                      <span className="wishlist-row__category">
                        {item.category ?? 'Herbal Care'}
                      </span>
                      <h3>{item.name}</h3>
                      <p>{item.summary ?? 'Premium herbal support for your wellness routine.'}</p>
                      <div className="wishlist-row__price">
                        <strong>{currency.format(item.price ?? 0)}</strong>
                        {showDiscount ? <span>{currency.format(item.originalPrice)}</span> : null}
                      </div>
                    </div>

                    <div className="wishlist-row__actions">
                      <button
                        className="wishlist-row__cart-button"
                        onClick={() => addToCart(item)}
                        type="button"
                      >
                        Add to cart
                      </button>
                      <button
                        className="wishlist-row__secondary"
                        onClick={() => removeItem(item.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className="wishlist-summary surface-card">
              <h3>Wishlist summary</h3>
              <div className="wishlist-summary__row">
                <span>Saved products</span>
                <strong>{resolvedItems.length}</strong>
              </div>
              <div className="wishlist-summary__row">
                <span>Wishlist value</span>
                <strong>{currency.format(wishlistValue)}</strong>
              </div>
              <div className="wishlist-summary__row">
                <span>You save</span>
                <strong>{currency.format(estimatedSavings)}</strong>
              </div>
              <div className="wishlist-summary__row">
                <span>Cart items</span>
                <strong>{cartItems.length}</strong>
              </div>
              <button className="hero-card__button" onClick={clearWishlist} type="button">
                Clear wishlist
              </button>
            </aside>
          </div>
        )}
      </section>
    </SiteChrome>
  )
}

export default WishlistPage
