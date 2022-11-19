// import { NextResponse, userAgent } from "next/server";
// import type { NextRequest, NextFetchEvent } from "next/server";

// export function middleware(req: NextRequest, ev: NextFetchEvent) {
//   if (req.nextUrl.pathname.startsWith("/chats")) {
//     console.log("chats Only middleware");
//   }
//   if (userAgent(req).isBot) {
//     // 새로운 error 화면을 만들고 그쪽으로 rewrite 시켜줄것
//   }
//   if (req.nextUrl.pathname.startsWith("/api")) {
//     if (!req.url.includes("/enter") && !req.cookies.get("carrotsession")) {
//       console.log("carrot session");
//       NextResponse.redirect(`${req.nextUrl.origin}/enter`);
//       NextResponse.redirect(new URL("/enter", req.url));
//     }
//   }

//   return NextResponse.next();
// }
import type { NextRequest, NextFetchEvent } from "next/server";
import { userAgent, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (userAgent(req).isBot) {
    return new Response("This is a bot", { status: 403 });
  }
  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies) {
      req.nextUrl.searchParams.set("from", req.nextUrl.pathname);
      req.nextUrl.pathname = "/enter";
      return NextResponse.redirect(req.nextUrl);
    }
  }
}
