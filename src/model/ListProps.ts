export interface ListProps {
    product_id: string,
    product_name: string,
    trademark_id: string,
    createAt: string,
    updateAt: string,
    product_color_id: number,
    product_ram_id: number,
    price_product: number,
    quantity: number,
    image: string
}
export interface ListPropsEditProduct {
    product_id: string,
    product_name: string,
    trademark_id: string,
    createat: string,
    updateat: string,

}
export interface ListPropsProduct {
    page: number,
    pagesize: number,
    name: string,
    orderBy: string,
    from: number,
    to: number
}
export interface ListPropsRegister {
    email: string,
    password: string
}
export interface ListPropsCheckout {
    user_id: string,
    pageSize: number,
    page: number
}