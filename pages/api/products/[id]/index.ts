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
    include: {
      user: {
        select: {
          //해당 필드만 가져옴
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  //연관검색어
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = await client.fav.findFirst({
    where: {
      productId: product?.id,
      userId: user?.id,
    },
  });
  res.json({ ok: true, product, isLiked, relatedProducts });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
