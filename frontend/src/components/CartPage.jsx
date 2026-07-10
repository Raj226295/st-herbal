import { useEffect, useMemo, useState } from 'react'
import { MinusIcon, PlusIcon } from './Illustrations.jsx'
import SiteChrome from './SiteChrome.jsx'

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

function CartPage({ currentUser, data, flashMessage, onLogout }) {
  const [cartItems, setCartItems] = useState(() => readStoredJson(cartStorageKey, []))
  const [actionMessage, setActionMessage] = useState('')

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
    }, 2400)

    return () => window.clearTimeout(timeoutId)
  }, [actionMessage])

  const productMap = useMemo(
    () => new Map((data.shop.products ?? []).map((product) => [product.id, product])),
    [data.shop.products],
  )

  const resolvedItems = useMemo(
    () =>
      cartItems
        .map((item) => {
          const matchingProduct = productMap.get(item.id)

          if (!matchingProduct && !item.name) {
            return null
          }

          return {
            id: item.id,
            name: item.name ?? matchingProduct?.name ?? 'Herbal Product',
            image: item.image ?? matchingProduct?.image ?? '',
            price: item.price ?? matchingProduct?.price ?? 0,
            originalPrice:
              item.originalPrice ?? matchingProduct?.originalPrice ?? item.price ?? 0,
            summary:
              item.summary ??
              matchingProduct?.summary ??
              'Premium herbal wellness support for your daily care routine.',
            category: item.category ?? matchingProduct?.category ?? 'Herbal Care',
            quantity: Math.max(1, Number(item.quantity) || 1),
          }
        })
        .filter(Boolean),
    [cartItems, productMap],
  )

  const subtotal = resolvedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  function updateQuantity(productId, delta) {
    setCartItems((currentValue) =>
      currentValue.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(1, (Number(item.quantity) || 1) + delta),
              autoSaved: false,
            }
          : item,
      ),
    )
  }

  function removeItem(productId) {
    const productName = resolvedItems.find((item) => item.id === productId)?.name ?? 'Product'

    setCartItems((currentValue) => currentValue.filter((item) => item.id !== productId))
    setActionMessage(`${productName} removed from cart.`)
  }

  function clearCart() {
    setCartItems([])
    setActionMessage('Cart cleared successfully.')
  }

  return (
    <SiteChrome
      currentPage="cart"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
      <section className="cart-page">
        <div className="shop-breadcrumbs">
          <a href="#/">Home Page</a>
          <span>/</span>
          <a href="#/shop">Shop</a>
          <span>/</span>
          <strong>Cart</strong>
        </div>

        <div className="cart-page__header">
          <div>
            <h2 className="shop-title">cart</h2>
            <p>
              Liked products aur added products dono yahan show honge.
            </p>
          </div>
          <a className="link-button" href="#/shop">
            Continue shopping
          </a>
        </div>

        {actionMessage ? <div className="shop-action-message">{actionMessage}</div> : null}

        {resolvedItems.length === 0 ? (
          <div className="cart-empty surface-card">
            <h3>Your cart is empty</h3>
            <p>Shop page se product like ya add to cart karte hi yahan show ho jayega.</p>
            <a className="section-link" href="#/shop">
              Go to shop
            </a>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {resolvedItems.map((item) => (
                <article className="cart-item surface-card" key={item.id}>
                  <div className="cart-item__media">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item__content">
                    <span className="cart-item__category">{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>{item.summary}</p>

                    <div className="cart-item__quantity">
                      <button
                        aria-label={`Decrease quantity for ${item.name}`}
                        onClick={() => updateQuantity(item.id, -1)}
                        type="button"
                      >
                        <MinusIcon />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label={`Increase quantity for ${item.name}`}
                        onClick={() => updateQuantity(item.id, 1)}
                        type="button"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item__aside">
                    <strong>{currency.format(item.price * item.quantity)}</strong>
                    <span>{currency.format(item.price)} each</span>
                    <button className="cart-item__remove" onClick={() => removeItem(item.id)} type="button">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary surface-card">
              <h3>Cart summary</h3>
              <div className="cart-summary__row">
                <span>Products</span>
                <strong>{resolvedItems.length}</strong>
              </div>
              <div className="cart-summary__row">
                <span>Total quantity</span>
                <strong>
                  {resolvedItems.reduce((total, item) => total + item.quantity, 0)}
                </strong>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <span>Subtotal</span>
                <strong>{currency.format(subtotal)}</strong>
              </div>
              <button className="hero-card__button" onClick={clearCart} type="button">
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </section>
    </SiteChrome>
  )
}

export default CartPage
