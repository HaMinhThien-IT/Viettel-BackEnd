import { pool } from "../ConnectDB";
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { ListPropsRegister } from "../model/ListProps";
import { response } from "express";
import { User } from "../model/BuyUser";
class AuthServies {
    registerUser = async (user_id: string, email: string, password: string) => {
        await pool.query(`insert into buyuser (user_id,email,"password",role) values ('${user_id}','${email}','${password}','user')`)
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
    checkTuoi(name:string ,age:number){
        let a:string = `${name} oi, Ban du tuoi !`
        let b:string = `${name} oi, Ban khong co tuoi !`
        if(age >= 18){
            return a
        }else{
            return b
        }
    }
    getListUser = async () => {
        const listUser = await pool.query(`select * from buyuser`)
        return listUser.rows
    }
    addNewUser = async (user:User) => {
        await pool.query(`insert into buyuser (user_id,name_user,email,phone,"password",role) values ('${user.user_id}','${user.name_user}','${user.email}','${user.phone}','${user.password}','user')`)
        const listUser = await pool.query(`select * from buyuser`)
        return listUser.rows
    }
    updateUser = async (user:User) => {
        
        await pool.query(`UPDATE public.buyuser SET  name_user='${user.name_user}', email='${user.email}', phone='${user.phone}', "password"='${user.password}', "role"='${user.role}' where user_id = '${user.user_id}'`)
             
        const listUser = await pool.query(`select * from buyuser`)
        return listUser.rows
    }
    onRemoveUser = async (userId:string) => {
        console.log(`delete  from buyuser  where user_id = '${userId}'`);
        
        await pool.query(`delete  from buyuser  where user_id = '${userId}'`)
        const listUser = await pool.query(`select * from buyuser`)
        return listUser.rows
    }

}


export const authServies = new AuthServies();