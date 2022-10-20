//     include: {
//       product: {
//         include: {
//           _count: {
//             select: {
//               records: {
//                 where: {
//                   kind: { equals: "Fav" },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });
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

  const refactoring = await client.record.findMany({
    where: {
      userId: user?.id,
      kind: kind as Kind,
    },
    // include: {
    //   product: true,
    // },
    include: {
      product: {
        include: {
          _count: {
            select: {
              //   records: {
              //     where: { kind: "Fav" },
              //   },
              records: true,
            },
          },
        },
      },
    },
  });
  res.json({
    ok: true,
    refactoring,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
