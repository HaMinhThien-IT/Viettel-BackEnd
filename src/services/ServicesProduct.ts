
import { ListPropsProduct } from './../model/ListProps';

import { pool } from "../ConnectDB";

import {  product, ProductDetail, ProductLine, Products } from "../model/Product";
import { QueryResult } from 'pg';
class ServicesProduct {
    getListProductWithPagination = async (page: number, pagesize: number, name: string, orderBy: string, from: number, to: number) => {
        let countProduct;
        let listProduct: product[] = []
        if (name != undefined && name != '' && name != null) {
            console.log("1");
            const queryListProduct = await pool.query(`select *,pr.ram from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id  where pl.product_name ilike '%${name}%' limit ${pagesize} OFFSET (${page} - 1) * ${pagesize}`)
            countProduct = await pool.query(`select count(*) from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id  where pl.product_name ilike '%${name}%' `)
            listProduct = queryListProduct.rows
            console.log(`select count(*) from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id  where pl.product_name ilike '%${name}%' limit ${pagesize} OFFSET (${page} - 1) * ${pagesize}`);

        } else if (orderBy !== undefined && orderBy != null && orderBy != "") {
            console.log("2");
            const queryListProduct = await pool.query(`select *,pr.ram from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id  ORDER BY p.price_product ${orderBy} limit ${pagesize} OFFSET (${page} - 1) * ${pagesize}`)
            console.log(`select *,pr.ram from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id  ORDER BY p.price_product ${orderBy} limit ${pagesize} OFFSET (${page} - 1) * ${pagesize}`);

            countProduct = await pool.query(`select count(*) from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id `)
            console.log(`select count(*) from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id limit ${pagesize} OFFSET (${page} - 1) * ${pagesize}`);

            listProduct = queryListProduct.rows
        } else if (from != undefined || to != undefined && from || to) {
            console.log("3");
            const queryListProduct = await pool.query(`select *,pr.ram from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id  where p.price_product  between  ${from} and ${to} limit ${pagesize} OFFSET (${page} - 1) * ${pagesize}`);
            countProduct = await pool.query(`select count(*) from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id  where p.price_product  between  ${from} and ${to} `)
            listProduct = queryListProduct.rows
        }
        else {
            console.log("4");
            const queryListProduct = await pool.query(`select *,pr.ram from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id limit ${pagesize} OFFSET (${page} - 1) * ${pagesize}`)
            countProduct = await pool.query(`select count(*) from  product_line pl join products p  on pl.product_id  = p.product_id join product_ram pr on pr.product_ram_id  = p.product_ram_id `)
            listProduct = queryListProduct.rows
        }
        let totalPage = Math.ceil(Number(countProduct.rows[0].count) / pagesize)
        console.log(totalPage);

        return { listProduct, totalPage };
    }
    getProductLine = async () => {
        const listProductLine = await pool.query(`select *,t.name_trademark from product_line pl join trademark t  on t.trademark_id  = pl.trademark_id  order by createat desc`)
        return listProductLine.rows
    }
    addProductLine = async (products: ProductLine) => {
        await pool.query(`insert into product_line (product_id,product_name,trademark_id,createAt,updateAt) values ('${products.product_id}','${products.product_name}','${products.trademark_id}','${products.createAt}','${products.updateAt}')
        `)
        const listProductLine = await pool.query(`select *,t.name_trademark from product_line pl join trademark t  on t.trademark_id  = pl.trademark_id  order by createat desc`)
        return listProductLine.rows
    }

