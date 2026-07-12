import { startTransition, useEffect, useState } from 'react'
import fallbackHomepage from '@shared/homepageData.js'
import { AdminDashboardPage, AdminLoginPage } from './components/AdminPages.jsx'
import AboutPage from './components/AboutPage.jsx'
import { LoginPage, SignupPage } from './components/AuthPages.jsx'
import CartPage from './components/CartPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import HomePage from './components/HomePage.jsx'
import ShopPage from './components/ShopPage.jsx'

const fallbackCategoryMap = new Map(
  fallbackHomepage.categories.map((category) => [category.id, category]),
)
const fallbackPillarMap = new Map(
  fallbackHomepage.roots.pillars.map((pillar) => [pillar.id, pillar]),
)
const authUsersStorageKey = 'st-herbal-users'
const authSessionStorageKey = 'st-herbal-session'
const adminSessionStorageKey = 'st-herbal-admin-session'

function getStoredUsers() {
  try {
    const rawUsers = window.localStorage.getItem(authUsersStorageKey)
    const parsedUsers = JSON.parse(rawUsers ?? '[]')

    return Array.isArray(parsedUsers) ? parsedUsers : []
  } catch {
    return []
  }
}

function getStoredSession() {
  try {
    const rawSession = window.localStorage.getItem(authSessionStorageKey)
    const parsedSession = JSON.parse(rawSession ?? 'null')

    return parsedSession && typeof parsedSession === 'object' ? parsedSession : null
  } catch {
    return null
  }
}

function getStoredAdminSession() {
  try {
    const rawSession = window.localStorage.getItem(adminSessionStorageKey)
    const parsedSession = JSON.parse(rawSession ?? 'null')

    return parsedSession && typeof parsedSession === 'object' ? parsedSession : null
  } catch {
    return null
  }
}

function saveStoredUsers(users) {
  window.localStorage.setItem(authUsersStorageKey, JSON.stringify(users))
}

function saveStoredSession(user) {
  window.localStorage.setItem(authSessionStorageKey, JSON.stringify(user))
}

function saveStoredAdminSession(session) {
  window.localStorage.setItem(adminSessionStorageKey, JSON.stringify(session))
}

function clearStoredSession() {
  window.localStorage.removeItem(authSessionStorageKey)
}

function clearStoredAdminSession() {
  window.localStorage.removeItem(adminSessionStorageKey)
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user
  return safeUser
}

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
    promoBar: { ...fallbackHomepage.promoBar, ...payload.promoBar },
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
    about: {
      ...fallbackHomepage.about,
      ...payload.about,
      promiseCards:
        Array.isArray(payload?.about?.promiseCards) && payload.about.promiseCards.length > 0
          ? payload.about.promiseCards
          : fallbackHomepage.about.promiseCards,
      story: {
        ...fallbackHomepage.about.story,
        ...payload?.about?.story,
        paragraphs:
          Array.isArray(payload?.about?.story?.paragraphs) &&
          payload.about.story.paragraphs.length > 0
            ? payload.about.story.paragraphs
            : fallbackHomepage.about.story.paragraphs,
      },
      values:
        Array.isArray(payload?.about?.values) && payload.about.values.length > 0
          ? payload.about.values
          : fallbackHomepage.about.values,
      blog: {
        ...fallbackHomepage.about.blog,
        ...payload?.about?.blog,
        posts:
          Array.isArray(payload?.about?.blog?.posts) && payload.about.blog.posts.length > 0
            ? payload.about.blog.posts
            : fallbackHomepage.about.blog.posts,
      },
    },
    contact: {
      ...fallbackHomepage.contact,
      ...payload.contact,
      infoBlocks:
        Array.isArray(payload?.contact?.infoBlocks) && payload.contact.infoBlocks.length > 0
          ? payload.contact.infoBlocks
          : fallbackHomepage.contact.infoBlocks,
    },
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

  if (hash.startsWith('/admin/login')) {
    return 'admin-login'
  }

  if (hash.startsWith('/admin')) {
    return 'admin'
  }

  if (hash.startsWith('/contact')) {
    return 'contact'
  }

  if (hash.startsWith('/about')) {
    return 'about'
  }

  if (hash.startsWith('/cart')) {
    return 'cart'
  }

  if (hash.startsWith('/shop')) {
    return 'shop'
  }

  if (hash.startsWith('/signup')) {
    return 'signup'
  }

  if (hash.startsWith('/login')) {
    return 'login'
  }

  return 'home'
}

