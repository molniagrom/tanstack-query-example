import type { VercelRequest, VercelResponse } from '@vercel/node'

const BACKEND_BASE = 'https://musicfun.it-incubator.app'
const API_KEY = process.env.API_KEY || ''

const BLOCKED_HEADERS = new Set([
  'host', 'connection', 'origin', 'referer',
  'content-length', 'content-encoding', 'transfer-encoding',
  'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto',
  'x-forwarded-port', 'x-forwarded-scheme', 'x-real-ip',
  'x-vercel-forwarded-for', 'x-vercel-ip-city', 'x-vercel-ip-country',
  'x-vercel-ip-country-region', 'x-vercel-ip-latitude', 'x-vercel-ip-longitude',
  'x-vercel-ip-timezone', 'x-vercel-proxied-for',
])

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let finished = false

    const timeout = setTimeout(() => {
      if (!finished) {
        finished = true
        resolve(Buffer.concat(chunks))
      }
    }, 5000)

    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      if (!finished) {
        finished = true
        clearTimeout(timeout)
        resolve(Buffer.concat(chunks))
      }
    })
    req.on('error', (err) => {
      if (!finished) {
        finished = true
        clearTimeout(timeout)
        reject(err)
      }
    })
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiPath = (typeof req.query.path === 'string' ? req.query.path : '') || '/1.0/'

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

  const method = (req.method || 'GET').toUpperCase()
  const isBodyMethod = !['GET', 'HEAD'].includes(method)

  try {
    const rawBody = isBodyMethod ? await readRawBody(req) : undefined
    const hasBody = rawBody && rawBody.length > 0

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: hasBody ? new Uint8Array(rawBody) : undefined,
      redirect: 'follow',
      signal: controller.signal,
    })

    clearTimeout(timeout)

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
    console.error('[proxy] Error:', String(error), 'URL:', targetUrl, 'Method:', method)
    res.status(502).json({ error: 'Proxy error', message: String(error), url: targetUrl })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
