import { useEffect, useMemo, useState } from 'react'
import { CloseIcon } from './Illustrations.jsx'
import SiteChrome from './SiteChrome.jsx'

const cartStorageKey = 'st-herbal-cart'
const cartUpdatedEventName = 'st-herbal-cart-updated'
const ordersStorageKey = 'st-herbal-orders'
const ordersUpdatedEventName = 'st-herbal-orders-updated'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\d{10}$/
const pinCodePattern = /^\d{6}$/

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

function splitFullName(fullName) {
  const trimmedName = String(fullName ?? '').trim()

  if (!trimmedName) {
    return { firstName: '', lastName: '' }
  }

  const [firstName, ...restNames] = trimmedName.split(/\s+/)
  return {
    firstName,
    lastName: restNames.join(' '),
  }
}

function createInitialFormState(currentUser) {
  const nameParts = splitFullName(currentUser?.fullName)

  return {
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    companyName: '',
    country: 'India',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Delhi',
    pinCode: '',
    phone: currentUser?.mobile ?? '',
    email: currentUser?.email ?? '',
    notes: '',
    paymentMethod: 'cod',
    acceptTerms: false,
  }
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
            description: coupon?.description || 'Storefront coupon',
            status: String(coupon?.status || 'Active').trim().toLowerCase(),
          },
        ]
      })
      .filter(Boolean),
  )
}

