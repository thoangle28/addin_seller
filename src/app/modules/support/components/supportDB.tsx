import axios from 'axios'
import { AnyRecord } from 'dns';

const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT

//export const END_POINT = 
type Params = {
    userId: number
    accessToken: string
    currentPage: number
    pageSize: number
    status: string | ''
}

export function GetTicketsListing( params: Params) { 
  const args = { 
    customer_id : params.userId ?  params.userId : 0,
    page_size :  params.pageSize ?  params.pageSize : 10,
    current_page :  params.currentPage ?  params.currentPage : 1,
    status :  params.status ?  params.status : '',
    accessToken:  params.accessToken
  };

  return axios.post<{result: any}>(API_END_POINT_URL+ '/ticket/list', args)
}

type iTicket = {
  subject: string
  message: string
  customer: number | string
  category: string
  orderId: string
  productId: string
  attachments: Array<string>| []
  sellerId: string
}
export function CreateTicket( params: iTicket, userInfo: any) {   
  const args = { ...params, ...userInfo }
  return axios.post<AnyRecord>(API_END_POINT_URL+ '/ticket/create', args)
}

export function GetProductsByOrder( orderId: number) { 
  return axios.post<{result: any}>(API_END_POINT_URL+ '/ticket/get-products-from-order', { order_id: orderId})
}