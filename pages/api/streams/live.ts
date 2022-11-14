import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

// 라이브인지 아닌지
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // const {
  //   session: { user },
  //   body: { name, price, description },
  // } = req;
  // const streams = await client.stream.findUnique({
  //   where : {
  //     id: user?.id,
  //   }
  // });

  const response = await //생성자의  cloudflareId  -> LIVE_INPUT_UID 필요
  // 그건 stream 필드에 있음 -> stream index에서 보고있는 stream의 == cloudflareId
  (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs/${process.env.LIVE_INPUT_UID}/videos`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
        },
      }
    )
  ).json();
  // console.log(response);
  res.json({
    ok: true,
    ...response.result, // ...객체 자체가 아니라 객체의 내용을 제공합니다.
  });
}
//유저는 우리에게 url 을 원할거고, cloud flare는 url을 요청함
export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
