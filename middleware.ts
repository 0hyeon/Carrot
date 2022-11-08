import { NextResponse, userAgent } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/chats")) {
    console.log("chats Only middleware");
  }
  if (req.nextUrl.pathname.startsWith("/")) {
    const ua = userAgent(req);
    if (ua?.isBot) {
      return new Response("Plz don't be a bot. Be human.", { status: 403 });
    }
  }
  if (req.nextUrl.pathname.startsWith("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.get("carrotsession")) {
      console.log("carrotsession");
      NextResponse.redirect(`${req.nextUrl.origin}/enter`);
    }
  }

  return NextResponse.next();
}
