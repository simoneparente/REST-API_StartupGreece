import { Model, DataTypes } from 'sequelize';
import sequelize from '../data/db';


class Token extends Model{};

Token.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        expired: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
        
    {
        sequelize,
        modelName: 'Token',
        tableName: "Tokens",
        schema: "SG",
    }
);

export async function addToken(token: string): Promise<Token> {
    return Token.create({token, expired: false});
}

export async function invalidateToken(value: string): Promise<void> {
    const token = await Token.findOne({where: {token: value}});
    if(token){
        console.log("Invalidating token");
        token.set('expired', true);
        await token.save();
        console.log("Token invalidated");
    }
}

export default Token;