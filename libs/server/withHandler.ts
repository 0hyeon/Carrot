import { NextApiRequest, NextApiResponse } from "next";
export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
export default function withHandler(
  method: "GET" | "POST" | "DELETE",
  fn: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method !== method) {
      return res.status(405).end();
    }
    try {
      await fn(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
//fn은 withHandler 뒤에 실행할 함수

//fn: (req: NextApiRequest, res: NextApiResponse) => void 요것이 arguments *인자

//Next가 실행해야할것을 return 해야함 