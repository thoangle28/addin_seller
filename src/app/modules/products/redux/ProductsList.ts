import axios from 'axios'

const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT

//export const END_POINT = 
export function getProductsListTable(userId: number, currentPage: number, pageSize: number, terms: string, filterOption: string) {
  const args = {
    user_id: userId ? userId : 0,
    page_size: pageSize ? pageSize : 10,
    current_page: currentPage ? currentPage : 1,
    search: terms,
    status: filterOption
  };
  return axios.post<{ result: any }>(API_END_POINT_URL + '/products-by-user', args)
}

export function getProductDetail(userId: number, product_id: number | 0) {
  const args = { product_id: product_id, author_id: userId }
  return axios.post<{ result: any }>(API_END_POINT_URL + '/product', args)
}

export function getShippingClass() {
  return axios.get<any>(API_END_POINT_URL + '/shipping-classes')
}

export function getCategoires() {
  return axios.get<any>(API_END_POINT_URL + '/product/categories')
}

export function getAttributes() {
  return axios.get<any>(API_END_POINT_URL + '/product/attribute')
}

export function getAttributesNoChild(user_id: any) {
  //return axios.get<any>(API_END_POINT_URL + '/product/attribute/parents')
  //console.log(user_id)
  return axios.post<any>(API_END_POINT_URL + '/product/get-all-attribute-product-by-brand', { 'user_id': user_id})  
}

export function getSubAttributes(slug: string) {
  return axios.post<any>(API_END_POINT_URL + '/product/attribute-list', { 'name': slug })
}

export function getProductsList(userId: number) {

  const args = {
    user_id: userId ? userId : 0,
    page_size: -1,
    current_page: 1
  };

  return axios.post<any>(API_END_POINT_URL + '/products-by-user', args)
}


export function getProductInfoDetail(userId: number, product_id: number | 0) {
  const args = { product_id: product_id, author_id: userId }
  return axios.post<any>(API_END_POINT_URL + '/product', args)
}


export function saveProductToDB(params: any, token: string) {
  return axios.post<{ result: any }>(API_END_POINT_URL + '/create-product', { product_info: params, accessToken: token })
}

//accessToken: string, product_id: number, params: any, type: string
export function updateProductAttr(obj: any) {
  const url = (obj.type === 'attr') ? '/product/create-attributes' : '/product/create-variations'
  return axios.post<any>(API_END_POINT_URL + url, { data: obj })
}

export function getProductsListing(userId: number, currentPage: number, pageSize: number) {

  const args = {
    user_id: userId ? userId : 0,
    page_size: pageSize ? pageSize : 10,
    current_page: currentPage ? currentPage : 1
  };

  return axios.post<any>(API_END_POINT_URL + '/products-by-user', args);
}

export function uploadImage(file: any) {
  const url = '/upload-file';
  return axios.post<any>(API_END_POINT_URL + url, { file: file })
}

export const createProductAttributeBrand = (payload: any) => axios.post(API_END_POINT_URL + '/product/create-product-attributes-brand', payload)

export const createTermsProductAttribute = (payload: any) => axios.post(API_END_POINT_URL + '/product/create-terms-product-attribute', payload)