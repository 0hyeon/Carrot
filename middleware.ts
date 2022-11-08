import { NextRequest, NextFetchEvent, userAgent } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // console.log("it works! global middleware");
  const { device } = userAgent(req);
  // console.log("device : ", device.type);

  if (req.nextUrl.pathname.startsWith("/chats")) {
    console.log("this is only Chat middleware");
  }
}
