import dotenv from "dotenv";

dotenv.config();

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY must be defined in environment variables");
}

export const SECRET_KEY: string = process.env.SECRET_KEY;