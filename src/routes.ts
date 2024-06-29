import { Router, Request, Response } from 'express';
import { authRegister, authLogin, authLogout, getUsers, getTokens,  } from './controller/authController';




const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
    res.status(201)
    .send("Endpoints available:</br>"  +
          "POST <b>/api/register</b>, <b>/api/login</b>, <b>/api/logout</b>,</br>"
        + "GET  <i>/api/users</i>, <b>/api/Tokens</b>");
});

//-------------------POST-------------------

router.post("/api/register", authRegister);

router.post("/api/login", authLogin);

router.post("/api/logout", authLogout);

//-------------------GET-------------------

router.get("/api/users", getUsers);

router.get("/api/tokens", getTokens);


export default router;