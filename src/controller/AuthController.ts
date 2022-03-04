import { authServies } from './../services/AuthServies';
import { ListPropsRegister } from './../model/ListProps';

import express, { NextFunction, Request, response, Response } from 'express'

import { v4 as uuidv4 } from 'uuid';
import { User } from '../model/BuyUser';
const jwt = require("jsonwebtoken")
class AuthController {
    register = async (req: Request, res: Response) => {
        const user_id = uuidv4()
        const registerProps: ListPropsRegister = req.body;
        const { email, password } = registerProps
        res.json(await authServies.registerUser(user_id, email, password))
    }
    login = async (req: Request, res: Response) => {
        const registerProps: ListPropsRegister = req.body;
        const user_Id = await authServies.login(registerProps)
        if (user_Id != undefined) {
            const accSessToken = jwt.sign(user_Id, "jwt", { expiresIn: '30000s' })
            res.header('jwt', accSessToken).send(accSessToken)
        } else {
            const response = {
                status: 404
            }
            return res.status(404).json(response)
        }
    }
    getMe = async (req: Request, res: Response, netx: NextFunction) => {

        const authorizationHeader = req.header('authorization')
        if (!authorizationHeader) return res.status(202).send("Ban chua dang nhap")
        try {
            let test = jwt.verify(authorizationHeader, "jwt")

            return res.json(await authServies.getMe(test.user_id))
        } catch (error) {
            //  return res.status(401).send("login that bai")
        }

    }
    checkTuoi = async (req: Request, res: Response) => {
        const age:number= req.body.age
        const name:string= req.body.name
        res.json(await authServies.checkTuoi(name,age))
    }
    getListUser = async (req: Request, res: Response) => {
        res.json(await authServies.getListUser())
    }
    addNewUser = async (req: Request, res: Response) => {
        const user_id = uuidv4()
        const userNew: User = req.body;
        userNew.user_id = user_id;
        res.json(await authServies.addNewUser(userNew))
    }
    updateUserById = async (req: Request, res: Response) => {
        const user_id = req.params.user_id
        const user: User = req.body;
        user.user_id = user_id;
        res.json(await authServies.updateUser(user))
    }
    deleteUserById  = async (req: Request, res: Response) => {
        const user_id = req.params.user_id 
        res.json(await authServies.onRemoveUser(user_id))
    }
     
}

export const authController = new AuthController()