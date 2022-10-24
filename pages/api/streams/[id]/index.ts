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

  const stream = client.stream.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json({
    ok: true,
    stream,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
