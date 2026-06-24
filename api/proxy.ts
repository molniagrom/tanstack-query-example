import type { VercelRequest, VercelResponse } from '@vercel/node'

const BACKEND_BASE = 'https://musicfun.it-incubator.app'
const API_KEY = process.env.API_KEY || ''

const BLOCKED_HEADERS = new Set([
  'host', 'connection', 'origin', 'referer',
  'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto',
  'x-forwarded-port', 'x-forwarded-scheme', 'x-real-ip',
  'x-vercel-forwarded-for', 'x-vercel-ip-city', 'x-vercel-ip-country',
  'x-vercel-ip-country-region', 'x-vercel-ip-latitude', 'x-vercel-ip-longitude',
  'x-vercel-ip-timezone', 'x-vercel-proxied-for',
])

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[proxy] API_KEY available:', !!API_KEY, 'length:', API_KEY.length)

  // The rewrite sends path via query param: /api/proxy?path=/1.0/playlists&search=...
  const apiPath = (typeof req.query.path === 'string' ? req.query.path : '') || '/1.0/'

  // Rebuild query string without the 'path' param
  const queryParams = new URLSearchParams()
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue
    if (typeof value === 'string') {
      queryParams.set(key, value)
    } else if (Array.isArray(value)) {
      value.forEach(v => queryParams.append(key, v))
    }
  }
  const qs = queryParams.toString()
  const targetUrl = `${BACKEND_BASE}/api${apiPath}${qs ? '?' + qs : ''}`

  // Build headers
  const headers: Record<string, string> = {}
  for (const [key, value] of Object.entries(req.headers)) {
    if (BLOCKED_HEADERS.has(key.toLowerCase())) continue
    if (typeof value === 'string') {
      headers[key] = value
    } else if (Array.isArray(value)) {
      headers[key] = value.join(', ')
    }
  }

  headers['Origin'] = BACKEND_BASE
  headers['Referer'] = `${BACKEND_BASE}/`
  if (API_KEY) {
    headers['api-key'] = API_KEY
  }

  try {
    const rawBody = ['GET', 'HEAD'].includes((req.method || 'GET').toUpperCase())
      ? undefined
      : await readRawBody(req)

    const response = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers,
      body: rawBody ? new Uint8Array(rawBody) : undefined,
      redirect: 'follow',
    })

    res.status(response.status)

    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase()
      if (
        lower !== 'content-encoding' &&
        lower !== 'transfer-encoding' &&
        lower !== 'content-length' &&
        lower !== 'connection'
      ) {
        res.setHeader(key, value)
      }
    })

    const data = await response.arrayBuffer()
    res.send(Buffer.from(data))
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(502).json({ error: 'Proxy error', message: String(error) })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
