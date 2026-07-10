import { useEffect, useRef, useState } from 'react'
import {
  ArrowIcon,
  CertifiedIcon,
  DeliveryBannerArt,
  DeliveryIcon,
  LeafIcon,
  LockIcon,
  NoSideEffectsIcon,
  RefreshIcon,
  ShieldCheckIcon,
  WalletIcon,
} from './Illustrations.jsx'
import ProductCard from './ProductCard.jsx'
import SiteChrome from './SiteChrome.jsx'

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

function HomePage({ currentUser, data, flashMessage, onLogout, status }) {
  const categoryGridRef = useRef(null)
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)
  const [isMobileCatalogView, setIsMobileCatalogView] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 820px)').matches : false,
  )
  const renderedCategories = isMobileCatalogView ? data.categories : [...data.categories, ...data.categories]
  const heroSlides =
    Array.isArray(data.hero?.slides) && data.hero.slides.length > 0
      ? data.hero.slides
      : [
          {
            id: 'hero-default',
            title: data.hero.title,
            subtitle: data.hero.subtitle,
            image: '/images/hero-banner.png',
            alt: `${data.hero.title} ${data.hero.subtitle}`,
          },
        ]
  const statusText =
    status === 'connected'
      ? 'API connected'
      : status === 'fallback'
        ? 'Using shared demo data'
        : 'Syncing catalog'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(max-width: 820px)')
    const handleChange = (event) => setIsMobileCatalogView(event.matches)

    setIsMobileCatalogView(mediaQuery.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (heroSlides.length < 2) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((currentSlide) => (currentSlide + 1) % heroSlides.length)
    }, 6000)

    return () => window.clearInterval(intervalId)
  }, [heroSlides.length])

  useEffect(() => {
    if (activeHeroSlide >= heroSlides.length) {
      setActiveHeroSlide(0)
    }
  }, [activeHeroSlide, heroSlides.length])

  useEffect(() => {
    const grid = categoryGridRef.current

    if (!grid || data.categories.length < 2 || isMobileCatalogView) {
      return undefined
    }

    let resetTimeoutId

    function getGap() {
      const gridStyles = window.getComputedStyle(grid)
      return Number.parseFloat(gridStyles.columnGap || gridStyles.gap || '0')
    }

    function getStep() {
      const firstCard = grid.querySelector('.category-card')

      if (!firstCard) {
        return 0
      }

      return firstCard.getBoundingClientRect().width + getGap()
    }

    function getLoopWidth() {
      return grid.scrollWidth / 2
    }

    const intervalId = window.setInterval(() => {
      const step = getStep()
      const loopWidth = getLoopWidth()

      if (!step || !loopWidth) {
        return
      }

      const nextScrollLeft = grid.scrollLeft + step

      if (nextScrollLeft >= loopWidth - 4) {
        grid.scrollTo({ left: loopWidth, behavior: 'smooth' })
        window.clearTimeout(resetTimeoutId)
        resetTimeoutId = window.setTimeout(() => {
          grid.scrollTo({ left: 0 })
        }, 420)
        return
      }

      if (grid.scrollLeft >= loopWidth - 4) {
        grid.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }

      grid.scrollTo({ left: nextScrollLeft, behavior: 'smooth' })
    }, 2000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(resetTimeoutId)
    }
  }, [data.categories, isMobileCatalogView])

  return (
    <SiteChrome
      currentPage="home"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
        <section className="hero-card">
          <div className="hero-card__status">{statusText}</div>
          <div className="hero-card__viewport">
            <div
              className="hero-card__track"
              style={{ transform: `translateX(-${activeHeroSlide * 100}%)` }}
            >
              {heroSlides.map((slide) => (
                <div className="hero-card__slide" key={slide.id}>
                  <img
                    src={slide.image}
                    className="hero-card__banner-image"
                    alt={slide.alt ?? `${slide.title} ${slide.subtitle}`}
                  />
                </div>
              ))}
            </div>
          </div>
          {heroSlides.length > 1 ? (
            <div className="hero-card__dots" aria-label="Hero banner slides">
              {heroSlides.map((slide, index) => (
                <button
                  aria-label={`Show ${slide.title}`}
                  aria-pressed={activeHeroSlide === index}
                  className={`hero-card__dot ${activeHeroSlide === index ? 'is-active' : ''}`}
                  key={slide.id}
                  onClick={() => setActiveHeroSlide(index)}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </section>

        <section className="category-strip surface-card">
          <div className="category-grid" ref={categoryGridRef}>
            {renderedCategories.map((category, index) => {
              return (
                <article
                  className={`category-card category-card--${category.tone}`}
                  key={`${category.id}-${index}`}
                >
                  <div className="category-card__visual">
                    <img
                      className="category-card__image"
                      src={category.image}
                      alt={category.title}
                      loading="lazy"
                    />
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
                  {pillar.image ? (
                    <img
                      className={`pillar-card__image pillar-card__image--${pillar.id}`}
                      src={pillar.image}
                      alt={pillar.label}
                    />
                  ) : (
                    <span className="icon-shell icon-shell--outline">
                      <Icon />
                    </span>
                  )}
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
