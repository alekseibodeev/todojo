import dotenv from 'dotenv';

dotenv.config();

export const config: {
  port: number;
  tokenSecret: string;
  tokenExpires: number;
} = {
  port: Number(process.env.PORT),
  tokenSecret: process.env.JWT_SECRET_KEY!,
  tokenExpires: Number(process.env.JWT_EXPIRES_IN),
};
