import { iBaseResponse } from "./Common"

export interface iReport {
    weeklySales: any | 0
    newUsers: any | 0
    itemOrders: any | 0
    bugReports: any | 0
    productSale12M: any | []
    statistics: any | []
    loading: boolean | false
}

export interface formValue {
    user_id: number
    filter_by_month?: number
    filter_by_year?: number
    page_size?: number | string
    current_page?: number | string
    last_seven_date?: boolean,
    access_token?: string;
}



export interface iList extends iBaseResponse {
    product_sale_list: iProduct[]
}

export interface iProductOrderList extends iBaseResponse {
    order_list: iOrderList[]
}

export interface iCustomerList extends iBaseResponse {
    customer_list: iCustomer[]
}

export interface iRefunedList extends iBaseResponse {
    order_refund_list: iRefuned[]
}

export interface iProductSoldList extends iBaseResponse {
    product_list: iProductSold[]
}

export interface iOrderList {
    order_id: string | number,
    title_product: string;
    date: string;
    status: string;
    price: number;
    customer_name: string
}

export interface iCustomer {
    user_id: string | number;
    city: string;
    country: string;
    email: string;
    phone: number | string;
    full_name: string;
}

export interface iProduct {
    date: string;
    preview: string;
    product_id: string;
    product_img: string;
    product_sale: string;
    regular_price: string;
    sale_price: string;
    sku: string;
    status: string;
    type: string;
}
export interface iRefuned {
    order_id: string;
    title_product: string;
    date: string;
    price_refund: number;
    product_img: string;
    product_url: string;
    sku: string;
}

export interface iProductSold {
    order_id: string;
    title_product: string;
    date: string;
    price: number;
    product_img: string;
    product_url: string;
    quantity: 1;
    sku: string;
    status: string;
}
