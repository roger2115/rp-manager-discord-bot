import { NextRequest, NextResponse } from 'next/server'

// Discord OAuth callback handler for App Router
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Brak kodu autoryzacji' }, { status: 400 })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || '1492693587614371971',
        client_secret: process.env.DISCORD_CLIENT_SECRET || 'eA4BMt0BH9iQW3_adbrdAj2Xs8azh5yY',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://panel-discord-rp.vercel.app'}/api/auth/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const userData = await userResponse.json()

    // Get user guilds
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const guildsData = guildsResponse.ok ? await guildsResponse.json() : []

    // Store session data (in a real app, you'd use a proper session store)
    const sessionData = {
      user: userData,
      guilds: guildsData,
      accessToken: tokenData.access_token,
    }

    // Create response and redirect to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    
    // Set session cookie
    response.cookies.set('session', JSON.stringify(sessionData), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json({ error: 'Błąd podczas autoryzacji' }, { status: 500 })
  }
}