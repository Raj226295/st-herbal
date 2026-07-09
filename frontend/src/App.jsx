import { startTransition, useEffect, useState } from 'react'
import fallbackHomepage from '@shared/homepageData.js'
import HomePage from './components/HomePage.jsx'
import ShopPage from './components/ShopPage.jsx'

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

        startTransition(() => {
          setData(payload)
          setStatus('connected')
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
