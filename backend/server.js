import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homepageData } from '../shared/homepageData.js'

const PORT = Number(process.env.PORT) || 4000
const DEFAULT_ADMIN_IDENTIFIER = process.env.ADMIN_IDENTIFIER || 'admin@stherbal.com'
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const DEFAULT_ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME || 'ST Herbal Admin'
const CONTENT_FILE = new URL('./data/site-content.json', import.meta.url)
const CONTENT_FILE_PATH = fileURLToPath(CONTENT_FILE)
const ADMIN_CONFIG_FILE = new URL('./data/admin-config.json', import.meta.url)
const ADMIN_CONFIG_FILE_PATH = fileURLToPath(ADMIN_CONFIG_FILE)
const sessions = new Map()
let siteContent = cloneData(homepageData)
let adminConfig = normalizeAdminConfig()

const initializationReadyPromise = initializeData()

function cloneData(value) {
  return JSON.parse(JSON.stringify(value))
}

function normalizeArray(value, fallbackValue) {
  return Array.isArray(value) && value.length > 0 ? value : fallbackValue
}

function normalizeAdminConfig(payload = {}) {
  return {
    identifier: String(payload.identifier || DEFAULT_ADMIN_IDENTIFIER).trim() || DEFAULT_ADMIN_IDENTIFIER,
    password: String(payload.password || DEFAULT_ADMIN_PASSWORD),
    displayName:
      String(payload.displayName || DEFAULT_ADMIN_DISPLAY_NAME).trim() || DEFAULT_ADMIN_DISPLAY_NAME,
  }
}

function normalizeSiteContent(payload) {
  const nextContent = payload && typeof payload === 'object' ? payload : {}

  return {
    ...cloneData(homepageData),
    ...nextContent,
    promoBar: { ...homepageData.promoBar, ...nextContent.promoBar },
    header: { ...homepageData.header, ...nextContent.header },
    hero: {
      ...homepageData.hero,
      ...nextContent.hero,
      slides: normalizeArray(nextContent?.hero?.slides, homepageData.hero.slides),
    },
    categories: normalizeArray(nextContent.categories, homepageData.categories),
    serviceBanner: { ...homepageData.serviceBanner, ...nextContent.serviceBanner },
    sections: normalizeArray(nextContent.sections, homepageData.sections),
    shop: {
      ...homepageData.shop,
      ...nextContent.shop,
      banner: { ...homepageData.shop.banner, ...nextContent?.shop?.banner },
      products: normalizeArray(nextContent?.shop?.products, homepageData.shop.products),
    },
    roots: {
      ...homepageData.roots,
      ...nextContent.roots,
      pillars: normalizeArray(nextContent?.roots?.pillars, homepageData.roots.pillars),
    },
    about: {
      ...homepageData.about,
      ...nextContent.about,
      promiseCards: normalizeArray(nextContent?.about?.promiseCards, homepageData.about.promiseCards),
      story: {
        ...homepageData.about.story,
        ...nextContent?.about?.story,
        paragraphs: normalizeArray(
          nextContent?.about?.story?.paragraphs,
          homepageData.about.story.paragraphs,
        ),
      },
      values: normalizeArray(nextContent?.about?.values, homepageData.about.values),
      blog: {
        ...homepageData.about.blog,
        ...nextContent?.about?.blog,
        posts: normalizeArray(nextContent?.about?.blog?.posts, homepageData.about.blog.posts),
      },
    },
    contact: {
      ...homepageData.contact,
      ...nextContent.contact,
      infoBlocks: normalizeArray(nextContent?.contact?.infoBlocks, homepageData.contact.infoBlocks),
    },
    testimonials: {
      ...homepageData.testimonials,
      ...nextContent.testimonials,
      entries: normalizeArray(
        nextContent?.testimonials?.entries,
        homepageData.testimonials.entries,
      ),
    },
    trustBadges: normalizeArray(nextContent.trustBadges, homepageData.trustBadges),
    footer: {
      ...homepageData.footer,
      ...nextContent.footer,
      customerLinks: normalizeArray(
        nextContent?.footer?.customerLinks,
        homepageData.footer.customerLinks,
      ),
      quickLinks: normalizeArray(
        nextContent?.footer?.quickLinks,
        homepageData.footer.quickLinks,
      ),
      payments: normalizeArray(nextContent?.footer?.payments, homepageData.footer.payments),
    },
  }
}

async function initializeData() {
  await Promise.all([initializeContent(), initializeAdminConfig()])
}

async function initializeContent() {
  try {
    const fileContent = await readFile(CONTENT_FILE, 'utf8')
    siteContent = normalizeSiteContent(JSON.parse(fileContent))
  } catch {
    siteContent = normalizeSiteContent(homepageData)
    await persistContent(siteContent)
  }
}

async function initializeAdminConfig() {
  try {
    const fileContent = await readFile(ADMIN_CONFIG_FILE, 'utf8')
    adminConfig = normalizeAdminConfig(JSON.parse(fileContent))
  } catch {
    adminConfig = normalizeAdminConfig()
    await persistAdminConfig(adminConfig)
  }
}

async function persistContent(nextContent) {
  await mkdir(dirname(CONTENT_FILE_PATH), { recursive: true })
  await writeFile(CONTENT_FILE, JSON.stringify(nextContent, null, 2), 'utf8')
}

