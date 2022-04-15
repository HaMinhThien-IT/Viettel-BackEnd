import { authServies } from './../services/AuthServies';
import { ListPropsRegister } from './../model/ListProps';

import express, { NextFunction, Request, response, Response } from 'express'

import { v4 as uuidv4 } from 'uuid';
import { brandService } from '../services/BrandServies';
import { brand, slide } from '../model/Brand';
import { slideServies } from '../services/SlideServies';

class SlideController {
    addNewSlide = async (req: Request, res: Response) => {
        const image_slide_id = uuidv4()
        const slideProps: slide = req.body;
        slideProps.image_slide_id = image_slide_id;
        console.log(req);
        
        
        res.json(await slideServies.addNewImageSlide(slideProps))
    }

}

export const slideController = new SlideController()