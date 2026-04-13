import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API działa!',
    timestamp: new Date().toISOString(),
    env: {
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET'
    }
  })
}