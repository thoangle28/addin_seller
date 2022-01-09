import {Action} from '@reduxjs/toolkit'
import { put, takeLatest} from 'redux-saga/effects'
import {getProductDetail} from './ProductsList'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//action type with const
export const actionTypes = {
  getProductDetail: 'GET_PRODUCT_DETAIL',
  getProductSuccess: 'GET_PRODUCT_DETAIL_SUCCESS',
  saveProduct: 'SAVE_PRODUCT'
}

export const actions = {
  getProductDetail: (userId: number, ProductId: number) => ({
    type: actionTypes.getProductDetail,
    payload: { userId, ProductId }
  }),
  fillProductDetail: ( data: IProductDetail ) => ({     
    type: actionTypes.getProductSuccess,
    payload: data
  }),
  saveProduct: (data: IProductDetail) => ({
    type: actionTypes.saveProduct,
    payload: data
  })
}

export interface IProduct {
  id: number,
  product_name: string,
  thumbnail: string,
  sku: string,
  regular_price: number,
  sale_price: number,
  post_date: string,
  status: string
}

export interface IProductDetail {
  product?: IProduct | any
}

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

const initProductState: IProductDetail = {
  product: null
}

export const reducerProduct = persistReducer(
  {storage, key: 'product-detail', whitelist: ['ProductId', 'userId', 'product']},
  (state: IProductDetail = initProductState, action: ActionWithPayload<IProductDetail>) => {
    
    switch(action.type) {

      case actionTypes.getProductDetail: {        
        return {...action.payload, product: null}
      }    

      case actionTypes.getProductSuccess: {     
        return {...state, product: action.payload}
      }  

      case actionTypes.saveProduct: {
        return {...state}
      }    

      default:
        return state;
    }
  }
)


function* sagaGetProduct(action: any) {      
  const { userId, ProductId} =  action.payload
  const {data: data} = yield getProductDetail(userId, ProductId)
  yield put(actions.fillProductDetail(data.data))
}

export function* sagaCreateUpdateProduct() {
  yield takeLatest(actionTypes.getProductDetail, sagaGetProduct)
}