import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });
    res.json({
      ok: true,
      profile,
    });
  }
  if (req.method === "POST") {
    //edit 이메일 수정
    const {
      session: { user },
      body: { email, phone, name, avatarId },
      //세션에 유저가 사용하는 메일과 같은 이메일이 넘어오면
      //req.body의 이메일과, req.session.user의 이메일이 같은지를 비교
    } = req;
    const currentUser = await client.user.findUnique({
      //현재 user id
      where: {
        id: user?.id,
      },
    });
    if (email && email !== currentUser?.email) {
      //넘어온 이메일과 현재 이메일이 다를경우만
      //이메일 업데이트할경우
      const alreadyExists = Boolean(
        //Boolean?
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "이미 사용 중인 이메일입니다.",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
      res.json({ ok: true });
    }
    if (phone && phone !== currentUser?.phone) {
      //핸드폰 업데이트할경우
      const alreadyExists = Boolean(
        //Boolean?
        await client.user.findUnique({
          where: {
            phone,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "이미 사용 중인 번호입니다.",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
      res.json({ ok: true });
    }
    if (name) {
      //이메일이나 폰번호처럼 중복가능하여 유일하지 않아도 됨
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      });
    }
    if(avatarId){
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar:avatarId,
        },
      });
    }
    res.json({
      //email phone둘다 안바뀐경우 그냥 의미없는 true만
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
