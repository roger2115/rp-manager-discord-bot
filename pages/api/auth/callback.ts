import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (!code) {
    return res.status(400).json({ error: 'Brak kodu autoryzacji' })
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
        code: code as string,
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

    // Set session cookie
    res.setHeader('Set-Cookie', `session=${JSON.stringify(sessionData)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)

    // Redirect to dashboard
    res.redirect('/dashboard')
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.status(500).json({ error: 'Błąd podczas autoryzacji' })
  }
}