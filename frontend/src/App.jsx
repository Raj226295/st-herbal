import { startTransition, useEffect, useState } from 'react'
import fallbackHomepage from '@shared/homepageData.js'
import HomePage from './components/HomePage.jsx'
import ShopPage from './components/ShopPage.jsx'

const fallbackCategoryMap = new Map(
  fallbackHomepage.categories.map((category) => [category.id, category]),
)
const fallbackPillarMap = new Map(
  fallbackHomepage.roots.pillars.map((pillar) => [pillar.id, pillar]),
)

function resolveHomepageData(payload) {
  if (!payload || typeof payload !== 'object') {
    return fallbackHomepage
  }

  const hasShopCatalog =
    Array.isArray(payload?.shop?.products) && payload.shop.products.length > 0

  if (!hasShopCatalog) {
    return fallbackHomepage
  }

  return {
    ...fallbackHomepage,
    ...payload,
    hero: { ...fallbackHomepage.hero, ...payload.hero },
    header: { ...fallbackHomepage.header, ...payload.header },
    serviceBanner: { ...fallbackHomepage.serviceBanner, ...payload.serviceBanner },
    roots: {
      ...fallbackHomepage.roots,
      ...payload.roots,
      pillars:
        Array.isArray(payload?.roots?.pillars) && payload.roots.pillars.length > 0
          ? payload.roots.pillars.map((pillar, index) => ({
              ...pillar,
              ...(fallbackPillarMap.get(pillar.id) ?? fallbackHomepage.roots.pillars[index] ?? {}),
            }))
          : fallbackHomepage.roots.pillars,
    },
    testimonials: {
      ...fallbackHomepage.testimonials,
      ...payload.testimonials,
      entries:
        Array.isArray(payload?.testimonials?.entries) && payload.testimonials.entries.length > 0
          ? payload.testimonials.entries
          : fallbackHomepage.testimonials.entries,
    },
    categories:
      Array.isArray(payload.categories) && payload.categories.length > 0
        ? payload.categories.map((category, index) => ({
            ...category,
            ...(fallbackCategoryMap.get(category.id) ?? fallbackHomepage.categories[index] ?? {}),
          }))
        : fallbackHomepage.categories,
    sections:
      Array.isArray(payload.sections) && payload.sections.length > 0
        ? payload.sections
        : fallbackHomepage.sections,
    trustBadges:
      Array.isArray(payload.trustBadges) && payload.trustBadges.length > 0
        ? payload.trustBadges
        : fallbackHomepage.trustBadges,
    footer: {
      ...fallbackHomepage.footer,
      ...payload.footer,
      payments:
        Array.isArray(payload?.footer?.payments) && payload.footer.payments.length > 0
          ? payload.footer.payments.map((payment, index) => ({
              ...(typeof fallbackHomepage.footer.payments[index] === 'object'
                ? fallbackHomepage.footer.payments[index]
                : {}),
              ...(typeof payment === 'object' ? payment : { id: payment, label: payment }),
            }))
          : fallbackHomepage.footer.payments,
    },
    shop: {
      ...fallbackHomepage.shop,
      ...payload.shop,
      banner: { ...fallbackHomepage.shop.banner, ...payload?.shop?.banner },
      products:
        Array.isArray(payload?.shop?.products) && payload.shop.products.length > 0
          ? payload.shop.products
          : fallbackHomepage.shop.products,
    },
  }
}

function getCurrentRoute() {
  const hash = window.location.hash.replace(/^#/, '')

  if (hash.startsWith('/shop')) {
    return 'shop'
  }

  return 'home'
}

function App() {
  const [data, setData] = useState(fallbackHomepage)
  const [status, setStatus] = useState('loading')
  const [route, setRoute] = useState(() => getCurrentRoute())

  useEffect(() => {
    const controller = new AbortController()

    async function loadHomepage() {
      try {
        const response = await fetch('/api/homepage', { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const hasShopCatalog =
          Array.isArray(payload?.shop?.products) && payload.shop.products.length > 0
        const resolvedData = resolveHomepageData(payload)

        startTransition(() => {
          setData(resolvedData)
          setStatus(hasShopCatalog ? 'connected' : 'fallback')
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setStatus('fallback')
      }
    }

    loadHomepage()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    function handleHashChange() {
      setRoute(getCurrentRoute())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === 'shop') {
    return <ShopPage data={data} />
  }

  return <HomePage data={data} status={status} />
}

export default App
