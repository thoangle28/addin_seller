import persistReducer from 'redux-persist/es/persistReducer'
import { actionTypes } from './Types'
import storage from 'redux-persist/lib/storage'



const initProductState: any = {
    formValue: {},
    formProductOrderValue: {},
    formCustomerValue: {},
    formProductSold: {},
    formRefund: {},
    promotionProducts: {},
    soldProducts: {},
    orderProducts: {},
    refundedList: {},
    customerList: {}
}

export const reportReducers = persistReducer(
    { storage, key: 'report-list', whitelist: ['promotionProducts', 'customerList', 'refundedList', 'soldProducts', 'orderProducts'] },
    (state: any = initProductState, action: any) => {
        switch (action.type) {
            case actionTypes.GET_CUSTOMER_LIST: {
                return {
                    ...state, customerList: action.payload
                }
            }
            case actionTypes.GET_PRODUCT_ORDER_LIST: {
                return {
                    ...state, orderProducts: action.payload
                }
            }
            case actionTypes.GET_PRODUCT_PROMOTION_LIST: {
                return {
                    ...state, promotionProducts: action.payload
                }
            }
            case actionTypes.GET_PRODUCT_SOLD_LIST: {
                return {
                    ...state, soldProducts: action.payload
                }
            }
            case actionTypes.GET_REFUNDED_LIST: {
                return {
                    ...state, refundedList: action.payload
                }
            }
            case actionTypes.GET_CUSTOMER_LIST_INPUT: {
                return {
                    ...state, formCustomerValue: action.payload
                }
            }
            case actionTypes.GET_PROMOTION_PRODUCT_INPUT: {
                return {
                    ...state, formValue: action.payload
                }
            }
            case actionTypes.GET_PRODUCT_SOLD_LIST_INPUT: {
                return {
                    ...state, formProductSold: action.payload
                }
            }
            case actionTypes.GET_REFUNDED_LIST_INPUT: {
                return {
                    ...state, formRefund: action.payload
                }
            }
            case actionTypes.GET_PROMOTION_ORDER_LIST_INPUT: {
                return {
                    ...state, formProductOrderValue: action.payload
                }
            }
            default:
                return state;
        }
    })


