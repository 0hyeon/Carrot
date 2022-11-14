import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "carrotsession",
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(fn: any) {
  //api안에서 쿠키값을 저장하는 헬퍼함수
  return withIronSessionApiRoute(fn, cookieOptions);
}
export function withSsrSession(handler: any) {
  //ssr에서 쿠기값을 저장하는 헬퍼함수
  return withIronSessionSsr(handler, cookieOptions);
}
