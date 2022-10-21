import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;
  // const sales = await client?.record.findMany({ where: { userId: user?.id, kind: "Sale" }, include: { product: true } });
  const sales = await client.product.findMany({
    where: { records: { some: { userId: user?.id, kind: "Sale" } } },
    include: { records: { where: { kind: "Sale" } } },
  });
  res.json({ ok: true, sales });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
