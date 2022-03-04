import { authServies } from './../services/AuthServies';
import { ListPropsRegister } from './../model/ListProps';

import express, { NextFunction, Request, response, Response } from 'express'

import { v4 as uuidv4 } from 'uuid';
import { brandService } from '../services/BrandServies';
import { brand } from '../model/Brand';
const jwt = require("jsonwebtoken")
class BrandController {
    getList = async (req: Request, res: Response) => {   
        res.json(await brandService.getListBrand())
    }
    addNewBrand = async (req: Request, res: Response) => {
        const trademark_id = uuidv4()
        const brandNew: brand = req.body;
        brandNew.trademark_id = trademark_id;
        res.json(await brandService.addNewBrand(brandNew))
    }
    updateBrandById = async (req: Request, res: Response) => {
        const trademark_id = req.params.trademark_id
        const brandUpdate: brand = req.body;
        brandUpdate.trademark_id = trademark_id;
        res.json(await brandService.updateBrand(brandUpdate))
    }
    deleteBrandById  = async (req: Request, res: Response) => {
        const trademark_id = req.params.trademark_id
        res.json(await brandService.onRemoveBrand(trademark_id))
    }

}

export const brandController = new BrandController()