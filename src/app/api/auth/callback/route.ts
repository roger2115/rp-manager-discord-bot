import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '1492693587614371971',
        client_secret: 'eA4BMt0BH9iQW3_adbrdAj2Xs8azh5yY',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://panel-discord-rp.vercel.app/api/auth/callback',
      }),
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/?error=token_exchange', request.url))
    }

    const tokenData = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL('/?error=user_info', request.url))
    }

    const userData = await userResponse.json()

    // Redirect to dashboard with success
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    
    // Set simple session cookie
    response.cookies.set('discord_user', JSON.stringify({
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar
    }), {
      path: '/',
      httpOnly: true,
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/?error=server_error', request.url))
  }
}