import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Kind } from "@prisma/client";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { kind },
  } = req;

  const KindValue = (kind: string) => {
    if (kind === "fav") return "Fav";
    if (kind === "purchase") return "Purchase";
    if (kind === "sale") return "Sale";
  };

  const refactoring = await client.product.findMany({
    where: {
      records: { some: { userId: user?.id, kind: KindValue(kind as Kind) } },
    },
    include: {
      records: { where: { kind: "Fav" } },
    },
  });
  res.json({ ok: true, [kind as string]: refactoring });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
