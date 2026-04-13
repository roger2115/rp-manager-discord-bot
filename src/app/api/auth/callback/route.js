import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
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
        client_id: process.env.DISCORD_CLIENT_ID || '1492693587614371971',
        client_secret: process.env.DISCORD_CLIENT_SECRET || 'eA4BMt0BH9iQW3_adbrdAj2Xs8azh5yY',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}/api/auth/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
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

    // Create response with redirect
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/?error=server_error', request.url))
  }
}