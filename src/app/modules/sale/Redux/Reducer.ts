import { actionTypes } from './Types'

const isSuccess = {
    requestHasError: false,
    requestIsLoading: false,
    requestIsSuccess: true
}
const isLoading = {
    requestHasError: false,
    requestIsLoading: true,
    requestIsSuccess: false
}
const isFailure = {
    requestHasError: true,
    requestIsLoading: false,
    requestIsSuccess: false
}

const initProductState = {
    requestHasError: false,
    requestIsLoading: false,
    requestIsSuccess: false, 
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

export const reportReducers = (state: any = initProductState, action: any) => {
    const { type, payload } = action
    console.log(action)
    switch (type) {
        case actionTypes.GET_CUSTOMER_LIST_SUCCESS: {
            return { ...state, customerList: payload, ...isSuccess }
        }
        case actionTypes.GET_CUSTOMER_LIST_FAILURE: {
            return { ...state, ...isFailure }
        }
        case actionTypes.GET_CUSTOMER_LIST_REQUEST: {
            return { ...state, ...isLoading }
        }
        case actionTypes.GET_PRODUCT_ORDER_LIST_SUCCESS: {
            return { ...state, orderProducts: payload, ...isSuccess }
        }
        case actionTypes.GET_PRODUCT_ORDER_LIST_FAILURE: {
            return { ...state, ...isFailure }
        }
        case actionTypes.GET_PRODUCT_ORDER_LIST_REQUEST: {
            return { ...state, ...isLoading }
        }
        case actionTypes.GET_PRODUCT_PROMOTION_LIST_SUCCESS: {
            return { ...state, promotionProducts: payload, ...isSuccess }
        }
        case actionTypes.GET_PRODUCT_PROMOTION_LIST_REQUEST: {
            return { ...state, ...isLoading }
        }
        case actionTypes.GET_PRODUCT_PROMOTION_LIST_FAILURE: {
            return { ...state, ...isFailure }
        }
        case actionTypes.GET_PRODUCT_SOLD_LIST_SUCCESS: {
            return { ...state, soldProducts: payload, ...isSuccess }
        }
        case actionTypes.GET_PRODUCT_ORDER_LIST_REQUEST: {
            return { ...state, ...isLoading }
        }
        case actionTypes.GET_PRODUCT_ORDER_LIST_FAILURE: {
            return { ...state, ...isFailure }
        }
        case actionTypes.GET_REFUNDED_LIST_SUCCESS: {
            return { ...state, refundedList: payload, ...isSuccess }
        }
        case actionTypes.GET_REFUNDED_LIST_FAILURE: {
            return { ...state, ...isFailure }
        }
        case actionTypes.GET_REFUNDED_LIST_REQUEST: {
            return { ...state, ...isLoading }
        }
        case actionTypes.GET_CUSTOMER_LIST_INPUT: {
            return { ...state, formCustomerValue: payload }
        }
        case actionTypes.GET_PROMOTION_PRODUCT_INPUT: {
            return { ...state, formValue: payload }
        }
        case actionTypes.GET_PRODUCT_SOLD_LIST_INPUT: {
            return { ...state, formProductSold: payload }
        }
        case actionTypes.GET_REFUNDED_LIST_INPUT: {
            return { ...state, formRefund: payload }
        }
        case actionTypes.GET_PRODUCT_ORDER_LIST_INPUT: {
            return { ...state, formProductOrderValue: payload }
        }
        default:
            return state;
    }
}
