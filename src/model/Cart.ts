export interface Cart{
    product_id : string,
	product_color_id :number,
	product_ram_id :number,
	price_product :number ,
	quantity :number,
	image : string
}
export interface CartModel{
	id_order:string,
	productsid:string,
	quantity:number, 
	price:number
}