import { pool } from "../ConnectDB";
import { QueryResult } from "pg";
import { v4 as uuidv4 } from "uuid";
import { CartModel } from "../model/Cart";
import { order_user } from "../model/Checkout";
import { OrderWithAdmin, OrderWithDetail } from "../model/Order";
var nodemailer = require("nodemailer");
class OrderServies {
  addToCart = async (orderProduct: CartModel) => {
    const order_product_id = uuidv4();
    await pool.query(`
        DO $$ DECLARE
        BEGIN
        IF (select count(*) from order_product  where id_order = '${orderProduct.id_order}' and productsid ='${orderProduct.productsid}') > 0 then
        UPDATE public.order_product SET  quantity_order=quantity_order + ${orderProduct.quantity}   where id_order = '${orderProduct.id_order}' and productsid ='${orderProduct.productsid}';
        else 
        INSERT INTO public.order_product (order_product_id, id_order, productsid, quantity_order, price)VALUES('${order_product_id}', '${orderProduct.id_order}', '${orderProduct.productsid}', ${orderProduct.quantity}, ${orderProduct.price});
        END IF;
        END $$;
        `);
    return;
  };
  getListCartById = async (user_id: string) => {
    let idOrder: string = uuidv4();
    let listCartTemp;
    let orderIdTemp;
    const time_order = new Date().toLocaleString("en-GB");
    const checkOrderIsTemp = await pool.query(
      `select * from "order" where user_id ='${user_id}' and istemporary = false `
    );
    if (user_id !== "") {
      if (checkOrderIsTemp.rows.length == 0) {
        await pool.query(
          `INSERT INTO public."order"(id_order, user_id, time_order, status_order, order_user_id, istemporary) VALUES('${idOrder}', '${user_id}', '${time_order}',false,'', false);`
        );
      } else {
        console.log(
          `select o.id_order from "order" o  where o.user_id = '${user_id}' and istemporary = false `
        );
        orderIdTemp = await pool.query(
          `select o.id_order from "order" o  where o.user_id = '${user_id}' and istemporary = false `
        );
        listCartTemp =
          await pool.query(`select op.productsid, p.image , op.quantity_order ,op.price ,pl.product_name , pc.color ,pr.ram ,t.name_trademark  from order_product op 
                join  "order" o  on op.id_order  = o.id_order 
                join products p on p.productsid  = op.productsid 
                join product_line pl on pl.product_id  = p.product_id 
                join product_color pc  on p.product_color_id  = pc.product_color_id 
                join product_ram pr  on p.product_ram_id  = pr.product_ram_id  
                join  buyuser b on b.user_id  = o.user_id
                join trademark t on t.trademark_id = pl.trademark_id 
                where  b.user_id ='${user_id}' and o.istemporary = false `);

        idOrder = orderIdTemp?.rows as any;
      }
    }

    const listCart = listCartTemp?.rows;
    const user_oder = await pool.query(
      `select * from order_user ou where  user_id ='${user_id}'`
    );
    let id_orderUser;
    if (user_oder.rowCount < 1) {
      if (user_id !== "") {
        const id_order_user = uuidv4();
        await pool.query(`INSERT INTO public.order_user
                (order_user_id, sdt, name_order, user_id, address)
                VALUES('${id_order_user}', '', '', '${user_id}', '');
                `);
      }
    } else {
      id_orderUser =
        await pool.query(`select ou.order_user_id  from order_user ou where user_id ='${user_id}'
            `);
    }
    const id_order_user = id_orderUser?.rows;
    console.log(listCart);

    return { listCart, idOrder, id_order_user };
  };
  checkOut = async (
    userOrder: order_user,
    user_id: string,
    order_user_id: string,
    statePayMent: boolean,
    id_order: string
  ) => {
    if (statePayMent) {
      console.log("true " + statePayMent);
      console.log(`UPDATE public.order_user SET sdt='${userOrder.sdt}', name_order='${userOrder.name_order}', address='${userOrder.address}' WHERE user_id='${user_id}';
            `);

      await pool.query(`UPDATE public.order_user SET sdt='${userOrder.sdt}', name_order='${userOrder.name_order}', address='${userOrder.address}' WHERE user_id='${user_id}';
            `);
      console.log(
        `UPDATE public."order" SET istemporary=true,order_user_id='${order_user_id}' WHERE id_order='${id_order}';`
      );

      await pool.query(
        `UPDATE public."order" SET istemporary = true,order_user_id='${order_user_id}' WHERE id_order='${id_order}';`
      );
    } else {
      console.log("false" + statePayMent);
      await pool.query(
        `UPDATE public."order" SET istemporary=true,order_user_id='${order_user_id}' WHERE id_order='${id_order}';`
      );
    }
  };
  listCheckOut = async (user_id: string, pageSize: number, page: number) => {
    let listOrderUser: QueryResult =
      await pool.query(`select  * from "order" o  join order_product op  on op.id_order  = o.id_order  join buyuser b on b.user_id  = o.user_id join order_user ou  on ou.user_id  = b.user_id 
        join  products p  on p.productsid  = op.productsid  join product_line pl on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id = p.product_ram_id  join product_color pc on pc.product_color_id = p.product_color_id 
        where o.id_order in(select id_order  from "order" where user_id = '${user_id}' and isTemporary = true group by id_order LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize})`);
    console.log(`select  * from "order" o  join order_product op  on op.id_order  = o.id_order  join buyuser b on b.user_id  = o.user_id join order_user ou  on ou.user_id  = b.user_id 
        join  products p  on p.productsid  = op.productsid  join product_line pl on pl.product_id  = p.product_id 
        where o.id_order in(select id_order  from "order" where user_id = '${user_id}' and isTemporary = true group by id_order`);

    let totalQuantityProduct = await pool.query(
      `select id_order  from "order" where user_id = '${user_id}' and isTemporary = true group by id_order`
    );
    let getAll = listOrderUser.rows;
    let ListProduct: OrderWithDetail[] = [];
    let allId: string[] = [];
    getAll.map((item) => allId.push(item.id_order));
    allId = Array.from(new Set(allId));
    allId.map((id_order) => {
      const order: OrderWithDetail = {
        id_order: id_order,
        user_id: user_id,
        isTemporary: false,
        status_order: false,
        time_order: "02-02-2002",
        orderProducts: [],
        user: {
          name_order: "",
          address: "",
          sdt: "",
          order_user_id: "",
        },
      };
      getAll.map((itemTemp) => {
        if (itemTemp.id_order === id_order) {
          (order.id_order = itemTemp.id_order),
            (order.user_id = itemTemp.user_id),
            (order.isTemporary = itemTemp.istemporary),
            (order.status_order = itemTemp.status_order),
            (order.time_order = itemTemp.time_order),
            order.orderProducts.push({
              id_order: itemTemp.id_order,
              productsid: itemTemp.productsid,
              quantity: itemTemp.quantity_order,
              price: itemTemp.price,
              productLine: {
                product_id: itemTemp.product_id,
                createAt: itemTemp.createat,
                updateAt: itemTemp.updateat,
                product_name: itemTemp.product_name,
                trademark_id: itemTemp.trademark_id,
              },
              products: {
                image: itemTemp.image,
                price_product: itemTemp.price,
                product_color_id: itemTemp.product_color_id,
                product_ram_id: itemTemp.product_ram_id,
                quantity: itemTemp.quantity,
                productsId: itemTemp.productsid,
                product_id: itemTemp.product_id,
                color: itemTemp.color,
                ram: itemTemp.ram,
              },
            });
          (order.user.name_order = itemTemp.name_order),
            (order.user.order_user_id = itemTemp.order_user_id),
            (order.user.sdt = itemTemp.sdt),
            (order.user.address = itemTemp.address);
        }
      });
      ListProduct.push(order);
    });
    let pagination = Math.ceil(
      Number(totalQuantityProduct.rowCount) / pageSize
    );
    console.log(pagination);

    return { ListProduct, pagination };
  };

