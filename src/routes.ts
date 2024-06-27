import { Router, Request, Response } from 'express';

import User, { register, login } from './model/User';

import { generateToken, generateToken1sec, validToken } from './security/authorization';

import { TokenExpiredError } from 'jsonwebtoken';
const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
    res.status(201).send("Endpoints available: <b>/api/register</b>, <b>/api/login</b>");
});

router.post("/api/register", async (req: Request, res: Response) => {
    try{
        const { username, email, password } = req.body;
        let checkUsername = await User.findOne({ where: { username } });
        let checkEmail = await User.findOne({ where: { email } });
        if (!checkUsername) {
            if (!checkEmail) {
                await register(username, email, password);
                res.status(201).send("User registered successfully");
            } else {
                res.status(400).send("Email already in use");
            }
        } else {
            res.status(400).send("Username already in use");
        }
    } catch (e) {
        console.log(e);
    }
});


router.post("/api/login", async (req : Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const successfulLogin = await login(user, password);
            if (successfulLogin) {
                res.set({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${generateToken(user)}`
                });
                res.status(200).json({ message: "Login successful"});
            } else {
                res.status(401).send("Invalid email or password");
            }
        } else {
            res.status(401).send("Invalid email or password");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Internal server error");
    }
});

//-------------------DA ELIMINARE-------------------
router.post("/api/login/1second", async (req : Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const successfulLogin = await login(user, password);
            if (successfulLogin) {
                res.set({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${generateToken1sec(user)}`
                });
                res.status(200).json({ message: "Login successful"});
            } else {
                res.status(401).send("Invalid email or password");
            }
        } else {
            res.status(401).send("Invalid email or password");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Internal server error");
    }
});

//---------------------------FINE DA ELIMINARE-------------------

router.get("/api/users",  async (req: Request, res: Response) => {
    try{
        let users = await User.findAll();
        let header = req.get('Authorization')
        if(validToken(header)){
            res.status(200).send(users);
        } else{
            res.status(401).send("Unauthorized");
        }
    } catch(tokenExpired : TokenExpiredError){
        res.status(401).send("Token expired");
    }
});

export default router;