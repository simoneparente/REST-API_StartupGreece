import { Request, Response } from "express";
import User, { register, login } from '../model/User';
import Token, {invalidateToken} from "../model/Token";
import { generateToken, validateToken} from '../security/authorization';


export async function authRegister(req: Request, res: Response){
    if(!req.body.email || !req.body.password || req.body === undefined) 
        return res.status(400).send("Bad request");
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
        console.error('Error during registration:', e);
        res.status(500).send("Internal server error");
    }
}

export async function authLogin(req: Request, res: Response){
    if(!req.body.email || !req.body.password || req.body === undefined) 
        return res.status(400).send("Bad request");

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
}

export async function authLogout(req: Request, res: Response){
    const header = req.get('Authorization');
    if(!header) return res.status(401).send("Unauthorized");
    if(await validateToken(header)){
        const token = header.split(' ')[1];
        await invalidateToken(token);
        res.status(200).send("Token Unauthorized successfully");
    } else{
        res.status(401).send("Unauthorized");
    }
}


export async function getUsers(req: Request, res: Response){
    let users = await User.findAll();
    let header = req.get('Authorization')
    if(!header) return res.status(401).send("Unauthorized");
    if(await validateToken(header)){
        res.status(200).send(users);
    } else{
        res.status(401).send("Unauthorized");
    }
}

export async function getTokens(req: Request, res: Response){
    let tokens = await Token.findAll();
    res.status(200).send(tokens);
}
