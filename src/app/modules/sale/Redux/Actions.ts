import { formValue, iCustomerList, iList, iProductOrderList, iProductSoldList, iRefunedList } from '../../../../models'
import { actionTypes } from './Types'

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
    })
}