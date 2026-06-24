import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.API_KEY || ''
  const viteBaseUrl = process.env.VITE_BASE_URL || ''

  res.status(200).json({
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey.length,
    apiKeyPrefix: apiKey.substring(0, 4),
    hasViteBaseUrl: !!viteBaseUrl,
    allEnvKeys: Object.keys(process.env).filter(k => k.startsWith('API') || k.startsWith('VITE')),
  })
}
