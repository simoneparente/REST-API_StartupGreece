import { Sequelize } from 'sequelize';


const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/postgres');

export default sequelize;


export async function connect() {
    if(!(await sequelize.showAllSchemas({logging: console.log}))) {
        console.log("Schema does not exist. Creating schema...");
        await sequelize.createSchema('SG', {logging: console.log});
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