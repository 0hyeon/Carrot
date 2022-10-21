import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;
  // const purchases = await client.purchase.findMany({
  //   where: {
  //     userId: user?.id,
  //   },
  //   include: {
  //     product: {
  //       include: {
  //         _count: {
  //           select: {
  //             favs: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  const purchases = await client.product.findMany({
    where: { records: { some: { userId: user?.id, kind: "Purchase" } } },
    include: { records: { where: { kind: "Purchase" } } },
  });
  res.json({
    ok: true,
    purchases,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
