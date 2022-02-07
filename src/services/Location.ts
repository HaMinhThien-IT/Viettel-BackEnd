import { pool } from "../ConnectDB";
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CartModel } from "../model/Cart";
class Location {
    getAddress = async () => {
        const listRam = await pool.query('select  * from product_ram pr ')
        return listRam.rows
    }
}


export const location = new Location();