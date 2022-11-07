import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user }, //withSession에서
  } = req;

  //소유자가 아니어도 보여주고 싶지 않은 정보를 가려야함
  //include가 아닌 select를 이중일택으로 true를 통해서
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      messages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });

  //stram유저가 stream소유자일경우, key, url제공
  const isOwner = stream?.userId === user?.id; //유저와 생성자가 같으면
  if (stream && !isOwner) {
    stream.cloudflareKey = "xxxxx";
    stream.cloudflareUrl = "xxxxx";
  }
  if (!stream) return res.status(400).json({ ok: false });
  res.json({ ok: true, stream });
}
export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
