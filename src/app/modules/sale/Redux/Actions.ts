import { formValue, iCustomerList, iList, iProductOrderList, iProductSoldList, iRefunedList } from '../../../../models'
import { actionTypes } from './Types'
import { getCustomerList, getProductSaleList, getRefundedList, getProductSoldList, getProductOrderList } from './../saleReport';

export const actions = {
    getCustomerList: (payload: iCustomerList) => ({
        type: actionTypes.GET_CUSTOMER_LIST,
        payload
    }),
    getProductOrderList: (payload: iProductOrderList) => ({
        type: actionTypes.GET_PRODUCT_ORDER_LIST,
        payload
    }),
    getProductPromotionList: (payload: iList) => ({
        type: actionTypes.GET_PRODUCT_PROMOTION_LIST,
        payload
    }),
    getProductSoldList: (payload: iProductSoldList) => ({
        type: actionTypes.GET_PRODUCT_SOLD_LIST,
        payload,
    }),
    getRefundedList: (payload: iRefunedList) => ({
        type: actionTypes.GET_REFUNDED_LIST, payload
    }),
    getCustomerListInput: (payload: formValue) => ({
        type: actionTypes.GET_CUSTOMER_LIST_INPUT,
        payload
    }),
    getProductOrderListInput: (payload: formValue) => ({
        type: actionTypes.GET_PRODUCT_SOLD_LIST_INPUT,
        payload
    }),
    getPromotionProductInput: (payload: formValue) => ({
        type: actionTypes.GET_PROMOTION_PRODUCT_INPUT,
        payload
    }),
    getProductSoldListInput: (payload: formValue) => ({
        type: actionTypes.GET_PRODUCT_SOLD_LIST_INPUT,
        payload
    }),
    getRefundListInput: (payload: formValue) => ({
        type: actionTypes.GET_REFUNDED_LIST_INPUT,
        payload
    }),
}

export const fetchCustomer = (formData: formValue) => async (dispatch: any) => {
    try {
        const res = await getCustomerList(formData);
        dispatch(actions.getCustomerList(res.data.data))
    } catch (error) {
        console.log(error)
    }
}

export const fetchPromotionList = (formData: formValue) => async (dispatch: any) => {
    try {
        const res = await getProductSaleList(formData)
        dispatch(actions.getProductPromotionList(res.data.data))
    } catch (error) {
        console.log(error)
    }
}

export const fetchRefundedList = (formData: formValue) => async (dispatch: any) => {
    try {
        const res = await getRefundedList(formData)
        dispatch(actions.getRefundedList(res.data.data))
    } catch (error) {
        console.log(error)
    }
}

export const fetchProductSold = (formData: formValue) => async (dispatch: any) => {
    try {
        const res = await getProductSoldList(formData)
        dispatch(actions.getProductSoldList(res.data.data))
    } catch (err) {
        console.log(err)
    }
}

export const fetchProductOrder = (formData: formValue) => async (dispatch: any) => {
    try {
        const res = await getProductOrderList(formData)
        dispatch(actions.getProductOrderList(res.data.data))
    } catch (error) {
        console.log(error)
    }
}
