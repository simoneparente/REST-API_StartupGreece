import './setup'
import express, { Express } from 'express';
import router from './routes'

import { connect, clearData } from './data/db';


const app: Express = express();
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

app.use(express.json());
app.use("/", router);

connect();
clearData().then(() =>console.log("Data cleared"));