// lib/emailConfig.ts
export const emailConfig = {
  from: process.env.EMAIL_USER,
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
}

export function validateEmailConfig() {
  const requiredVars = [
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'NEXT_PUBLIC_ADMIN_EMAIL'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.error('⚠️ Faltan variables de entorno requeridas:', missing.join(', '))
    return false
  }

  return true
}