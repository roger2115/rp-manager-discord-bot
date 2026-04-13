import { NextResponse } from 'next/server'

export async function GET(request) {
  const origin = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const fullOrigin = `${protocol}://${origin}`
  
  return NextResponse.json({ 
    debug: {
      host: origin,
      protocol: protocol,
      fullOrigin: fullOrigin,
      envSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      expectedRedirectUri: `${fullOrigin}/api/auth/callback`,
      envRedirectUri: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://panel-discord-rp.vercel.app'}/api/auth/callback`,
      clientId: process.env.DISCORD_CLIENT_ID || '1492693587614371971',
      hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET
    }
  })
}