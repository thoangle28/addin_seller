import { formValue, iCustomerList, iList, iProductOrderList, iProductSoldList, iRefunedList } from '../../../../models'
import { actionTypes } from './Types'
import { getCustomerList, getProductSaleList, getRefundedList, getProductSoldList, getProductOrderList } from './../saleReport';

const isSuccess = (type: string, payload: any) => ({
    type, payload
});

const isFailure = (type: string, payload: any) => ({
    type, payload
})

const isRequest = (type: string) => ({ type })


//SAVE DATA TO REDUX VIA FORM
export const getCustomerListInput = (payload: formValue) => ({
    type: actionTypes.GET_CUSTOMER_LIST_INPUT,
    payload
})
export const getProductOrderListInput = (payload: formValue) => ({
    type: actionTypes.GET_PRODUCT_ORDER_LIST_INPUT,
    payload
})
export const getPromotionProductInput = (payload: formValue) => ({
    type: actionTypes.GET_PROMOTION_PRODUCT_INPUT,
    payload
})
export const getProductSoldListInput = (payload: formValue) => ({
    type: actionTypes.GET_PRODUCT_SOLD_LIST_INPUT,
    payload
})
export const getRefundListInput = (payload: formValue) => ({
    type: actionTypes.GET_REFUNDED_LIST_INPUT,
    payload
})

export const fetchCustomer = (formData: formValue) => async (dispatch: any) => {
    dispatch(isRequest(actionTypes.GET_CUSTOMER_LIST_REQUEST))
    try {
        const res = await getCustomerList(formData);
        const { data, code, message } = res.data
        code !== 200 ? dispatch(isFailure(actionTypes.GET_CUSTOMER_LIST_FAILURE, message)) : dispatch(isSuccess(actionTypes.GET_CUSTOMER_LIST_SUCCESS, data))
    } catch (error: any) {
        dispatch(isFailure(actionTypes.GET_CUSTOMER_LIST_FAILURE, error.message))
    }
}

export const fetchPromotionList = (formData: formValue) => async (dispatch: any) => {
    dispatch(isRequest(actionTypes.GET_PRODUCT_ORDER_LIST_REQUEST))
    try {
        const res = await getProductSaleList(formData)
        const { data, code, message } = res.data
        code !== 200 ? dispatch(isFailure(actionTypes.GET_PRODUCT_PROMOTION_LIST_FAILURE, message)) : dispatch(isSuccess(actionTypes.GET_PRODUCT_PROMOTION_LIST_SUCCESS, data))
    } catch (error: any) {
        dispatch(isFailure(actionTypes.GET_PRODUCT_PROMOTION_LIST_FAILURE, error.message))
    }
}

export const fetchRefundedList = (formData: formValue) => async (dispatch: any) => {
    dispatch(isRequest(actionTypes.GET_REFUNDED_LIST_REQUEST))
    try {
        const res = await getRefundedList(formData)
        const { data, code, message } = res.data
        code !== 200 ? dispatch(isFailure(actionTypes.GET_REFUNDED_LIST_FAILURE, message)) : dispatch(isSuccess(actionTypes.GET_REFUNDED_LIST_SUCCESS, data))
    } catch (error: any) {
        dispatch(isFailure(actionTypes.GET_REFUNDED_LIST_FAILURE, error.message))
    }
}

export const fetchProductSold = (formData: formValue) => async (dispatch: any) => {
    dispatch(isRequest(actionTypes.GET_PRODUCT_SOLD_LIST_REQUEST))
    try {
        const res = await getProductSoldList(formData)
        const { data, code, message } = res.data
        code !== 200 ? dispatch(isFailure(actionTypes.GET_REFUNDED_LIST_FAILURE, message)) : dispatch(isSuccess(actionTypes.GET_REFUNDED_LIST_SUCCESS, data))
    } catch (error: any) {
        dispatch(isFailure(actionTypes.GET_REFUNDED_LIST_FAILURE, error.message))
    }
}

export const fetchProductOrder = (formData: formValue) => async (dispatch: any) => {
    dispatch(isRequest(actionTypes.GET_PRODUCT_ORDER_LIST_REQUEST))
    try {
        const res = await getProductOrderList(formData)
        const { data, code, message } = res.data
        code !== 200 ? dispatch(isFailure(actionTypes.GET_PRODUCT_ORDER_LIST_FAILURE, message)) : dispatch(isSuccess(actionTypes.GET_PRODUCT_ORDER_LIST_SUCCESS, data))
    } catch (error: any) {
        dispatch(isFailure(actionTypes.GET_PRODUCT_ORDER_LIST_FAILURE, error.message))
    }
}
