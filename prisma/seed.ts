import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
}

const client = new PrismaClient();

[...Array.from(Array(500).keys())];
