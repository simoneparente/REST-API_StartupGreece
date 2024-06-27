import { Model, DataTypes } from 'sequelize';
import sequelize from '../data/db';
import { encrypt, compare } from '../security/encryption';


class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [4, 255]
            },

        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 255],
            },
            get(){
                const rawValue = this.getDataValue('password');
                return rawValue ? rawValue.toUpperCase() : null;
            }
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: "Users",
        schema: "SG",
    }
);


export async function register(username: string, email: string, password: string) {
    encrypt(password).then((hash) => {
        return User.create({username, email, password: hash});
    }
)}

export async function login(user: User, password: string): Promise<boolean> {
    const storedPassword = user.getDataValue('password');
    const result = await compare(password, storedPassword);
    return result;
}

export default User;