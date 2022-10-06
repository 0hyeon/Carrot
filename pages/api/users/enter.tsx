import mail from "@sendgrid/mail";
import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

mail.setApiKey(process.env.SENDGRID_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;

  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });

  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          //유저를 찾고, 찾지못한다면 생성.

          //connect는 새로운 토큰을 이미존재하는 유저와 연결,
          //create는 새로운 token을 만들면서 새로운 user도 만들지

          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  console.log(token);

  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to:process.env.MY_PHONE!,
    //   body:`Your login token is ${payload}`
    // })
    // console.log(message);
  } else if (email) {
    // const email = await mail.send({
    //   from: process.env.MAIL_ID!,
    //   to: "djdjdjk2006@naver.com",
    //   subject: "캐럿마켓 이메일 인증",
    //   text: `캐럿마켓 인증번호를 화면에 입력해주세요.`,
    //   html: `캐럿마켓 인증번호 ${payload}를 화면에 입력해주세요.`,
    // })
    // console.log(email);
  }
  return res.json({
    ok: true,
  });
}

export default withHandler({ method: "POST", handler, isPrivate: false });
