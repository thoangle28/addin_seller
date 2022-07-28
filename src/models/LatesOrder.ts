import { iBaseResponse } from "./Common";
import { iOrderList } from "./Report";

export interface iPayload {
    user_id: number;
    current_page?: number;
    page_size?: number;
    last_seven_date?: boolean;
    this_month?: boolean;
    filter_by_month?: number;
    filter_by_year?: number;
    filter_by_status?: string;
    search_by_order_id?: string;
    after_custom_date?: string;
    before_custom_date?: string;
    access_token?: string;
}

export interface iOrderListResponse extends iBaseResponse {
    order_list: iOrderList[]
}

export interface iOrderDetailItems {
    name: string;
    price: 300;
    product_id: number;
    product_img: string;
    product_url: string;
    sku: string;
    variation_id: number;
    discount: number | string;
    quantity: number;
    total:number
}

interface orderBilling {
    order_billing_address_1: string;
    order_billing_address_2: string;
    order_billing_city: string;
    order_billing_company: string;
    order_billing_country: string;
    order_billing_email: string;
    order_billing_first_name: string;
    order_billing_last_name: string;
    order_billing_phone: string;
    order_billing_postcode: string;
}
interface orderShipping {
    order_shipping_address_1: string;
    order_shipping_address_2: string;
    order_shipping_city: string;
    order_shipping_company: string;
    order_shipping_country: string;
    order_shipping_first_name: string;
    order_shipping_last_name: string;
    order_shipping_phone: string;
    order_shipping_postcode: string;
}

export interface iOrderListDetailResponse {
    order_id: string;
    customer_email: string;
    customer_name: string;
    order_date: string;
    order_status: string;
    items: iOrderDetailItems[];
    order_shipping: orderShipping;
    order_billing: orderBilling;
}
export interface iUpdateData {
    order_id: string;
    order_status: string;
    access_token: string;
}
