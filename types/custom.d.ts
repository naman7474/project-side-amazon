import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    user?: Record<string, any>;
  }
}
