import jwt from 'jsonwebtoken';
import User from '../model/User';
import Token from '../model/Token';
import { TokenExpiredError } from 'jsonwebtoken';

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

export const validToken = async (header: string): Promise<boolean> => {
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const foundToken = await Token.findOne({ where: { token } });
    if (foundToken) {
      return !foundToken.getDataValue('expired');
    } else {
      return true; 
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      await Token.update({ expired: true }, { where: { token } });
      return false;
    }
    return false;
  }
};

export const generateToken1sec = (user: any): string => {
  const payload = {
    id: user?.id,
    email: user?.email,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1s' });
};


export const generateToken5years = (user: any): string => {
  const payload = {
    id: user.getDataValue('id'),
    email: user.getDataValue('email'),
  };
  const token: string = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
  Token.create(
    { token,
      expirationDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
      expired: false });
  return token;
}