import { NextApiRequest, NextApiResponse } from "next";
export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

interface ConfigType {
  method: "GET" | "POST" | "DELETE";
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function withHandler({
  method,
  isPrivate = true,
  //default값 true, interface는 필수가아닌 선택값 (isPrivate? : boolean)
  //우리앱은 대부분 private핸들러사용하기 때문에 true
  handler,
}: ConfigType) /* method handler isPrivate를 꺼냄*/ {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    // Get or Post or Delete
    if (req.method !== method) {
      return res.status(405).end();
    }

    // 로그인시 boolean
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: "Plz log in." });
    }

    // req, res
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
//fn은 withHandler 뒤에 실행할 함수

//fn: (req: NextApiRequest, res: NextApiResponse) => void 요것이 arguments *인자

//Next가 실행해야할것을 return 해야함
