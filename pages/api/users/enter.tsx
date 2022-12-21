import mail from "@sendgrid/mail";
import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

mail.setApiKey(process.env.SENDGRID_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;// { email: 'djdjdjk2006@naver.com'}

  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {//where 속성에서는 해당 조건을 만족하는 지 검색 후, 
            ...user,
          },
          create: {//있다면 연결하고, 없다면 create 속성 내부의 name,user를 만들어 준다.
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      // to: process.env.MY_PHONE as string,
      to: phone,
      body: `Your login token is ${payload}.`,
    });
    console.log(message);
  } else if (email) {
    const email = await mail.send({
      from: "djdjdjk2006@naver.com",
      to: "djdjdjk2002@gmail.com",
      subject: "Your Carrot Market Verification Email",
      text: `Your token is ${payload}`,
      html: `<strong>Your token is ${payload}</strong>`,
    });
    console.log("email : ",email);
  }
  return res.json({
    ok: true,
    token,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
