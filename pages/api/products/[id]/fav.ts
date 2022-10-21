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
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
    },
  });
  if (!product) return res.status(404).end();

  // const alreadyExists = await client.fav.findFirst({
  //   where: {
  //     productId: Number(id),
  //     userId: user?.id,
  //   },
  // });
  const alreadyExists = await client.record.findFirst({
    where: { productId: Number(id), userId: user?.id, kind: "Fav" },
  });
  if (alreadyExists) {
    await client.record.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    // await client.fav.create({
    //   data: {
    //     user: {
    //       connect: {
    //         id: user?.id,
    //       },
    //     },
    //     product: {
    //       connect: {
    //         id: Number(id),
    //       },
    //     },
    //   },
    // });
    await client.record.create({
      data: {
        user: { connect: { id: user?.id } },
        product: { connect: { id: Number(id) } },
        kind: "Fav",
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
