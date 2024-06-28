import { Router, Request, Response } from 'express';

import User, { register, login } from './model/User';

import Token from './model/Token';

import { generateToken, generateToken1sec, generateToken5years, validToken,  } from './security/authorization';


import { invalidateToken } from './model/Token';


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
                const token = generateToken(user);

                res.set({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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

router.post("/api/logout"), async (req: Request, res: Response) => {
    const header = req.get('Authorization');
    if(await validToken(header)){
        invalidateToken(header);
        res.status(200).send("Logout successful");
    } else{
        res.status(401).send("Unauthorized");
    }
}

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

router.post("/api/login/5years", async (req : Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const successfulLogin = await login(user, password);
            if (successfulLogin) {
                res.set({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${generateToken5years(user)}`
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
        let users = await User.findAll();
        let header = req.get('Authorization')
        if(await validToken(header)){
            res.status(200).send(users);
        } else{
            res.status(401).send("Unauthorized");
        }
});

router.get("/api/Tokens", async (req: Request, res: Response) => {
    let tokens = await Token.findAll();
    res.status(200).send(tokens);
});


export default router;