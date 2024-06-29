import { Sequelize } from 'sequelize';

const DB_URL  = process.env.DB_URL;


if (!DB_URL) {
    throw new Error("Missing DB_URL in environment variables");
}

const sequelize = new Sequelize(DB_URL);

export default sequelize;


export async function connect() {
    if(!(await sequelize.showAllSchemas({logging: console.log}))) {
        console.log("Schema does not exist. Creating schema...");
        await sequelize.createSchema('SG', {logging: () => {}});
    }
    try {
        await sequelize.sync()
        .then(() => {
            sequelize.authenticate();
        })
        .then(() => {
            console.log("Connection established successfully.");
        });
    } catch (error) {
        console.error("Unable to connect to the database. Error: ", error);
    }
}

export async function close() {
    await sequelize.close();
}


export async function clearData(){
    await sequelize.drop();
}