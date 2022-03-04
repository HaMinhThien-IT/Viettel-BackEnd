import { pool } from "../ConnectDB";
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CartModel } from "../model/Cart";
import { brand } from "../model/Brand";
class BrandService {
    getListBrand = async () => {
        const listBrand = await pool.query('select  * from trademark t')
        return listBrand.rows
    }
    addNewBrand = async (brand:brand) =>{
        console.log(`INSERT INTO public.trademark(trademark_id, name_trademark, image_trademark)VALUES('${brand.trademark_id}', '${brand.name_trademark}', '${brand.image_trademark}')`);
        
        await pool.query(`INSERT INTO public.trademark(trademark_id, name_trademark, image_trademark)VALUES('${brand.trademark_id}', '${brand.name_trademark}', '${brand.image_trademark}')`)
        const listBrand = await pool.query('select  * from trademark t')
        return listBrand.rows
    }
   
    updateBrand= async (brand:brand) => {
        
        await pool.query(`UPDATE public.trademark SET name_trademark='${brand.name_trademark}', image_trademark='${brand.image_trademark}' WHERE trademark_id='${brand.trademark_id}';
        `)
             
        const listBrand = await pool.query('select  * from trademark t')
        return listBrand.rows
    }
    onRemoveBrand= async (trademark_id:string) => {    
        await pool.query(`delete  from trademark  WHERE trademark_id='${trademark_id}'`);
        const listBrand = await pool.query('select  * from trademark t')
        return listBrand.rows
    }

}


export const brandService = new BrandService();