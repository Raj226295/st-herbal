import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BagIcon,
  BrandLogo,
  ChevronDownIcon,
  CloseIcon,
  HeartIcon,
  HomeIcon,
  PhoneIcon,
  PinIcon,
  SearchIcon,
  SparkIcon,
  MenuIcon,
  TruckIcon,
  UserIcon,
} from './Illustrations.jsx'

const shortcutIcons = {
  truck: TruckIcon,
  user: UserIcon,
  bag: BagIcon,
  spark: SparkIcon,
  phone: PhoneIcon,
}

const cartStorageKey = 'st-herbal-cart'
const cartUpdatedEventName = 'st-herbal-cart-updated'
const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function getNavHref(label) {
  if (label === 'Home') {
    return '#/'
  }

  if (label === 'Shop') {
    return '#/shop'
  }

  if (label === 'About Us') {
    return '#/about'
  }

  if (label === 'Contact') {
    return '#/contact'
  }

  return '#'
}

const accountMenuItems = [
  { id: 'profile', label: 'My Profile' },
  { id: 'orders', label: 'My Orders' },
  { id: 'track', label: 'Track Orders' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'cart', label: 'Cart', href: '#/shop' },
  { id: 'address', label: 'Saved Address' },
]

const mobileDrawerLinks = [
  { id: 'home', label: 'Home', href: '#/', route: 'home' },
  { id: 'shop', label: 'Shop', href: '#/shop', route: 'shop' },
  { id: 'about', label: 'About Us', href: '#/about', route: 'about' },
  { id: 'blogs', label: 'Blogs', href: '#' },
  { id: 'contact', label: 'Contact', href: '#/contact', route: 'contact' },
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

function getCartCount(items) {
  if (!Array.isArray(items)) {
    return 0
  }

  return items.reduce((total, item) => total + Math.max(1, Number(item.quantity) || 1), 0)
}

function persistCartItems(nextItems) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(nextItems))
  window.dispatchEvent(new CustomEvent(cartUpdatedEventName, { detail: nextItems }))
}