function CheckoutPage({ currentUser, data, flashMessage, onLogout }) {
  const [cartItems, setCartItems] = useState(() => readStoredJson(cartStorageKey, []))
  const [formState, setFormState] = useState(() => createInitialFormState(currentUser))
  const [couponOpen, setCouponOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCouponCode, setAppliedCouponCode] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [errorMessages, setErrorMessages] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [successOrder, setSuccessOrder] = useState(null)

  useEffect(() => {
    setFormState((currentValue) => {
      const initialState = createInitialFormState(currentUser)

      return {
        ...currentValue,
        firstName: currentValue.firstName || initialState.firstName,
        lastName: currentValue.lastName || initialState.lastName,
        phone: currentValue.phone || initialState.phone,
        email: currentValue.email || initialState.email,
      }
    })
  }, [currentUser])

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems))
    window.dispatchEvent(new CustomEvent(cartUpdatedEventName, { detail: cartItems }))
  }, [cartItems])

  useEffect(() => {
    if (!statusMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage('')
    }, 2800)

    return () => window.clearTimeout(timeoutId)
  }, [statusMessage])

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

          return {
            id: item.id,
            name: item.name ?? matchingProduct?.name ?? 'Herbal Product',
            image: item.image ?? matchingProduct?.image ?? '',
            price: item.price ?? matchingProduct?.price ?? 0,
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
  const appliedCoupon = appliedCouponCode ? availableCoupons[appliedCouponCode] : null
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.value) / 100) : 0
  const total = Math.max(0, subtotal - discountAmount)

  function updateField(field, value) {
    setFormState((currentValue) => ({ ...currentValue, [field]: value }))
    setFieldErrors((currentValue) => ({ ...currentValue, [field]: '' }))
  }

  function handleApplyCoupon(event) {
    event.preventDefault()

    const normalizedCode = couponCode.trim().toUpperCase()

    if (!normalizedCode) {
      setStatusMessage('Coupon code enter karo.')
      return
    }

    const matchedCoupon = availableCoupons[normalizedCode]

    if (!matchedCoupon) {
      setStatusMessage('Invalid coupon code.')
      return
    }

    setAppliedCouponCode(normalizedCode)
    setCouponCode('')
    setStatusMessage(`${normalizedCode} coupon applied successfully.`)
  }

  function buildValidationState() {
    const nextErrors = {}
    const nextMessages = []

    if (!formState.firstName.trim()) {
      nextErrors.firstName = 'Required'
      nextMessages.push('Billing First name is a required field.')
    }

    if (!formState.lastName.trim()) {
      nextErrors.lastName = 'Required'
      nextMessages.push('Billing Last name is a required field.')
    }

    if (!formState.addressLine1.trim()) {
      nextErrors.addressLine1 = 'Required'
      nextMessages.push('Billing Street address is a required field.')
    }

    if (!formState.city.trim()) {
      nextErrors.city = 'Required'
      nextMessages.push('Billing Town / City is a required field.')
    }

    if (!formState.pinCode.trim()) {
      nextErrors.pinCode = 'Required'
      nextMessages.push('Billing PIN Code is a required field.')
    } else if (!pinCodePattern.test(formState.pinCode.trim())) {
      nextErrors.pinCode = 'Invalid'
      nextMessages.push('Billing PIN Code must be exactly 6 digits.')
    }

    if (!formState.phone.trim()) {
      nextErrors.phone = 'Required'
      nextMessages.push('Billing Phone is a required field.')
    } else if (!phonePattern.test(formState.phone.trim())) {
      nextErrors.phone = 'Invalid'
      nextMessages.push('Billing Phone must be exactly 10 digits.')
    }

    if (!formState.email.trim()) {
      nextErrors.email = 'Required'
      nextMessages.push('Billing Email address is a required field.')
    } else if (!emailPattern.test(formState.email.trim())) {
      nextErrors.email = 'Invalid'
      nextMessages.push('Billing Email address is not a valid email address.')
    }

    if (!formState.acceptTerms) {
      nextErrors.acceptTerms = 'Required'
      nextMessages.push(
        'Please read and accept the terms and conditions to proceed with your order.',
      )
    }

    return { nextErrors, nextMessages }
  }

  function handlePlaceOrder(event) {
    event.preventDefault()

    if (resolvedItems.length === 0) {
      setErrorMessages(['Your cart is empty. Please add products before placing your order.'])
      setFieldErrors({})
      return
    }

    const { nextErrors, nextMessages } = buildValidationState()

    if (nextMessages.length > 0) {
      setFieldErrors(nextErrors)
      setErrorMessages(nextMessages)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const nextOrder = {
      id: `ST-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer: {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        email: formState.email.trim().toLowerCase(),
        phone: formState.phone.trim(),
      },
      billing: {
        companyName: formState.companyName.trim(),
        country: formState.country,
        addressLine1: formState.addressLine1.trim(),
        addressLine2: formState.addressLine2.trim(),
        city: formState.city.trim(),
        state: formState.state,
        pinCode: formState.pinCode.trim(),
      },
      notes: formState.notes.trim(),
      paymentMethod: formState.paymentMethod,
      paymentStatus: formState.paymentMethod === 'cod' ? 'COD' : 'Paid',
      orderStatus: 'Pending',
      couponCode: appliedCouponCode,
      items: resolvedItems,
      subtotal,
      discountAmount,
      total,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }

    const previousOrders = readStoredJson(ordersStorageKey, [])
    window.localStorage.setItem(ordersStorageKey, JSON.stringify([nextOrder, ...previousOrders]))
    window.dispatchEvent(new CustomEvent(ordersUpdatedEventName, { detail: [nextOrder, ...previousOrders] }))

    setCartItems([])
    setFieldErrors({})
    setErrorMessages([])
    setStatusMessage('Order placed successfully.')
    setSuccessOrder(nextOrder)
    setFormState(createInitialFormState(currentUser))
    setAppliedCouponCode('')
    setCouponCode('')
  }

  function closeSuccessModal() {
    setSuccessOrder(null)
  }

  return (
    <SiteChrome
      currentPage="checkout"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
      <section className="checkout-page">
        <div className="shop-breadcrumbs">
          <a href="#/">Home Page</a>
          <span>/</span>
          <a href="#/cart">Cart</a>
          <span>/</span>
          <strong>Checkout</strong>
        </div>

        <div className="checkout-page__hero">
          <h1 className="checkout-page__title">Checkout</h1>
            <button
              className="checkout-page__coupon-toggle"
              onClick={() => setCouponOpen((currentValue) => !currentValue)}
              type="button"
            >
            Have a coupon? Click here to enter your code
            </button>
          </div>

        {couponOpen ? (
          <form className="checkout-coupon surface-card" onSubmit={handleApplyCoupon}>
            <input
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="Coupon code"
              type="text"
              value={couponCode}
            />
            <button type="submit">Apply coupon</button>
          </form>
        ) : null}

        {statusMessage ? <div className="shop-action-message">{statusMessage}</div> : null}

        {errorMessages.length > 0 ? (
          <div className="checkout-page__errors" role="alert">
            {errorMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : null}

        {resolvedItems.length === 0 && !successOrder ? (
          <div className="checkout-empty surface-card">
            <h3>Your cart is empty</h3>
            <p>Checkout continue karne ke liye pehle cart me products add karo.</p>
            <a className="section-link" href="#/shop">
              Go to shop
            </a>
          </div>
        ) : (
          <form className="checkout-layout" onSubmit={handlePlaceOrder}>
            <div className="checkout-billing">
              <section className="checkout-block">
                <h2>Billing details</h2>

                <div className="checkout-form">
                  <div className="checkout-form__row">
                    <label className={`checkout-field ${fieldErrors.firstName ? 'is-error' : ''}`}>
                      <span>
                        First name <strong>*</strong>
                      </span>
                      <input
                        onChange={(event) => updateField('firstName', event.target.value)}
                        type="text"
                        value={formState.firstName}
                      />
                    </label>

                    <label className={`checkout-field ${fieldErrors.lastName ? 'is-error' : ''}`}>
                      <span>
                        Last name <strong>*</strong>
                      </span>
                      <input
                        onChange={(event) => updateField('lastName', event.target.value)}
                        type="text"
                        value={formState.lastName}
                      />
                    </label>
                  </div>

                  <label className="checkout-field">
                    <span>Company name (optional)</span>
                    <input
                      onChange={(event) => updateField('companyName', event.target.value)}
                      type="text"
                      value={formState.companyName}
                    />
                  </label>

                  <label className="checkout-field">
                    <span>
                      Country / Region <strong>*</strong>
                    </span>
                    <select
                      onChange={(event) => updateField('country', event.target.value)}
                      value={formState.country}
                    >
                      <option value="India">India</option>
                    </select>
                  </label>

                  <label className={`checkout-field ${fieldErrors.addressLine1 ? 'is-error' : ''}`}>
                    <span>
                      Street address <strong>*</strong>
                    </span>
                    <input
                      onChange={(event) => updateField('addressLine1', event.target.value)}
                      placeholder="House number and street name"
                      type="text"
                      value={formState.addressLine1}
                    />
                  </label>

                  <label className="checkout-field">
                    <input
                      onChange={(event) => updateField('addressLine2', event.target.value)}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      type="text"
                      value={formState.addressLine2}
                    />
                  </label>

                  <label className={`checkout-field ${fieldErrors.city ? 'is-error' : ''}`}>
                    <span>
                      Town / City <strong>*</strong>
                    </span>
                    <input
                      onChange={(event) => updateField('city', event.target.value)}
                      type="text"
                      value={formState.city}
                    />
                  </label>

                  <label className="checkout-field">
                    <span>
                      State <strong>*</strong>
                    </span>
                    <select
                      onChange={(event) => updateField('state', event.target.value)}
                      value={formState.state}
                    >
                      <option value="Delhi">Delhi</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </label>

                  <label className={`checkout-field ${fieldErrors.pinCode ? 'is-error' : ''}`}>
                    <span>
                      PIN Code <strong>*</strong>
                    </span>
                    <input
                      onChange={(event) => updateField('pinCode', event.target.value.replace(/\D/g, '').slice(0, 6))}
                      type="text"
                      value={formState.pinCode}
                    />
                  </label>

                  <label className={`checkout-field ${fieldErrors.phone ? 'is-error' : ''}`}>
                    <span>
                      Phone <strong>*</strong>
                    </span>
                    <input
                      onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                      type="tel"
                      value={formState.phone}
                    />
                  </label>

                  <label className={`checkout-field ${fieldErrors.email ? 'is-error' : ''}`}>
                    <span>
                      Email address <strong>*</strong>
                    </span>
                    <input
                      onChange={(event) => updateField('email', event.target.value)}
                      type="email"
                      value={formState.email}
                    />
                  </label>
                </div>
              </section>

              <section className="checkout-block">
                <h2>Additional information</h2>

                <label className="checkout-field">
                  <span>Order notes (optional)</span>
                  <textarea
                    onChange={(event) => updateField('notes', event.target.value)}
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    rows={5}
                    value={formState.notes}
                  />
                </label>
              </section>
            </div>

            <aside className="checkout-order surface-card">
              <h2>Your order</h2>

              <div className="checkout-order__header">
                <span>Product</span>
                <span>Subtotal</span>
              </div>

              <div className="checkout-order__items">
                {resolvedItems.map((item) => (
                  <div className="checkout-order__item" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>x {item.quantity}</span>
                    </div>
                    <strong>{currency.format(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              <div className="checkout-order__totals">
                <div className="checkout-order__row">
                  <span>Subtotal</span>
                  <strong>{currency.format(subtotal)}</strong>
                </div>

                {discountAmount > 0 ? (
                  <div className="checkout-order__row">
                    <span>Discount ({appliedCouponCode})</span>
                    <strong>- {currency.format(discountAmount)}</strong>
                  </div>
                ) : null}

                <div className="checkout-order__row checkout-order__row--total">
                  <span>Total</span>
                  <strong>{currency.format(total)}</strong>
                </div>
              </div>

              <div className="checkout-payment">
                <label className={`checkout-payment__option ${formState.paymentMethod === 'cod' ? 'is-active' : ''}`}>
                  <div className="checkout-payment__top">
                    <input
                      checked={formState.paymentMethod === 'cod'}
                      name="payment-method"
                      onChange={() => updateField('paymentMethod', 'cod')}
                      type="radio"
                    />
                    <strong>Cash on delivery</strong>
                  </div>
                  <p>Pay with cash upon delivery.</p>
                </label>

                <label className={`checkout-payment__option ${formState.paymentMethod === 'phonepe' ? 'is-active' : ''}`}>
                  <div className="checkout-payment__top">
                    <input
                      checked={formState.paymentMethod === 'phonepe'}
                      name="payment-method"
                      onChange={() => updateField('paymentMethod', 'phonepe')}
                      type="radio"
                    />
                    <strong>PhonePe Payment Solutions</strong>
                  </div>
                  <p>Demo mode me UPI, cards aur wallet payment flow yahin se continue hoga.</p>
                </label>
              </div>

              <p className="checkout-order__privacy">
                Your personal data will be used to process your order, support your experience
                throughout this website, and for other purposes described in our privacy policy.
              </p>

              <label className={`checkout-terms ${fieldErrors.acceptTerms ? 'is-error' : ''}`}>
                <input
                  checked={formState.acceptTerms}
                  onChange={(event) => updateField('acceptTerms', event.target.checked)}
                  type="checkbox"
                />
                <span>
                  I have read and agree to the website terms and conditions. <strong>*</strong>
                </span>
              </label>

              <button className="checkout-place-order" type="submit">
                Place order
              </button>
            </aside>
          </form>
        )}
      </section>

      {successOrder ? (
        <div className="checkout-success-overlay" onClick={closeSuccessModal}>
          <div className="checkout-success-modal surface-card" onClick={(event) => event.stopPropagation()}>
            <button
              aria-label="Close order confirmation"
              className="checkout-success-modal__close"
              onClick={closeSuccessModal}
              type="button"
            >
              <CloseIcon />
            </button>

            <strong className="checkout-success-modal__eyebrow">Order Confirmed</strong>
            <h3>Your order has been placed successfully.</h3>
            <p>
              Order ID: <strong>{successOrder.id}</strong>
            </p>
            <p>
              Payment method:{' '}
              <strong>
                {successOrder.paymentMethod === 'cod'
                  ? 'Cash on delivery'
                  : 'PhonePe Payment Solutions'}
              </strong>
            </p>
            <p>Total payable: <strong>{currency.format(successOrder.total)}</strong></p>

            <div className="checkout-success-modal__actions">
              <a className="link-button" href="#/shop" onClick={closeSuccessModal}>
                Continue shopping
              </a>
              <a className="hero-card__button" href="#/" onClick={closeSuccessModal}>
                Back to home
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </SiteChrome>
  )
}

export default CheckoutPage
