import { pool } from "../ConnectDB";
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { ListPropsRegister } from "../model/ListProps";
class AuthServies {
    registerUser = async (user_id: string, email: string, password: string) => {
        await pool.query(`insert into buyuser (user_id,email,"password") values ('${user_id}','${email}','${password}')`)
        return;
    }
    login = async (user: ListPropsRegister) => {
        console.log("login");
        
        console.log(`select user_id from buyuser b  where  email='${user.email}' and "password" ='${user.password}'`);
        const user_id = await pool.query(`select user_id from buyuser b  where  email='${user.email}' and "password" ='${user.password}'`)
        return user_id.rows[0]
    }
    getMe = async (user_id: string) => {
        let infoMe = await pool.query(`select  *  from  buyuser b  where user_id ='${user_id}'`)
        return infoMe.rows[0]
    }

}


export const authServies = new AuthServies();