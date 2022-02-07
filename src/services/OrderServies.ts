import { pool } from "../ConnectDB";
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CartModel } from "../model/Cart";
import { order_user } from "../model/Checkout";
class OrderServies {
    addToCart = async (orderProduct: CartModel) => {
        const order_product_id = uuidv4()
        await pool.query(`
        DO $$ DECLARE
        BEGIN
        IF (select count(*) from order_product  where id_order = '${orderProduct.id_order}' and productsid ='${orderProduct.productsid}') > 0 then
        UPDATE public.order_product SET  quantity=quantity + ${orderProduct.quantity}   where id_order = '${orderProduct.id_order}' and productsid ='${orderProduct.productsid}';
        else 
        INSERT INTO public.order_product (order_product_id, id_order, productsid, quantity, price)VALUES('${order_product_id}', '${orderProduct.id_order}', '${orderProduct.productsid}', ${orderProduct.quantity}, ${orderProduct.price});
        END IF;
        END $$;
        `)
        return;
    }
    getListCartById = async (user_id: string) => {
        const id_order = uuidv4()
        let listCartTemp;
        let orderIdTemp;
        const time_order = new Date().toLocaleString('en-GB')
        const checkOrderIsTemp = await pool.query(`select * from "order" where user_id ='${user_id}' and istemporary = false `)
        if (user_id !== "") {
            if (checkOrderIsTemp.rows.length == 0) {
                console.log("insert"+checkOrderIsTemp.rows.length);
                
                await pool.query(`INSERT INTO public."order"(id_order, user_id, time_order, status_order, order_user_id, istemporary) VALUES('${id_order}', '${user_id}', '${time_order}',false,'', false);`)
            } else {
                console.log("get");
                orderIdTemp = await pool.query(`select o.id_order from "order" o  where user_id = '${user_id}'`)
                listCartTemp = await pool.query(`select op.productsid, p.image , op.quantity ,op.price ,pl.product_name , pc.color ,pr.ram ,t.name_trademark  from order_product op 
                join  "order" o  on op.id_order  = o.id_order 
                join products p on p.productsid  = op.productsid 
                join product_line pl on pl.product_id  = p.product_id 
                join product_color pc  on p.product_color_id  = pc.product_color_id 
                join product_ram pr  on p.product_ram_id  = pr.product_ram_id  
                join  buyuser b on b.user_id  = o.user_id
                join trademark t on t.trademark_id = pl.trademark_id 
                where  b.user_id ='${user_id}' and o.istemporary = false `)
            }
        }
        const listCart = listCartTemp?.rows
        const idOrder = orderIdTemp?.rows
        const user_oder = await pool.query(`select * from order_user ou where  user_id ='${user_id}'`)
        let id_orderUser;
        if (user_oder.rowCount < 1) {
            if (user_id !== "") {
                const id_order_user = uuidv4()
                await pool.query(`INSERT INTO public.order_user
                (order_user_id, sdt, name_order, user_id, address)
                VALUES('${id_order_user}', '', '', '${user_id}', '');
                `)
            }

        } else {
            id_orderUser = await pool.query(`select ou.order_user_id  from order_user ou where user_id ='${user_id}'
            `)
        }
        const id_order_user = id_orderUser?.rows
        return { listCart, idOrder, id_order_user }
    }
    checkOut = async (userOrder: order_user, user_id: string, order_user_id: string, statePayMent: boolean, id_order: string) => {
        if (statePayMent) {
            console.log("true "+statePayMent);
            console.log(`UPDATE public.order_user SET sdt='${userOrder.sdt}', name_order='${userOrder.name_order}', address='${userOrder.address}' WHERE user_id='${user_id}';
            `);
            
            // await pool.query(`UPDATE public.order_user SET sdt='${userOrder.sdt}', name_order='${userOrder.name_order}', address='${userOrder.address}' WHERE user_id='${user_id}';
            // `)
            console.log(`UPDATE public."order" SET istemporary=true,order_user_id='${order_user_id}' WHERE id_order='${id_order}';`);
            
           // await pool.query(`UPDATE public."order" SET istemporary=true,order_user_id='${order_user_id}' WHERE id_order='${id_order}';`)
        } else {
            console.log("false"+statePayMent);
            await pool.query(`UPDATE public."order" SET istemporary=true,order_user_id='${order_user_id}' WHERE id_order='${id_order}';`)
        }

    }

}


export const orderServies = new OrderServies();