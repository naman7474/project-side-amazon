// @ts-nocheck

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const config = {
  log: ["query", "info", "warn", "error"],
};

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(config);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(config);
  }
  prisma = global.prisma;
}

export default prisma;
