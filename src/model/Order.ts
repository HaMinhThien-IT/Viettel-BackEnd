import { Cart, CartModels } from './Cart';
import { BuyUser } from "./BuyUser";
import { order_user } from './Checkout';

export interface Order {
    id_order: string,
    user_id: string,
    time_order: string,
    status_order: boolean,
    isTemporary: boolean
}
export interface OrderWithDetail extends Order {
    orderProducts: CartModels[],
    user: order_user
}
// export const orderItem: OrderWithDetail = {
//     id_order: '1',
//     user_id: 'admin',
//     time_order: '02-02-2002',
//     status_order: false,
//     isTemporary: false,
//     orderProducts: [
//         {
//             id_order: '1',
//             productsid: 'string',
//             quantity: 10,
//             price: 100,
//             productLine: {
//                 product_id: 'id1',
//                 createAt: '02-02-2002',
//                 updateAt: '02-02-2002',
//                 product_name: 'Nokia',
//                 trademark_id: 'nokia'
//             },
//             products: {
//                 image: 'png1.png',
//                 price_product: 90000,
//                 product_color_id: 1,
//                 product_ram_id: 1,
//                 quantity: 10000,
//                 productsId: '909jhgjkhg',
//                 product_id: ' 878787'
//             }
//         }
//     ],
//     user: {
//         address: 'bmt',
//         name_order: 'Ha Minh Thien',
//         order_user_id: '90909',
//         sdt: '9090909'
//     }
// }
