import { cookies } from 'next/headers'

const SESSION_COOKIE = 'admin_session'
const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'kahuyshop-secret-key'

// Simple JWT implementation using Web Crypto API
async function sign(payload: object, secret: string, expiresIn: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + parseInt(expiresIn) * 60 * 60 // hours to seconds
  const data = { ...payload, exp, iat: Math.floor(Date.now() / 1000) }
  
  const encoder = new TextEncoder()
  const dataStr = btoa(JSON.stringify(data))
  const headerStr = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  
  const keyData = encoder.encode(secret)
  const msgData = encoder.encode(`${headerStr}.${dataStr}`)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
  const sigArr = new Uint8Array(signature)
  let sigStr = ''
  for (let i = 0; i < sigArr.length; i++) {
    sigStr += String.fromCharCode(sigArr[i])
  }
  sigStr = btoa(sigStr)
  
  return `${headerStr}.${dataStr}.${sigStr}`
}

async function verify(token: string, secret: string): Promise<any> {
  const [headerStr, dataStr, sigStr] = token.split('.')
  if (!headerStr || !dataStr || !sigStr) throw new Error('Invalid token format')
  
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const msgData = encoder.encode(`${headerStr}.${dataStr}`)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  )
  
  // Reconstruct signature
  const sigData = atob(sigStr)
  const sigArr = new Uint8Array(sigData.length)
  for (let i = 0; i < sigData.length; i++) {
    sigArr[i] = sigData.charCodeAt(i)
  }
  
  const valid = await crypto.subtle.verify('HMAC', cryptoKey, sigArr, msgData)
  
  if (!valid) throw new Error('Invalid signature')
  
  const payload = JSON.parse(atob(dataStr))
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }
  
  return payload
}

export async function createAdminSession(): Promise<string> {
  const token = await sign({ role: 'admin' }, JWT_SECRET, '24')
  return token
}

export async function validateAdminSession(): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return false

    await verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function deleteAdminSession(): Promise<void> {
  // JWT is stateless
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  return password === adminPassword
}

export { SESSION_COOKIE }
