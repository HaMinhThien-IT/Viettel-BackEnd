import express, { NextFunction, Request, response, Response } from 'express'
import { UserInfo } from 'os';
import { CartModel } from '../model/Cart';
import { order_user } from '../model/Checkout';


import { orderServies } from '../services/OrderServies';

class OrderController {
    addToCart =  async (req: Request, res: Response) => {
        const addToCartProps: CartModel = req.body.addToCartModel;
        const id_order = req.body.id_order
        addToCartProps.id_order = id_order
        res.json(await orderServies.addToCart(addToCartProps))
    }
    getListCart = async (req: Request, res: Response) => {
        const user_id = req.body.user_id
        res.json(await orderServies.getListCartById(user_id))
    }
    checkOut = async (req: Request, res: Response) => {
        const checkoutUser: order_user = req.body.checkoutUser;
        const user_id = req.body.user_id;
        const order_user_id = req.body.order_user_id;
        const statePayMent = req.body.statePayMent;
        const id_order = req.body.id_order;
        console.log(req.body);
        
        res.json(await orderServies.checkOut(checkoutUser,user_id,order_user_id,statePayMent,id_order))
    }

}

export const orderController = new OrderController()