  listCheckOutAdmin = async () => {
    let listOrderUser: QueryResult = await pool.query(`
        select  * from "order" o  join order_product op  on op.id_order  = o.id_order  join buyuser b on b.user_id  = o.user_id join order_user ou  on ou.user_id  = b.user_id 
                join  products p  on p.productsid  = op.productsid  join product_line pl on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id = p.product_ram_id  join product_color pc on pc.product_color_id = p.product_color_id 
                where isTemporary = true`);
    let getAll = listOrderUser.rows;
    let ListProduct: OrderWithAdmin[] = [];
    let allId: string[] = [];
    getAll.map((item) => allId.push(item.id_order));
    allId = Array.from(new Set(allId));
    allId.map((id_order) => {
      const order: OrderWithAdmin = {
        email: "",
        id_order: id_order,
        user_id: "",
        isTemporary: false,
        status_order: false,
        time_order: "02-02-2002",
        orderProducts: [],
        user: {
          name_order: "",
          address: "",
          sdt: "",
          order_user_id: "",
        },
      };
      getAll.map((itemTemp) => {
        if (itemTemp.id_order === id_order) {
          order.email = itemTemp.email;
          (order.id_order = itemTemp.id_order),
            (order.user_id = itemTemp.user_id),
            (order.isTemporary = itemTemp.istemporary),
            (order.status_order = itemTemp.status_order),
            (order.time_order = itemTemp.time_order),
            order.orderProducts.push({
              id_order: itemTemp.id_order,
              productsid: itemTemp.productsid,
              quantity: itemTemp.quantity_order,
              price: itemTemp.price,
              productLine: {
                product_id: itemTemp.product_id,
                createAt: itemTemp.createat,
                updateAt: itemTemp.updateat,
                product_name: itemTemp.product_name,
                trademark_id: itemTemp.trademark_id,
              },
              products: {
                image: itemTemp.image,
                price_product: itemTemp.price,
                product_color_id: itemTemp.product_color_id,
                product_ram_id: itemTemp.product_ram_id,
                quantity: itemTemp.quantity,
                productsId: itemTemp.productsid,
                product_id: itemTemp.product_id,
                color: itemTemp.color,
                ram: itemTemp.ram,
              },
            });
          (order.user.name_order = itemTemp.name_order),
            (order.user.order_user_id = itemTemp.order_user_id),
            (order.user.sdt = itemTemp.sdt),
            (order.user.address = itemTemp.address);
        }
      });
      ListProduct.push(order);
    });
    return ListProduct;
  };
  updateStatusOrder = async (
    id_order: string,
    email: string,
    nameUser: string,
    cart: OrderWithAdmin
  ) => {
    await pool
      .query(
        `UPDATE public."order" SET status_order=true WHERE id_order='${id_order}';`
      )
      .then(() => {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "bronze.hmt@gmail.com",
            pass: "mtdev123",
          },
        });
        var mailOptions = {
          from: "bronze.hmt@gmail.com",
          to: `${email}`,
          subject: `X??c nh???n thanh to??n ????n h??ng #${id_order} th??nh c??ng t??? ViettelStore`,
          html: `<h1>Welcome</h1><p>X??c nh???n ????n h??ng!</p>
                    <br/>
                    <p>Messenger:C???m ??n anh/ch??? : ${nameUser} ???? thanh to??n ????n h??ng th??nh c??ng</p>
                    <p> ${cart.orderProducts.map(
                      (item) =>
                        `<p> Ten san pham  ${item.productLine?.product_name}</p>
                        <br/>
                        <image src='${item.products?.image}'/>
                        <br/>
                        <p> Gia : ${item.price}</p>
                        <br/>
                        <p> So luong : ${item.quantity}</p>
                        <br/>
                        <p> Dia chi : ${cart.user.address}</p>
                        `
                    )}</p>
                `,
        };

        transporter.sendMail(mailOptions, function (error: any, info: any) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      });
    return;
  };
  updateQuantity = async (order_product_id: string) => {
    await pool.query(
      ` UPDATE public.order_product SET quantity_order=quantity_order+1 WHERE order_product_id='${order_product_id}'`
    );
  };
  updateQuantityMinus = async (order_product_id: string) => {
    await pool.query(
      ` UPDATE public.order_product SET quantity_order=quantity_order-1 WHERE order_product_id='${order_product_id}'`
    );
  };
  deleteOrderProduct = async (order_product_id: string) => {
    await pool.query(
      `DELETE FROM public.order_product WHERE order_product_id='${order_product_id}'`
    );
  };
}

export const orderServies = new OrderServies();
