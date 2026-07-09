import {
  ArrowIcon,
  BalanceIcon,
  CertifiedIcon,
  DeliveryBannerArt,
  DeliveryIcon,
  GlowIcon,
  HairIcon,
  HeartPulseIcon,
  LeafIcon,
  LockIcon,
  NoSideEffectsIcon,
  RefreshIcon,
  ShieldCheckIcon,
  SkinIcon,
  StrengthIcon,
  WalletIcon,
} from './Illustrations.jsx'
import ProductCard from './ProductCard.jsx'
import SiteChrome from './SiteChrome.jsx'

const categoryIcons = {
  pulse: HeartPulseIcon,
  strength: StrengthIcon,
  glow: GlowIcon,
  hair: HairIcon,
  skin: SkinIcon,
  balance: BalanceIcon,
}

const pillarIcons = {
  certified: CertifiedIcon,
  leaf: LeafIcon,
  ban: NoSideEffectsIcon,
  shield: ShieldCheckIcon,
}

const trustIcons = {
  delivery: DeliveryIcon,
  wallet: WalletIcon,
  refresh: RefreshIcon,
  lock: LockIcon,
}

function ProductSection({ section }) {
  return (
    <section className="product-section">
      <div className="section-header">
        <div className="section-header__title-wrap">
          <h2 className={`section-title section-title--${section.accent}`}>{section.title}</h2>
          {section.countdown ? (
            <div className="countdown">
              <span className="countdown__label">Time left</span>
              {section.countdown.map((value, index) => (
                <div key={`${section.id}-${index}`} className="countdown__box">
                  {value}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <a className="link-button" href="#/shop">
          View more
          <ArrowIcon />
        </a>
      </div>

      <div className="product-grid">
        {section.products.map((product) => (
          <ProductCard key={`${section.id}-${product.id}`} product={product} />
        ))}
      </div>
    </section>
  )
}

function TrustStrip({ items }) {
  return (
    <section className="trust-strip surface-card">
      {items.map((item) => {
        const Icon = trustIcons[item.icon]
        return (
          <article className="trust-item" key={item.id}>
            <span className="icon-shell">
              <Icon />
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        )
      })}
    </section>
  )
}

function HomePage({ data, status }) {
  const statusText =
    status === 'connected'
      ? 'API connected'
      : status === 'fallback'
        ? 'Using shared demo data'
        : 'Syncing catalog'

  return (
    <SiteChrome currentPage="home" data={data}>
        <section className="hero-card">
          <div className="hero-card__status">{statusText}</div>
          <img
            src="/images/hero-banner.png"
            className="hero-card__banner-image"
            alt={`${data.hero.title} ${data.hero.subtitle}`}
          />
        </section>

        <section className="category-strip surface-card">
          <div className="category-grid">
            {data.categories.map((category) => {
              const Icon = categoryIcons[category.icon]

              return (
                <article className={`category-card category-card--${category.tone}`} key={category.id}>
                  <div className="category-card__visual">
                    <span className="category-card__halo" />
                    <Icon />
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                </article>
              )
            })}
          </div>
          <div className="category-strip__indicator" />
        </section>

        <section className="service-banner surface-card">
          <div className="service-banner__art">
            <DeliveryBannerArt />
          </div>
          <div className="service-banner__copy">
            <h2>{data.serviceBanner.title}</h2>
            <p>{data.serviceBanner.subtitle}</p>
          </div>
          <div className="service-banner__seal">
            <div className="service-banner__seal-ring">{data.serviceBanner.seal}</div>
          </div>
          <button className="service-banner__button" type="button">
            {data.serviceBanner.ctaLabel}
          </button>
        </section>

        {data.sections.slice(0, 1).map((section) => (
          <ProductSection key={section.id} section={section} />
        ))}

        <section className="roots-section">
          <div className="roots-section__header">
            <h2 className="roots-title">{data.roots.title}</h2>
            <p>{data.roots.description}</p>
          </div>

          <div className="pillars-grid">
            {data.roots.pillars.map((pillar) => {
              const Icon = pillarIcons[pillar.icon]

              return (
                <article className="pillar-card" key={pillar.id}>
                  <span className="icon-shell icon-shell--outline">
                    <Icon />
                  </span>
                  <h3>{pillar.label}</h3>
                </article>
              )
            })}
          </div>

          <button className="roots-button" type="button">
            {data.roots.ctaLabel}
          </button>
        </section>

        {data.sections.slice(1).map((section) => (
          <ProductSection key={section.id} section={section} />
        ))}

        <section className="stories-section">
          <div className="section-header">
            <h2 className="section-title section-title--blue">{data.testimonials.title}</h2>
          </div>

          <div className="stories-grid">
            {data.testimonials.entries.map((story) => (
              <article className="story-card" key={story.id}>
                <div className="rating">{'\u2605'.repeat(story.stars)}</div>
                <p>{story.quote}</p>
                <strong>{story.author}</strong>
              </article>
            ))}
          </div>
        </section>

        <TrustStrip items={data.trustBadges} />
    </SiteChrome>
  )
}

export default HomePage
