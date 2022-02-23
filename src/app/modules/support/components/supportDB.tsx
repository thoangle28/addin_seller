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
    id : params.userId ?  params.userId : 0,
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
  customer_id: number
  category: string
  orderId: string
  productId: string
  attachments: Array<string> | []
  sellerId: string
  accessToken?: string | ''
}

export function CreateTicket( params: iTicket, userInfo: any) {   
  const args = {
    subject: params.subject,
    categories: params.category,
    product_id: params.productId,
    order_id: params.orderId,
    status: 'open',
    message: params.subject,
    author_id: params.customer_id,
    brand_id: params.sellerId,
    attachment_image: params.attachments,
    accessToken: userInfo.accessToken
  }
  return axios.post<AnyRecord>(API_END_POINT_URL+ '/ticket/create-ticket', args)
}

export function GetProductsByOrder(params: any ) { 
  const args = {
    order_id: params.orderId, user_id: params.userId
  }
  return axios.post<{result: any}>(API_END_POINT_URL+ '/ticket/get-products-from-order', args )
}

export function GetOrdersListOfCustomer( params: any) { 
  const args  = {
    customer_id: params.customerId, 
    current_page: params.currentPage, 
    page_size: params.pageSize
  }

  return axios.post<{result: any}>(API_END_POINT_URL+ '/ticket/get-list-order-by-customer', args )
}


export function GetTicketDetails( ticketId: number, userInfo: any) {   
  return axios.post<AnyRecord>(API_END_POINT_URL+ '/ticket/ticket-detail',  {ticket_id: ticketId} )
}

export function CreateMesssageTicket( params: any) {   
  const args = {
    author_id: params.userId,
    ticket_id: params.ticketId,
    message: params.message,
    attachment_image: params.attachments,
    closed: params.closed
}
  return axios.post<AnyRecord>(API_END_POINT_URL+ '/ticket/create-message-for-ticket',  args )
}

export function GetBrands(params: any) {   
  return axios.post<AnyRecord>(API_END_POINT_URL+ '/ticket/brands', params)
}