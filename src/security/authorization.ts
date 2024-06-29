import jwt, { TokenExpiredError} from 'jsonwebtoken';
import User from '../model/User';
import Token from '../model/Token';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("Missing SECRET_KEY in environment variables");
}

export const validateToken = async (header: string): Promise<boolean> => {
  if (!header) { return false;}
  if(!header.startsWith('Bearer ')) { return false; }

  const token = header.split(' ')[1];

  try {
    jwt.verify(token, SECRET_KEY);
    const isTokenInDB = await Token.findOne({ where: { token } });
    if(!isTokenInDB) { return false; }
    return !isTokenInDB.getDataValue('expired');
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      await Token.update({ expired: true }, { where: { token } });
    }
    return false;
  }
};

export function generateToken(user: User) {
  const payload = {
    id: user.getDataValue('id'),
    email: user.getDataValue('email'),
  };
  const token : string = jwt.sign(payload, SECRET_KEY);
  Token.create(
    { token,
      expired: false 
    });
  return token;
}