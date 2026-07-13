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

const fallbackCoupons = [
  {
    code: 'HERBAL10',
    discount: '10%',
    description: 'First order welcome offer',
    status: 'Active',
  },
  {
    code: 'IMMUNITY15',
    discount: '15%',
    description: 'Immunity range campaign',
    status: 'Active',
  },
  {
    code: 'MONSOON20',
    discount: '20%',
    description: 'Monsoon health bundle',
    status: 'Expired',
  },
]

function readStoredJson(key, fallbackValue) {
  try {
    const rawValue = window.localStorage.getItem(key)
    const parsedValue = JSON.parse(rawValue ?? 'null')
    return parsedValue ?? fallbackValue
  } catch {
    return fallbackValue
  }
}

function createQuantityDrafts(items) {
  if (!Array.isArray(items)) {
    return {}
  }

  return items.reduce((accumulator, item) => {
    accumulator[item.id] = Math.max(1, Number(item.quantity) || 1)
    return accumulator
  }, {})
}

function resolveCouponMap(couponEntries) {
  const source = Array.isArray(couponEntries) ? couponEntries : fallbackCoupons

  return Object.fromEntries(
    source
      .map((coupon) => {
        const code = String(coupon?.code || '').trim().toUpperCase()
        const value = Number.parseFloat(String(coupon?.discount ?? coupon?.value ?? '0'))

        if (!code) {
          return null
        }

        return [
          code,
          {
            code,
            value: Number.isFinite(value) ? value : 0,
            type: 'percent',
            description: coupon?.description || 'Storefront coupon',
            status: String(coupon?.status || 'Active').trim().toLowerCase(),
          },
        ]
      })
      .filter(Boolean),
  )
}

