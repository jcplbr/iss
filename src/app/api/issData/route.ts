import { NextResponse } from "next/server"

export const runtime = 'edge'

export const revalidate = 0

export async function GET() {
    const { latitude, longitude } = await fetch('https://api.wheretheiss.at/v1/satellites/25544').then(res => res.json())
    
    return NextResponse.json({ latitude, longitude })
}