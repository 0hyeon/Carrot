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
  } = req;
  const post = await client.post.findUnique({
    where: {
      //   id: Number(id),
      id: Number(id),
    },
    include: {
      //   user: true,//유저 전체를 가져옴
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          answer: true,
          wondering: true,
        },
      },
    },
  });
  if (!post) res.status(404).json({ ok: false, error: "Not found post" });
  res.json({
    ok: true,
    post,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
