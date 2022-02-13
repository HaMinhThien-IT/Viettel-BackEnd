import { authController } from './../controller/AuthController';
import { productController } from './../controller/ProductController';
const jwt = require("jsonwebtoken")
import { NextFunction, Request, Response, Router } from 'express';
import { orderController } from '../controller/OrderController';

const router = Router()
function Token(req: Request, res: Response, netx: NextFunction) {
    const authorizationHeader = req.header('authorization')
    if (!authorizationHeader) return res.status(401).send("Bạn chưa đăng nhập")
    try {
        jwt.verify(authorizationHeader, "jwt")    
        netx()
    } catch (error) {
        return res.status(401).send("Token đã hết vui lòng đăng nhập lại !")
    }
}
//product
router.get('/trademark', productController.getTrademark)
router.get('/color', productController.getListColor)
router.get('/ram', productController.getListRam)
router.post('/listProduct',Token, productController.getListProduct)
router.post('/addProductLine', productController.addPRoductLine)
router.get('/product/:product_id', productController.getProductDetail)
router.get('/listProductLine',Token, productController.getListProductLine)
router.put('/editProductLine/:product_id', productController.editProductLine)
router.post('/getProductsByID/:product_id',productController.getProductsById)
router.post('/addProductsByID/:product_id',productController.addProductsById)
router.post('/editProductsByID/:productsid',productController.editProductsById)
router.post('/removeProductsByID/:productsid',productController.deleteProduct)
//auth
router.post('/register',authController.register)
router.post('/login',authController.login)
router.get('/getMe',authController.getMe)
router.post('/checkTuoi',authController.checkTuoi)
// order
router.post('/getListCart',orderController.getListCart)
router.post('/addToCart',orderController.addToCart)
router.post('/checkout',orderController.checkOut)
router.post('/listCheckout',orderController.listCheckout)
export default router