function CartPage({ currentUser, data, flashMessage, onLogout }) {
  const [cartItems, setCartItems] = useState(() => readStoredJson(cartStorageKey, []))
  const [quantityDrafts, setQuantityDrafts] = useState(() =>
    createQuantityDrafts(readStoredJson(cartStorageKey, [])),
  )
  const [couponCode, setCouponCode] = useState('')
  const [appliedCouponCode, setAppliedCouponCode] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems))
    window.dispatchEvent(new CustomEvent(cartUpdatedEventName, { detail: cartItems }))
  }, [cartItems])

  useEffect(() => {
    setQuantityDrafts(createQuantityDrafts(cartItems))
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
  const availableCoupons = useMemo(() => resolveCouponMap(data?.coupons), [data?.coupons])

  useEffect(() => {
    function syncCart(nextItems) {
      setCartItems(nextItems ?? readStoredJson(cartStorageKey, []))
    }

    function handleStorage(event) {
      if (event.key && event.key !== cartStorageKey) {
        return
      }

      syncCart()
    }

    function handleCartUpdated(event) {
      syncCart(event.detail)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(cartUpdatedEventName, handleCartUpdated)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(cartUpdatedEventName, handleCartUpdated)
    }
  }, [])

  const resolvedItems = useMemo(
    () =>
      cartItems
        .map((item) => {
          const matchingProduct = productMap.get(item.id)

          if (!matchingProduct && !item.name) {
            return null
          }

          const storedQuantity = Math.max(1, Number(item.quantity) || 1)
          const quantity = Math.max(1, Number(quantityDrafts[item.id] ?? storedQuantity) || 1)
          const originalPrice =
            item.originalPrice ?? matchingProduct?.originalPrice ?? item.price ?? 0
          const price = item.price ?? matchingProduct?.price ?? 0

          return {
            id: item.id,
            name: item.name ?? matchingProduct?.name ?? 'Herbal Product',
            image: item.image ?? matchingProduct?.image ?? '',
            price,
            originalPrice,
            summary:
              item.summary ??
              matchingProduct?.summary ??
              'Premium herbal wellness support for your daily care routine.',
            category: item.category ?? matchingProduct?.category ?? 'Herbal Care',
            storedQuantity,
            quantity,
          }
        })
        .filter(Boolean),
    [cartItems, productMap, quantityDrafts],
  )

  useEffect(() => {
    if (resolvedItems.length === 0 && appliedCouponCode) {
      setAppliedCouponCode('')
    }
  }, [appliedCouponCode, resolvedItems.length])

  const subtotal = resolvedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const totalQuantity = resolvedItems.reduce((total, item) => total + item.quantity, 0)
  const hasPendingChanges = resolvedItems.some((item) => item.quantity !== item.storedQuantity)
  const appliedCoupon = appliedCouponCode ? availableCoupons[appliedCouponCode] : null
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0
  const total = Math.max(0, subtotal - discountAmount)
  const couponPreviewCodes = Object.keys(availableCoupons).slice(0, 2)

  function changeDraftQuantity(productId, delta) {
    setQuantityDrafts((currentValue) => {
      const currentQuantity = Math.max(1, Number(currentValue[productId]) || 1)

      return {
        ...currentValue,
        [productId]: Math.max(1, currentQuantity + delta),
      }
    })
  }

  function applyQuantityChanges(options = {}) {
    if (!hasPendingChanges) {
      if (!options.silent) {
        setActionMessage('Cart already up to date.')
      }
      return
    }

    setCartItems((currentValue) =>
      currentValue.map((item) => ({
        ...item,
        quantity: Math.max(1, Number(quantityDrafts[item.id] ?? item.quantity) || 1),
        autoSaved: false,
      })),
    )

    if (!options.silent) {
      setActionMessage('Cart updated successfully.')
    }
  }

  function removeItem(productId) {
    const productName = resolvedItems.find((item) => item.id === productId)?.name ?? 'Product'

    setCartItems((currentValue) => currentValue.filter((item) => item.id !== productId))
    setQuantityDrafts((currentValue) => {
      const nextValue = { ...currentValue }
      delete nextValue[productId]
      return nextValue
    })
    setActionMessage(`${productName} removed from cart.`)
  }

  function clearCart() {
    setCartItems([])
    setQuantityDrafts({})
    setAppliedCouponCode('')
    setCouponCode('')
    setActionMessage('Cart cleared successfully.')
  }

  function handleApplyCoupon(event) {
    event.preventDefault()

    const normalizedCode = couponCode.trim().toUpperCase()

    if (!normalizedCode) {
      setActionMessage('Coupon code enter karo.')
      return
    }

    const matchedCoupon = availableCoupons[normalizedCode]

    if (!matchedCoupon) {
      setActionMessage('Invalid coupon code.')
      return
    }

    if (matchedCoupon.status !== 'active') {
      setActionMessage(`${normalizedCode} coupon expired hai.`)
      return
    }

    if (resolvedItems.length === 0) {
      setActionMessage('Coupon apply karne se pehle cart me products add karo.')
      return
    }

    setAppliedCouponCode(normalizedCode)
    setCouponCode('')
    setActionMessage(`${normalizedCode} coupon applied successfully.`)
  }

  function removeCoupon() {
    setAppliedCouponCode('')
    setActionMessage('Coupon removed from cart.')
  }

  function proceedToCheckout() {
    if (resolvedItems.length === 0) {
      setActionMessage('Checkout karne se pehle cart me products add karo.')
      return
    }

    applyQuantityChanges({ silent: true })
    window.location.hash = '#/checkout'
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
          <div className="cart-page__intro">
            <h1 className="cart-page__title">Cart</h1>
            <p>Added products review karo, quantity update karo, coupon apply karo aur checkout continue karo.</p>
          </div>

          <div className="cart-page__header-actions">
            <a className="link-button" href="#/shop">
              Continue shopping
            </a>
          </div>
        </div>

        {actionMessage ? <div className="shop-action-message">{actionMessage}</div> : null}

        {resolvedItems.length === 0 ? (
          <div className="cart-empty surface-card">
            <h3>Your cart is empty</h3>
            <p>Shop page se sirf Add to cart kiye hue products yahan show honge.</p>
            <a className="section-link" href="#/shop">
              Go to shop
            </a>
          </div>
        ) : (
          <div className="cart-page__content">
            <div className="cart-main">
              <div className="cart-table surface-card">
                <div className="cart-table__head">
                  <span />
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Subtotal</span>
                </div>

                {resolvedItems.map((item) => (
                  <article className="cart-row" key={item.id}>
                    <button
                      aria-label={`Remove ${item.name} from cart`}
                      className="cart-row__remove"
                      onClick={() => removeItem(item.id)}
                      type="button"
                    >
                      x
                    </button>

                    <div className="cart-row__product">
                      <div className="cart-row__media">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="cart-row__details">
                        <h3>{item.name}</h3>
                        <p>{item.summary}</p>
                        <div className="cart-row__meta">
                          <span>{item.category}</span>
                          {item.originalPrice > item.price ? (
                            <strong>{currency.format(item.originalPrice)}</strong>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="cart-row__price">{currency.format(item.price)}</div>

                    <div className="cart-row__quantity-wrap">
                      <div className="cart-row__quantity">
                        <button
                          aria-label={`Decrease quantity for ${item.name}`}
                          onClick={() => changeDraftQuantity(item.id, -1)}
                          type="button"
                        >
                          <MinusIcon />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          aria-label={`Increase quantity for ${item.name}`}
                          onClick={() => changeDraftQuantity(item.id, 1)}
                          type="button"
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </div>

                    <div className="cart-row__subtotal">
                      <strong>{currency.format(item.price * item.quantity)}</strong>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cart-tools">
                <form className="cart-coupon" onSubmit={handleApplyCoupon}>
                  <input
                    aria-label="Coupon code"
                    onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    type="text"
                    value={couponCode}
                  />
                  <button type="submit">Apply coupon</button>
                </form>

                <button
                  className="cart-update-button"
                  disabled={!hasPendingChanges}
                  onClick={() => applyQuantityChanges()}
                  type="button"
                >
                  Update cart
                </button>
              </div>

              {appliedCoupon ? (
                <div className="cart-coupon__status">
                  <span>
                    {appliedCoupon.code} applied: {appliedCoupon.value}% off.{' '}
                    {appliedCoupon.description}
                  </span>
                  <button onClick={removeCoupon} type="button">
                    Remove coupon
                  </button>
                </div>
              ) : (
                <p className="cart-coupon__hint">
                  {couponPreviewCodes.length > 0
                    ? `Try ${couponPreviewCodes.join(' or ')} for live discount.`
                    : 'Admin panel se active coupon add karo to yahan apply hoga.'}
                </p>
              )}
            </div>

            <aside className="cart-totals surface-card">
              <h3>Cart totals</h3>
              <div className="cart-totals__row">
                <span>Subtotal</span>
                <strong>{currency.format(subtotal)}</strong>
              </div>
              <div className="cart-totals__row">
                <span>Total quantity</span>
                <strong>{totalQuantity}</strong>
              </div>
              {discountAmount > 0 ? (
                <div className="cart-totals__row">
                  <span>Discount</span>
                  <strong>- {currency.format(discountAmount)}</strong>
                </div>
              ) : null}
              <div className="cart-totals__row cart-totals__row--total">
                <span>Total</span>
                <strong>{currency.format(total)}</strong>
              </div>
              <button className="cart-checkout-button" onClick={proceedToCheckout} type="button">
                Proceed to checkout
              </button>
              <button className="cart-clear-button" onClick={clearCart} type="button">
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
