
import { Action } from '@reduxjs/toolkit'
import { put, takeLatest, delay } from 'redux-saga/effects'
import { getProductsListTable } from './ProductsList'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//action type with const
export const actionTypes = {
  productsList: 'GET_PRODUCTS_LIST',
  getProductsListSuccess: 'GET_PRODUCTS_LIST_SUCCESS',
  nextPage: 'GET_PRODUCTS_LIST_NEXT_PAGE',
}

export const actions = {
  getProductList: (data: IProductsList) => ({
    type: actionTypes.productsList,
    payload: data
  }),
  fillProductList: (data: IProductsList) => ({
    type: actionTypes.getProductsListSuccess,
    payload: data
  }),
  getProductNextPage: (data: IProductsList) => ({
    type: actionTypes.nextPage,
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

const initialProductsState: IProductsList = {
  productsList: [],
  currentPage: 1,
  pageSize: 20,
  userId: 0
}

export interface IProductsList {
  productsList?: Array<any>
  currentPage?: number
  pageSize?: number
  userId?: number
  totalPages?: number,
  terms?: string
}

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const reducer = persistReducer(
  { storage, key: 'produdcts-list', whitelist: ['productsList', 'currentPage', 'pageSize', 'userId', 'totalPages', 'totalProducts'] },
  (state: IProductsList = initialProductsState, action: ActionWithPayload<IProductsList>) => {

    switch (action.type) {

      case actionTypes.productsList: {
        return { ...action.payload }
      }
      case actionTypes.getProductsListSuccess: {
        return { ...state, ...action.payload }
      }
      case actionTypes.nextPage: {
        return { ...state, ...action.payload }
      }

      default:
        return state;
    }
  }
)

function* sagaGetProductList(action: any) {
  const { userId, currentPage, pageSize, terms, filterOption } = action.payload
  const { data: data } = yield getProductsListTable(userId, currentPage, pageSize, terms, filterOption)
  yield delay(100)
  yield put(actions.fillProductList(data.data))
}

export function* sagaProducts() {
  yield takeLatest(actionTypes.productsList, sagaGetProductList)
  yield takeLatest(actionTypes.nextPage, sagaGetProductList)
}
