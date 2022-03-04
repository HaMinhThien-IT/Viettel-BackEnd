import { ListPropsEditProduct, ListPropsProduct } from './../model/ListProps';

import express, { NextFunction, Request, response, Response } from 'express'
import { ListProps } from '../model/ListProps'
import { AddProductWithDetail, ProductLine, Products } from '../model/Product'
import { servicesProduct } from "../services/ServicesProduct"
import { v4 as uuidv4 } from 'uuid';

class ProductController {

    getListProduct = async (req: Request, res: Response) => {
        const listPropsProduct: ListPropsProduct = req.body;
        const { page, pagesize, name, orderBy, from, to } = listPropsProduct
        console.log(req.body);
        res.json(await servicesProduct.getListProductWithPagination(page, pagesize, name, orderBy, from, to))
    }
   
    addPRoductLine = async (req: Request, res: Response) => {
        const product_idV4 = uuidv4();
        const addLineProps: ProductLine = req.body;
        addLineProps.product_id = product_idV4
        addLineProps.createAt = new Date().toLocaleString('en-GB')
        addLineProps.updateAt = new Date().toLocaleString('en-GB')
        res.json(await servicesProduct.addProductLine(addLineProps))
    }
    addProductsById = async (req: Request, res: Response) => {
        const product_id = req.params.product_id
        const productsIdV4 = uuidv4();
        const addProducsProps: Products = req.body;
        addProducsProps.product_id = product_id
        addProducsProps.productsId = productsIdV4
 
        res.json(await servicesProduct.addProduct(addProducsProps))
    }
    editProductsById = async (req: Request, res: Response) => {
        const product_id = req.params.productsid
        const editProduct: Products = req.body;
        editProduct.productsId = product_id
        res.json(await servicesProduct.editProductsById(editProduct))
    }
    getTrademark = async (req: Request, res: Response) => {
        res.json(await servicesProduct.getTrademark())
    }
    getProductDetail = async (req: Request, res: Response) => {
        let product_id = String(req.params.product_id)
        console.log(product_id);
        res.json(await servicesProduct.getDetailProduct(product_id))
    }
    getListProductLine = async (req: Request, res: Response) => {
        res.json(await servicesProduct.getProductLine())
    }
    editProductLine = async (req: Request, res: Response) => {
        const editLineProps: ListPropsEditProduct = req.body;
        const product_id = req.params.product_id
        const { product_name, trademark_id, createat } = editLineProps
        editLineProps.updateat = new Date().toLocaleString('en-GB')
        res.json(await servicesProduct.updateProductLine(product_id, product_name, trademark_id, createat, editLineProps.updateat))
    }
    
    getProductsById = async (req: Request, res: Response) => {
        const product_id = req.params.product_id;
        res.json(await servicesProduct.getProductsById(product_id))
    }
    getListColor = async (req: Request, res: Response) => {
        res.json(await servicesProduct.getListColor())
    }
    getListRam = async (req: Request, res: Response) => {
        res.json(await servicesProduct.getListRam())
    }
    deleteProduct  = async (req: Request, res: Response) => {
        const productIds = req.params.productsid
        const product_id= req.body.product_id
        res.json(await servicesProduct.deleteProduct(productIds,product_id))
    }
    getRelatedProducts = async (req: Request, res: Response) => {
        const trademark_id = req.body.trademark_id
        console.log("kkkkkkkkkkkkk",trademark_id);
        res.json(await servicesProduct.getRelatedProducts(trademark_id))
    }
   
}

export const productController = new ProductController()