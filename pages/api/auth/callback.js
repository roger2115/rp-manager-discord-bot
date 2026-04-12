export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code } = req.query

  if (!code) {
    return res.redirect('/?error=no_code')
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
      return res.redirect('/?error=token_exchange')
    }

    const tokenData = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      return res.redirect('/?error=user_info')
    }

    const userData = await userResponse.json()

    // Set simple session cookie
    res.setHeader('Set-Cookie', `discord_user=${JSON.stringify({
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar
    })}; Path=/; HttpOnly; Max-Age=86400`)

    // Redirect to dashboard with success
    return res.redirect('/dashboard')
  } catch (error) {
    console.error('OAuth callback error:', error)
    return res.redirect('/?error=server_error')
  }
}