import axios from 'axios'

const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT

//export const END_POINT = 
export function getProductsListTable( userId: number, currentPage: number, pageSize: number) {  
  
  const args = { 
    user_id : userId ? userId : 0,
    page_size : pageSize ? pageSize : 10,
    current_page : currentPage ? currentPage : 1 
  };

  return axios.post<{result: any}>(API_END_POINT_URL+ '/products-by-user', args)
}

export function getProductDetail(userId: number, product_id: number | 0) {
  const args =  { product_id: product_id, author_id : userId }
  return axios.post<{result: any}>(API_END_POINT_URL+ '/product', args)
}

export function getShippingClass() {
  return axios.get<any>(API_END_POINT_URL+ '/shipping-classes')
}


export function getCategoires() {
  return axios.get<any>(API_END_POINT_URL+ '/product/categories')
}

export function getAttributes() {
  return axios.get<any>(API_END_POINT_URL+ '/product/attribute')
}

export function getSubAttributes(slug: string) {
  return axios.post<any>(API_END_POINT_URL+ '/attribute-product/parent', { 'name' : slug })
}


export function getProductsList( userId: number) {  
  
  const args = { 
    user_id : userId ? userId : 0,
    page_size : -1,
    current_page : 1 
  };

  return axios.post<any>(API_END_POINT_URL+ '/products-by-user', args)
}


export function getProductInfoDetail(userId: number, product_id: number | 0) {
  const args =  { product_id: product_id, author_id : userId }
  return axios.post<any>(API_END_POINT_URL+ '/product', args)
}


export function saveProductToDB(params: any) {
  return axios.post<any>(API_END_POINT_URL+ '/create-product', params)
}