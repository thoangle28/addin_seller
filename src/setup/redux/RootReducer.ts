import { all } from 'redux-saga/effects'
import { combineReducers } from 'redux'

import * as auth from '../../app/modules/auth'
import * as product from '../../app/modules/products'
import * as detail from '../../app/modules/products/redux/CreateProductRedux'
import { reportReducers } from '../../app/modules/sale/Redux/Reducer'
import { orderListingReducer } from '../../app/modules/products/components/OrderListingRedux/Reducer'

export const rootReducer = combineReducers({
  auth: auth.reducer,
  product: product.reducer,
  productDetail: detail.reducerProduct,
  reportReducers,
  orderListingReducer
})

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([auth.saga(), product.sagaProducts(), detail.sagaCreateUpdateProduct()])
}