    updateProductLine = async (product_id: string, product_name: string, trademark_id: string, createat: string, updateat: string,) => {
        await pool.query(`UPDATE public.product_line SET product_name='${product_name}', trademark_id='${trademark_id}', createat='${createat}', updateat='${updateat}' WHERE product_id='${product_id}'`)
        const listProductLine = await pool.query(`select *,t.name_trademark from product_line pl join trademark t  on t.trademark_id  = pl.trademark_id  order by createat desc`)
        return listProductLine.rows
    }
    editProductsById = async (products: Products) => {
        console.log(`UPDATE public.products SET  product_color_id=${products.product_color_id}, product_ram_id=${products.product_ram_id}, image='${products.image}', price_product=${products.price_product}, quantity=${products.quantity} where productsid = '${products.productsId}';`);
        await pool.query(`UPDATE public.products SET  product_color_id=${products.product_color_id}, product_ram_id=${products.product_ram_id}, image='${products.image}', price_product=${products.price_product}, quantity=${products.quantity} where productsid = '${products.productsId}';`)
        console.log(`select * from products p join product_color pc  on pc.product_color_id  = p.product_color_id  join product_ram pr  on pr.product_ram_id = p.product_ram_id  where product_id  = '${products.product_id}' 
       `);

        const listProducts = await pool.query(`select * from products p join product_color pc  on pc.product_color_id  = p.product_color_id  join product_ram pr  on pr.product_ram_id = p.product_ram_id  where product_id  = '${products.product_id}' 
        `)
        return listProducts.rows
    }
    getTrademark = async () => {
        const trademark_ = await pool.query('select * from trademark t ')
        return trademark_.rows
    }
    getDetailProduct = async (product_id: string) => {
        let lisProductTemp: QueryResult = await pool.query(`select ram,color,* from product_line pl  join  products p  on pl.product_id  = p.product_id join product_color pc  on pc.product_color_id  = p.product_color_id  join product_ram pr 
        on pr.product_ram_id  = p.product_ram_id where pl.product_id = '${product_id}'`)
        let getAll = lisProductTemp.rows;
        let ListProduct: ProductDetail[] = []
        let allId: string[] = []  
        getAll.map(item => allId.push(item.product_id))
        allId = Array.from(new Set(allId))
        allId.map(product_id => {
            const detail: ProductDetail = {
                product_id: product_id,
                product_name: '',
                trademark_id: '',
                createAt: '',
                updateAt: '',
                products: []
            }
            getAll.map(itemTemp => {
                if (itemTemp.product_id === product_id) {
                    detail.product_id = itemTemp.product_id,
                        detail.product_name = itemTemp.product_name,
                        detail.trademark_id = itemTemp.trademark_id,
                        detail.createAt = itemTemp.createat,
                        detail.updateAt = itemTemp.updateat
                    detail.products.push({
                        productsid: itemTemp.productsid,
                        product_id: itemTemp.product_id,
                        product_color_id: itemTemp.product_color_id,
                        product_ram_id: itemTemp.product_ram_id,
                        image: itemTemp.image,
                        price_product: itemTemp.price_product,
                        quantity: itemTemp.quantity,
                        ram: itemTemp.ram,
                        color: itemTemp.color
                    })
                }
               
            })

            
            ListProduct.push(detail)
            
            
           
        })

        return ListProduct;

    }
    getProductsById = async (product_id: string) => {
        const listProducts = await pool.query(`select * from products p join product_color pc  on pc.product_color_id  = p.product_color_id  join product_ram pr  on pr.product_ram_id = p.product_ram_id  where product_id  = '${product_id}' 
        `)
        return listProducts.rows
    }
    getListColor = async () => {
        const listColor = await pool.query('select  * from product_color pc ')
        return listColor.rows
    }
    getListRam = async () => {
        const listRam = await pool.query('select  * from product_ram pr ')
        return listRam.rows
    }
    addProduct = async (products: Products) => {
        await pool.query(`INSERT INTO public.products (productsId,product_id, product_color_id, product_ram_id, image, price_product, quantity) VALUES('${products.productsId}','${products.product_id}', ${products.product_color_id}, ${products.product_ram_id}, '${products.image}', ${products.price_product}, ${products.quantity})`)
      
        const listProducts = await pool.query(`select * from products p join product_color pc  on pc.product_color_id  = p.product_color_id  join product_ram pr  on pr.product_ram_id = p.product_ram_id  where product_id  = '${products.product_id}' 
        `)
        return listProducts.rows
    }
    deleteProduct = async (productsId: string,productId:string) =>{
        await pool.query(`delete from products 
        where productsid  = '${productsId}'`)   
        const listProducts = await pool.query(`select * from products p join product_color pc  on pc.product_color_id  = p.product_color_id  join product_ram pr  on pr.product_ram_id = p.product_ram_id  where product_id  = '${productId}' 
        `)
        return listProducts.rows
    }



}


export const servicesProduct = new ServicesProduct();