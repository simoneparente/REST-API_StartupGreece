import jwt from 'jsonwebtoken';
import User from '../model/User';
import Token from '../model/Token';


const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("Missing SECRET_KEY in environment variables");
}

export const generateToken = (user: User): string => {
  const payload = {
    id: user.getDataValue('id'),
    email: user.getDataValue('email'),
  };
  const token: string = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
  Token.create(
    { token,
      expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      expired: false });
  return token;
};

export const validToken = (header : string) => {
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