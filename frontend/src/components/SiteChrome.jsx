import {
  ArrowIcon,
  BagIcon,
  BrandLogo,
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

function getNavHref(label) {
  if (label === 'Home') {
    return '#/'
  }

  if (label === 'Shop') {
    return '#/shop'
  }

  return '#'
}

function SiteChrome({ data, currentPage, children }) {
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
                (currentPage === 'shop' && link === 'Shop')

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

      <main className="main-content">{children}</main>

      <footer className="site-footer">
        <section className="newsletter">
          <div className="newsletter__title">
            <span className="icon-shell">
              <ArrowIcon />
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
              <span className="payment-badge" key={payment.id ?? payment.label}>
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
    </div>
  )
}

export default SiteChrome
