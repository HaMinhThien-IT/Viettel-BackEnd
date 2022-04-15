import { slide } from './../model/Brand';
import { pool } from "../ConnectDB";
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CartModel } from "../model/Cart";
class SlideServies {
    getAddress = async () => {
        const listRam = await pool.query('select  * from product_ram pr ')
        return listRam.rows
    }
    addNewImageSlide =async (slide:slide) =>{
        const slideImage = await pool.query(`INSERT INTO public.image_slide(image_slide_id, image_slide) VALUES('${slide.image_slide_id}', '${slide.image_slide}');
        `)
        return slideImage.rows
       

    }
}


export const slideServies = new SlideServies();