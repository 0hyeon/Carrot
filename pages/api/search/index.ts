import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "POST") {
    const {
      body: { id },
    } = req;
    
    const terms = id?.split(" ").map((word :string) => ({
      name: {
        contains: word,
      },
    }));
    const searchs = await client.product.findMany({
      include: {
        records: {
          where: { kind: "Fav" },
        },
      },
      where: {
        OR: terms,
      },
    });
    
    res.json({
      ok: true,
      searchs,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET","POST"],
    handler,
  })
);
