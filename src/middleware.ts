// import { NextRequest, NextResponse } from "next/server";
// import { rateLimiter } from "./lib/rate-limiter";

// export async function middleware(req: NextRequest) {
//     const ip = req.ip ?? '127.0.0.1'

//     try {
//         const { success } = await rateLimiter.limit(ip)

//         if (!success) return new Response('Too many requests.', { status: 429 })

//         return NextResponse.next()
//     } catch (error) {
//         console.log('Error:', error)

//         return new NextResponse(
//             'Sorry, something went wrong processing your message. Please try again later.'
//         )
//     }
// }

// export const config = {
//     matcher: '/api/issData/:path*',
// }
