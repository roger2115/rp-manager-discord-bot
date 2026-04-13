import { NextResponse } from 'next/server'

export async function GET(request) {
  const userCookie = request.cookies.get('discord_user')
  
  if (!userCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const userData = JSON.parse(userCookie.value)
    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
  }
}