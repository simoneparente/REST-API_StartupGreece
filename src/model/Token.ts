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
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true
            }
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

export async function addToken(token: string, expirationDate: Date): Promise<Token> {
    return Token.create({token, expirationDate, expired: false});
}

export async function invalidateToken(token: Token): Promise<void> {
    token.setDataValue('expired', true);
    await token.save();
}

export default Token;