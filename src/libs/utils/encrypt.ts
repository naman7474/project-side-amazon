import bcrypt from "bcryptjs";

const hash = "$2b$10$QQ3FaR3NRCwwOLw4G0ZuIe";

export const encrypt = async (password: string): Promise<string> =>
  bcrypt.hash(password, hash);
