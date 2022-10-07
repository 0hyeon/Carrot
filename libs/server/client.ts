import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
}

const client = global.client || new PrismaClient(); //초기 global.client 없으면 new PrismaClient()생성

if (process.env.NODE_ENV === "development") global.client = client;

export default client;
