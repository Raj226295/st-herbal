import { createServer } from 'node:http'
import { homepageData } from '../shared/homepageData.js'

const PORT = Number(process.env.PORT) || 4000

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(payload))
}

const server = createServer((request, response) => {
  const { method = 'GET', url = '/' } = request

  if (method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    response.end()
    return
  }

  if (method === 'GET' && url === '/api/health') {
    sendJson(response, 200, { ok: true, service: 'st-herbal-backend' })
    return
  }

  if (method === 'GET' && url === '/') {
    sendJson(response, 200, {
      ok: true,
      message: 'SS Herbal backend is running.',
      frontendUrl: 'http://localhost:5173',
      apiRoutes: ['/api/health', '/api/homepage'],
      note: 'Open the frontend URL in your browser to see the full page.',
    })
    return
  }

  if (method === 'GET' && url === '/api/homepage') {
    sendJson(response, 200, homepageData)
    return
  }

  sendJson(response, 404, { error: 'Route not found' })
})

server.listen(PORT, () => {
  console.log(`SS Herbal backend running on http://localhost:${PORT}`)
})
