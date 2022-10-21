import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //   const { name, price, description } = req.body;
  //   const { user } = req.session;
  if (req.method === "GET") {
    // const products = await client.product.findMany({
    //   include: {
    //     _count: {
    //       select: {
    //         //해당필드만 가져옴.
    //         favs: true, //이렇게하면, product자신이 가지고있는 favs의 갯수가 출력됨
    //       },
    //     },
    //   },
    // });
    const products = await client.product.findMany({
      include: {
        records: {
          where: { kind: "Fav" },
        },
      },
    });
    return res.json({
      ok: true,
      products,
    });
  }

  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: "xx",
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
