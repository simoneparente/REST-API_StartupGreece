import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'


const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("Missing SECRET_KEY in environment variables");
}

export const generateToken = (user: any): string => {
  const payload = {
    id: user?.id,
    email: user?.email,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const validToken = (header) => {
  const token = header.split(' ')[1];
  return jwt.verify(token, SECRET_KEY);
};

export const generateToken1sec = (user: any): string => {
  const payload = {
    id: user?.id,
    email: user?.email,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1s' });
};