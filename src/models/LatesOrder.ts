import { string } from "yup";
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
    quantity: number;
}

export interface iOrderListDetailResponse {
    order_id: string;
    customer_email: string;
    customer_name: string;
    order_date: string;
    order_status: string;
    items: iOrderDetailItems[]
}
export interface iUpdateData {
    order_id: string;
    order_status: string;
}