async function persistAdminConfig(nextConfig) {
  await mkdir(dirname(ADMIN_CONFIG_FILE_PATH), { recursive: true })
  await writeFile(ADMIN_CONFIG_FILE, JSON.stringify(nextConfig, null, 2), 'utf8')
}

function syncSessionsWithAdminConfig() {
  for (const [token, session] of sessions.entries()) {
    sessions.set(token, {
      ...session,
      identifier: adminConfig.identifier,
      displayName: adminConfig.displayName,
    })
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(payload))
}

function getTokenFromRequest(request) {
  const authHeader = request.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return ''
  }

  return authHeader.slice('Bearer '.length).trim()
}

function requireAdmin(request, response) {
  const token = getTokenFromRequest(request)
  const session = sessions.get(token)

  if (!session) {
    sendJson(response, 401, { error: 'Unauthorized admin access.' })
    return null
  }

  return session
}

async function readJsonBody(request) {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) {
    return {}
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  return JSON.parse(rawBody)
}

const server = createServer(async (request, response) => {
  const { method = 'GET', url = '/' } = request

  if (method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    response.end()
    return
  }

  try {
    await initializationReadyPromise

    if (method === 'GET' && url === '/api/health') {
      sendJson(response, 200, { ok: true, service: 'st-herbal-backend' })
      return
    }

    if (method === 'GET' && url === '/') {
      sendJson(response, 200, {
        ok: true,
        message: 'ST Herbal backend is running.',
        frontendUrl: 'http://localhost:5173',
        apiRoutes: [
          '/api/health',
          '/api/homepage',
          '/api/admin/login',
          '/api/admin/content',
        ],
        adminLogin: adminConfig.identifier,
        note: 'Open the frontend URL in your browser to see the full page.',
      })
      return
    }

    if (method === 'GET' && url === '/api/homepage') {
      sendJson(response, 200, siteContent)
      return
    }

    if (method === 'POST' && url === '/api/admin/login') {
      const body = await readJsonBody(request)
      const identifier = String(body.identifier || '').trim().toLowerCase()
      const password = String(body.password || '')

      if (identifier !== adminConfig.identifier.toLowerCase() || password !== adminConfig.password) {
        sendJson(response, 401, { error: 'Invalid admin email or password.' })
        return
      }

      const token = randomUUID()
      const session = {
        token,
        identifier: adminConfig.identifier,
        displayName: adminConfig.displayName,
        createdAt: Date.now(),
      }

      sessions.set(token, session)
      sendJson(response, 200, { ok: true, session })
      return
    }

    if (method === 'GET' && url === '/api/admin/content') {
      const session = requireAdmin(request, response)

      if (!session) {
        return
      }

      sendJson(response, 200, {
        ok: true,
        content: siteContent,
        admin: {
          displayName: adminConfig.displayName,
          identifier: adminConfig.identifier,
        },
      })
      return
    }

    if (method === 'PUT' && url === '/api/admin/profile') {
      const session = requireAdmin(request, response)

      if (!session) {
        return
      }

      const body = await readJsonBody(request)
      const nextIdentifier = String(body.identifier || '').trim().toLowerCase()
      const nextDisplayName = String(body.displayName || '').trim()

      if (!nextIdentifier || !nextDisplayName) {
        sendJson(response, 400, { error: 'Display name and admin email are required.' })
        return
      }

      adminConfig = normalizeAdminConfig({
        ...adminConfig,
        identifier: nextIdentifier,
        displayName: nextDisplayName,
      })
      await persistAdminConfig(adminConfig)
      syncSessionsWithAdminConfig()

      sendJson(response, 200, {
        ok: true,
        message: 'Admin profile updated successfully.',
        session: {
          ...sessions.get(session.token),
        },
      })
      return
    }

    if (method === 'PUT' && url === '/api/admin/password') {
      const session = requireAdmin(request, response)

      if (!session) {
        return
      }

      const body = await readJsonBody(request)
      const currentPassword = String(body.currentPassword || '')
      const nextPassword = String(body.nextPassword || '')

      if (!currentPassword || !nextPassword) {
        sendJson(response, 400, { error: 'Current and new password are required.' })
        return
      }

      if (currentPassword !== adminConfig.password) {
        sendJson(response, 400, { error: 'Current password is incorrect.' })
        return
      }

      if (nextPassword.length < 6) {
        sendJson(response, 400, { error: 'New password must be at least 6 characters long.' })
        return
      }

      adminConfig = normalizeAdminConfig({
        ...adminConfig,
        password: nextPassword,
      })
      await persistAdminConfig(adminConfig)

      sendJson(response, 200, {
        ok: true,
        message: 'Admin password updated successfully.',
      })
      return
    }

    if (method === 'PUT' && url === '/api/admin/content') {
      const session = requireAdmin(request, response)

      if (!session) {
        return
      }

      const body = await readJsonBody(request)
      const nextContent = normalizeSiteContent(body)

      if (!Array.isArray(nextContent?.shop?.products) || nextContent.shop.products.length === 0) {
        sendJson(response, 400, { error: 'Shop products are required before saving.' })
        return
      }

      siteContent = nextContent
      await persistContent(siteContent)

      sendJson(response, 200, {
        ok: true,
        message: 'Website content updated successfully.',
        content: siteContent,
      })
      return
    }

    sendJson(response, 404, { error: 'Route not found' })
  } catch (error) {
    sendJson(response, 500, {
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

server.listen(PORT, () => {
  console.log(`ST Herbal backend running on http://localhost:${PORT}`)
  console.log(`Admin login: ${adminConfig.identifier}`)
})
