import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;
  // const favs = await client?.record.findMany({ where: { userId: user?.id, kind: "Fav" }, include: { product: true } });
  const favs = await client.product.findMany({
    where: { records: { some: { userId: user?.id, kind: "Fav" } } },
    include: { records: { where: { kind: "Fav" } } },
  });
  res.json({ ok: true, favs });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
