import { generateRandomString } from "@/libs/utils/string";

import Prisma from "@/services/database";

import { User } from "./model";
import { parseUser } from "@/services/database/accounts/utils";

const UserSelect = {
  id: true,
  email: true,
  phone: true,
  accessToken: true,
  detail: {
    select: {
      name: true,
      imageUrl: true,
      company: true,
      gst: true,
    },
  },
};

export class UserService {
  static async getUserByEmail(email: string): Promise<Partial<User> | null> {
    const user = await Prisma.user.findUnique({
      where: { email },
      select: {
        ...UserSelect,
        password: true,
      },
    });

    return parseUser(user);
  }

  static async getUserById(id: number): Promise<Partial<User> | null> {
    const user = await Prisma.user.findUnique({
      where: { id },
      select: UserSelect,
    });

    return parseUser(user);
  }

  static async createUser(userData: User): Promise<Partial<User>> {
    const user = await Prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        accessToken: generateRandomString(30),
        detail: {
          create: {
            name: userData.name,
            company: userData.company,
            gst: userData.gst || "",
          },
        },
      },
      select: UserSelect,
    });

    return parseUser(user);
  }
}