function SiteChrome({ children, currentPage, currentUser, data, flashMessage, onLogout }) {
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() =>
    getCartCount(readStoredJson(cartStorageKey, [])),
  )
  const [cartItems, setCartItems] = useState(() => readStoredJson(cartStorageKey, []))
  const accountMenuRef = useRef(null)
  const mobileSearchInputRef = useRef(null)
  const userLabel = currentUser?.fullName?.split(' ')[0] ?? 'Account'
  const cartLabel = cartCount > 0 ? `Cart (${cartCount})` : 'Cart'
  const productMap = useMemo(
    () => new Map((data?.shop?.products ?? []).map((product) => [product.id, product])),
    [data?.shop?.products],
  )
  const resolvedAccountMenuItems = useMemo(
    () =>
      accountMenuItems.map((item) =>
        item.id === 'cart' ? { ...item, href: '#/cart', label: cartLabel } : item,
      ),
    [cartLabel],
  )
  const resolvedCartItems = useMemo(
    () =>
      cartItems
        .map((item) => {
          const matchingProduct = productMap.get(item.id)

          return {
            id: item.id,
            name: item.name ?? matchingProduct?.name ?? 'Herbal Product',
            image: item.image ?? matchingProduct?.image ?? '',
            price: item.price ?? matchingProduct?.price ?? 0,
            quantity: Math.max(1, Number(item.quantity) || 1),
          }
        })
        .filter((item) => item.name),
    [cartItems, productMap],
  )
  const cartSubtotal = useMemo(
    () => resolvedCartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [resolvedCartItems],
  )

  useEffect(() => {
    function handlePointerDown(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    setIsAccountOpen(false)
    setIsMobileAccountOpen(false)
    setIsMobileMenuOpen(false)
    setIsMobileSearchOpen(false)
    setIsCartDrawerOpen(false)
  }, [currentPage, currentUser])

  useEffect(() => {
    if (!isMobileSearchOpen) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      mobileSearchInputRef.current?.focus()
    }, 120)

    return () => window.clearTimeout(timeoutId)
  }, [isMobileSearchOpen])

  useEffect(() => {
    const shouldLockScroll = isMobileAccountOpen || isMobileMenuOpen || isCartDrawerOpen

    if (!shouldLockScroll) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isCartDrawerOpen, isMobileAccountOpen, isMobileMenuOpen])

  useEffect(() => {
    function syncCartState(nextItems) {
      const resolvedItems = nextItems ?? readStoredJson(cartStorageKey, [])
      setCartItems(resolvedItems)
      setCartCount(getCartCount(resolvedItems))
    }

    function handleStorage(event) {
      if (event.key && event.key !== cartStorageKey) {
        return
      }

      syncCartState()
    }

    function handleCartUpdated(event) {
      syncCartState(Array.isArray(event.detail) ? event.detail : undefined)
    }

    syncCartState()
    window.addEventListener('storage', handleStorage)
    window.addEventListener(cartUpdatedEventName, handleCartUpdated)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(cartUpdatedEventName, handleCartUpdated)
    }
  }, [])

  function openLoginPage() {
    window.location.hash = '#/login'
  }

  function handleMobileAccountAction() {
    if (!currentUser) {
      openLoginPage()
      return
    }

    setIsMobileAccountOpen(true)
  }

  function handleWishlistAction() {
    if (!currentUser) {
      openLoginPage()
      return
    }

    setIsMobileAccountOpen(true)
  }

  function openCartDrawer() {
    setIsCartDrawerOpen(true)
  }

  function closeCartDrawer() {
    setIsCartDrawerOpen(false)
  }

  function removeCartItem(productId) {
    const nextItems = cartItems.filter((item) => item.id !== productId)
    setCartItems(nextItems)
    setCartCount(getCartCount(nextItems))
    persistCartItems(nextItems)
  }

  return (
    <div className="page-shell">
      <div className="announcement-bar">
        <div className="announcement-bar__item">
          <PhoneIcon />
          <span>
            {data.promoBar.note} <strong>Call Now at {data.promoBar.phone}</strong>
          </span>
        </div>
        <div className="announcement-bar__item announcement-bar__item--highlight">
          <SparkIcon />
          <strong>{data.promoBar.highlight}</strong>
        </div>
      </div>

      <header className="masthead">
        <div className="mobile-masthead">
          <button
            aria-label="Open navigation menu"
            className="mobile-icon-button"
            onClick={() => setIsMobileMenuOpen(true)}
            type="button"
          >
            <MenuIcon />
          </button>

          <a className="mobile-brand-link" href="#/">
            <BrandLogo />
          </a>

          <button
            aria-label={cartLabel}
            className="mobile-icon-button mobile-icon-button--link"
            onClick={openCartDrawer}
            type="button"
          >
            <BagIcon />
          </button>
        </div>

        {isMobileSearchOpen ? (
          <div className="mobile-search">
            <label className="searchbar">
              <SearchIcon />
              <input
                placeholder={data.header.searchPlaceholder}
                ref={mobileSearchInputRef}
                type="text"
              />
            </label>
          </div>
        ) : null}

        <div className="masthead__top">
          <a className="brand-logo-link" href="#/">
            <BrandLogo />
          </a>

          <div className="search-cluster">
            <button className="category-chip" type="button">
              <span>{data.header.categoriesLabel}</span>
              <MenuIcon />
            </button>

            <label className="searchbar">
              <SearchIcon />
              <input type="text" placeholder={data.header.searchPlaceholder} readOnly />
            </label>
          </div>

          <div className="shortcut-list">
            {data.header.shortcuts.map((shortcut) => {
              const Icon = shortcutIcons[shortcut.icon]

              if (shortcut.id === 'account') {
                if (!currentUser) {
                  return (
                    <a className="shortcut-button shortcut-button--link" href="#/login" key={shortcut.id}>
                      <Icon />
                      <span>{shortcut.label}</span>
                    </a>
                  )
                }

                return (
                  <div className="account-shortcut" key={shortcut.id} ref={accountMenuRef}>
                    <button
                      aria-expanded={isAccountOpen}
                      aria-haspopup="menu"
                      className="shortcut-button shortcut-button--account"
                      onClick={() => setIsAccountOpen((currentValue) => !currentValue)}
                      type="button"
                    >
                      <span className="shortcut-button__avatar">
                        <Icon />
                      </span>
                      <span>{userLabel}</span>
                      <ChevronDownIcon />
                    </button>

                    {isAccountOpen ? (
                      <div className="account-menu surface-card">
                        <div className="account-menu__header">
                          <strong>{currentUser.fullName}</strong>
                          <span>{currentUser.email}</span>
                        </div>

                        <div className="account-menu__list" role="menu">
                          {resolvedAccountMenuItems.map((item) =>
                            item.href ? (
                              <a
                                className="account-menu__item"
                                href={item.href}
                                key={item.id}
                                onClick={() => setIsAccountOpen(false)}
                              >
                                {item.label}
                              </a>
                            ) : (
                              <button
                                className="account-menu__item"
                                key={item.id}
                                onClick={() => setIsAccountOpen(false)}
                                type="button"
                              >
                                {item.label}
                              </button>
                            ),
                          )}

                          <button
                            className="account-menu__item account-menu__item--danger"
                            onClick={() => {
                              setIsAccountOpen(false)
                              onLogout?.()
                            }}
                            type="button"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              }

              if (shortcut.id === 'cart') {
                return (
                  <button
                    className="shortcut-button shortcut-button--link"
                    key={shortcut.id}
                    onClick={openCartDrawer}
                    type="button"
                  >
                    <Icon />
                    <span>{cartLabel}</span>
                  </button>
                )
              }

              return (
                <button className="shortcut-button" key={shortcut.id} type="button">
                  <Icon />
                  <span>{shortcut.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="masthead__bottom">
          <nav className="primary-nav" aria-label="Primary">
            {data.header.primaryLinks.map((link) => {
              const href = getNavHref(link)
              const isActive =
                (currentPage === 'home' && link === 'Home') ||
                ((currentPage === 'shop' || currentPage === 'cart') && link === 'Shop') ||
                (currentPage === 'about' && link === 'About Us') ||
                (currentPage === 'contact' && link === 'Contact')

              return (
                <a className={isActive ? 'is-active' : ''} href={href} key={link}>
                  {link}
                </a>
              )
            })}
          </nav>

          <div className="info-pills">
            {data.header.infoPills.map((pill) => {
              const Icon = shortcutIcons[pill.icon]

              return (
                <span className="info-pill" key={pill.id}>
                  <Icon />
                  {pill.label}
                </span>
              )
            })}
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            aria-label="Mobile navigation menu"
            className="mobile-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close navigation menu"
              className="mobile-drawer__close"
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
            >
              <CloseIcon />
            </button>

            <a className="mobile-drawer__brand" href="#/" onClick={() => setIsMobileMenuOpen(false)}>
              <BrandLogo />
            </a>

            <nav className="mobile-drawer__nav" aria-label="Mobile primary navigation">
              {mobileDrawerLinks.map((link) => {
                const isActive = link.route ? link.route === currentPage : false

                return (
                  <a
                    className={`mobile-drawer__link ${isActive ? 'is-active' : ''}`}
                    href={link.href}
                    key={link.id}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      {isMobileAccountOpen ? (
        <div
          className="mobile-overlay mobile-overlay--soft"
          onClick={() => setIsMobileAccountOpen(false)}
        >
          <div
            aria-label="My account"
            className="mobile-sheet surface-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-sheet__handle" />
            <div className="mobile-sheet__header">
              <div>
                <strong>{currentUser?.fullName}</strong>
                <span>{currentUser?.email}</span>
              </div>
              <button
                aria-label="Close account panel"
                className="mobile-sheet__close"
                onClick={() => setIsMobileAccountOpen(false)}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mobile-sheet__list">
              {resolvedAccountMenuItems.map((item) =>
                item.href ? (
                  <a
                    className="mobile-sheet__item"
                    href={item.href}
                    key={item.id}
                    onClick={() => setIsMobileAccountOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    className="mobile-sheet__item"
                    key={item.id}
                    onClick={() => setIsMobileAccountOpen(false)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ),
              )}

              <button
                className="mobile-sheet__item mobile-sheet__item--danger"
                onClick={() => {
                  setIsMobileAccountOpen(false)
                  onLogout?.()
                }}
                type="button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isCartDrawerOpen ? (
        <div className="cart-overlay" onClick={closeCartDrawer}>
          <aside
            aria-label="Shopping cart"
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-drawer__header">
              <strong>shopping cart</strong>
              <button className="cart-drawer__close" onClick={closeCartDrawer} type="button">
                <span>close</span>
                <CloseIcon />
              </button>
            </div>

            <div className="cart-drawer__body">
              {resolvedCartItems.length > 0 ? (
                resolvedCartItems.map((item) => (
                  <article className="cart-drawer__item" key={item.id}>
                    <div className="cart-drawer__media">
                      {item.image ? <img src={item.image} alt={item.name} /> : null}
                    </div>

                    <div className="cart-drawer__content">
                      <button
                        aria-label={`Remove ${item.name} from cart`}
                        className="cart-drawer__remove"
                        onClick={() => removeCartItem(item.id)}
                        type="button"
                      >
                        <CloseIcon />
                      </button>
                      <h3>{item.name}</h3>
                      <div className="cart-drawer__meta">
                        <span>{item.quantity} ×</span>
                        <strong>{currency.format(item.price)}</strong>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="cart-drawer__empty">
                  <h3>Your cart is empty</h3>
                  <p>Like ya add to cart karte hi product yahan show ho jayega.</p>
                </div>
              )}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal:</span>
                <strong>{currency.format(cartSubtotal)}</strong>
              </div>
              <a className="cart-drawer__button cart-drawer__button--outline" href="#/cart" onClick={closeCartDrawer}>
                View cart
              </a>
              <a className="cart-drawer__button" href="#/cart" onClick={closeCartDrawer}>
                Checkout
              </a>
            </div>
          </aside>
        </div>
      ) : null}

      <main className="main-content">
        {flashMessage ? (
          <div className={`site-alert site-alert--${flashMessage.type ?? 'success'}`}>
            {flashMessage.message}
          </div>
        ) : null}
        {children}
      </main>

      <footer className="site-footer">
        <section className="newsletter">
          <div className="newsletter__title">
            <span className="icon-shell">
              <img className="newsletter__icon-image" src="/images/icons/mail-icon.png" alt="Mail" />
            </span>
            <h2>{data.footer.newsletterTitle}</h2>
          </div>
          <div className="newsletter__form">
            <input type="email" placeholder={data.footer.newsletterPlaceholder} readOnly />
            <button type="button">{data.footer.newsletterCta}</button>
          </div>
        </section>

        <section className="footer-main">
          <div className="footer-brand">
            <a className="brand-logo-link" href="#/">
              <BrandLogo dark />
            </a>
          </div>

          <div className="footer-column">
            <h3>customer</h3>
            {data.footer.customerLinks.map((link) => (
              <a href="#/" key={link}>
                {link}
              </a>
            ))}
          </div>

          <div className="footer-column">
            <h3>quick links</h3>
            {data.footer.quickLinks.map((link) => (
              <a href="#/" key={link}>
                {link}
              </a>
            ))}
          </div>

          <div className="footer-column footer-column--contact">
            <div className="contact-row">
              <span className="icon-shell icon-shell--footer">
                <PinIcon />
              </span>
              <div>
                <p>{data.footer.addressLabel}</p>
                <strong>{data.footer.address}</strong>
              </div>
            </div>

            <div className="contact-row">
              <span className="icon-shell icon-shell--footer">
                <PhoneIcon />
              </span>
              <div>
                <p>{data.footer.phoneLabel}</p>
                <strong>{data.footer.phone}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="footer-bottom">
          <div className="payment-list">
            <span>we accept</span>
            {data.footer.payments.map((payment) => (
              <span
                className={`payment-badge ${payment.image ? 'payment-badge--logo' : 'payment-badge--text'}`}
                key={payment.id ?? payment.label}
              >
                {payment.image ? (
                  <img
                    className="payment-badge__image"
                    src={payment.image}
                    alt={payment.label}
                  />
                ) : (
                  payment.label
                )}
              </span>
            ))}
          </div>
          <p>{data.footer.copyright}</p>
        </section>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
        <a
          className={`mobile-bottom-nav__item ${currentPage === 'shop' || currentPage === 'cart' ? 'is-active' : ''}`}
          href="#/shop"
        >
          <HomeIcon />
          <span>Shop</span>
        </a>

        <button
          className={`mobile-bottom-nav__item ${currentPage === 'login' || currentPage === 'signup' || isMobileAccountOpen ? 'is-active' : ''}`}
          onClick={handleMobileAccountAction}
          type="button"
        >
          <UserIcon />
          <span>Account</span>
        </button>

        <button
          className={`mobile-bottom-nav__item ${isMobileSearchOpen ? 'is-active' : ''}`}
          onClick={() => setIsMobileSearchOpen((currentValue) => !currentValue)}
          type="button"
        >
          <SearchIcon />
          <span>Search</span>
        </button>

        <button className="mobile-bottom-nav__item" onClick={handleWishlistAction} type="button">
          <HeartIcon />
          <span>Wishlist</span>
        </button>
      </nav>
    </div>
  )
}

export default SiteChrome