function App() {
  const [data, setData] = useState(fallbackHomepage)
  const [status, setStatus] = useState('loading')
  const [route, setRoute] = useState(() => getCurrentRoute())
  const [currentUser, setCurrentUser] = useState(() => getStoredSession())
  const [adminSession, setAdminSession] = useState(() => getStoredAdminSession())
  const [flashMessage, setFlashMessage] = useState(null)

  useEffect(() => {
    if (!flashMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setFlashMessage(null)
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [flashMessage])

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

  function navigateTo(routeHash) {
    window.location.hash = routeHash
  }

  function handleSignup(formData) {
    const users = getStoredUsers()
    const normalizedEmail = formData.email.trim().toLowerCase()
    const normalizedMobile = formData.mobile.replace(/\D/g, '')

    if (users.some((user) => user.email === normalizedEmail)) {
      return {
        ok: false,
        field: 'email',
        error: 'An account with this email already exists.',
      }
    }

    if (users.some((user) => user.mobile === normalizedMobile)) {
      return {
        ok: false,
        field: 'mobile',
        error: 'An account with this mobile number already exists.',
      }
    }

    const newUser = {
      id:
        typeof window.crypto?.randomUUID === 'function'
          ? window.crypto.randomUUID()
          : `${Date.now()}`,
      fullName: formData.fullName.trim(),
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: formData.password,
    }
    const sessionUser = sanitizeUser(newUser)

    saveStoredUsers([...users, newUser])
    saveStoredSession(sessionUser)
    setCurrentUser(sessionUser)
    setFlashMessage({ type: 'success', message: 'Account created successfully.' })
    navigateTo('#/')

    return { ok: true }
  }

  async function handleLogin(formData) {
    const users = getStoredUsers()
    const normalizedIdentifier = formData.identifier.trim().toLowerCase()
    const normalizedMobile = formData.identifier.replace(/\D/g, '')
    const matchedUser = users.find(
      (user) =>
        user.email === normalizedIdentifier || user.mobile === normalizedMobile,
    )

    if (!matchedUser || matchedUser.password !== formData.password) {
      try {
        const adminResponse = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password,
          }),
        })
        const adminPayload = await adminResponse.json()

        if (adminResponse.ok && adminPayload?.session) {
          saveStoredAdminSession(adminPayload.session)
          setAdminSession(adminPayload.session)
          setFlashMessage({ type: 'success', message: 'Admin login successful.' })
          navigateTo('#/admin')
          return { ok: true }
        }
      } catch {
        return {
          ok: false,
          error: 'Unable to connect to login service. Please make sure backend is running.',
        }
      }

      return {
        ok: false,
        error: 'Invalid email/mobile number or password.',
      }
    }

    const sessionUser = sanitizeUser(matchedUser)
    saveStoredSession(sessionUser)
    setCurrentUser(sessionUser)
    setFlashMessage({ type: 'success', message: 'Login successful.' })
    navigateTo('#/')

    return { ok: true }
  }

  function handleLogout() {
    clearStoredSession()
    setCurrentUser(null)
    setFlashMessage({ type: 'success', message: 'Logged out successfully.' })
    navigateTo('#/')
  }

  async function handleAdminLogin(formData) {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const payload = await response.json()

      if (!response.ok) {
        return {
          ok: false,
          error: payload.error || 'Unable to login to the admin panel.',
        }
      }

      saveStoredAdminSession(payload.session)
      setAdminSession(payload.session)
      setFlashMessage({ type: 'success', message: 'Admin login successful.' })
      navigateTo('#/admin')

      return { ok: true }
    } catch {
      return {
        ok: false,
        error: 'Unable to connect to the admin service right now.',
      }
    }
  }

  function handleAdminLogout() {
    clearStoredAdminSession()
    setAdminSession(null)
    setFlashMessage({ type: 'success', message: 'Admin logged out successfully.' })
    navigateTo('#/')
  }

  function handleAdminSessionExpired() {
    clearStoredAdminSession()
    setAdminSession(null)
    setFlashMessage({ type: 'error', message: 'Admin session expired. Please login again.' })
    navigateTo('#/admin/login')
  }

  function handleAdminContentSaved(nextContent, options = {}) {
    setData(resolveHomepageData(nextContent))

    if (!options.silent) {
      setFlashMessage({ type: 'success', message: 'Website content updated successfully.' })
    }
  }

  if (route === 'shop') {
    return (
      <ShopPage
        currentUser={currentUser}
        data={data}
        flashMessage={flashMessage}
        onLogout={handleLogout}
      />
    )
  }

  if (route === 'cart') {
    return (
      <CartPage
        currentUser={currentUser}
        data={data}
        flashMessage={flashMessage}
        onLogout={handleLogout}
      />
    )
  }

  if (route === 'about') {
    return (
      <AboutPage
        currentUser={currentUser}
        data={data}
        flashMessage={flashMessage}
        onLogout={handleLogout}
      />
    )
  }

  if (route === 'contact') {
    return (
      <ContactPage
        currentUser={currentUser}
        data={data}
        flashMessage={flashMessage}
        onLogout={handleLogout}
      />
    )
  }

  if (route === 'login') {
    return (
      <LoginPage
        currentUser={currentUser}
        data={data}
        flashMessage={flashMessage}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    )
  }

  if (route === 'signup') {
    return (
      <SignupPage
        currentUser={currentUser}
        data={data}
        flashMessage={flashMessage}
        onLogout={handleLogout}
        onSignup={handleSignup}
      />
    )
  }

  if (route === 'admin-login') {
    return <AdminLoginPage adminSession={adminSession} onAdminLogin={handleAdminLogin} />
  }

  if (route === 'admin') {
    return adminSession ? (
      <AdminDashboardPage
        adminSession={adminSession}
        data={data}
        onAdminLogout={handleAdminLogout}
        onAdminSessionExpired={handleAdminSessionExpired}
        onContentSaved={handleAdminContentSaved}
      />
    ) : (
      <AdminLoginPage adminSession={adminSession} onAdminLogin={handleAdminLogin} />
    )
  }

  return (
    <HomePage
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={handleLogout}
      status={status}
    />
  )
}

export default App
