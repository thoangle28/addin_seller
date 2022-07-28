import { formValue, iCustomerList, iList, iProductOrderList, iProductSoldList, iRefunedList } from '../../../../models'
import { actionTypes } from './Types'
import { getCustomerList, getProductSaleList, getRefundedList, getProductSoldList, getProductOrderList } from './../saleReport';

const getCustomerListSuccess = (payload: iCustomerList) => ({
    type: actionTypes.GET_CUSTOMER_LIST_SUCCESS,
    payload
})
const getCustomerListFailure = () => ({
    type: actionTypes.GET_CUSTOMER_LIST_FAILURE
})
const getCustomerListRequest = () => ({
    type: actionTypes.GET_CUSTOMER_LIST_REQUEST
})

const getProductOrderListSuccess = (payload: iProductOrderList) => ({
    type: actionTypes.GET_PRODUCT_ORDER_LIST_SUCCESS,
    payload
})
const getProductOrderListFailure = () => ({
    type: actionTypes.GET_PRODUCT_ORDER_LIST_FAILURE
})
const getProductOrderListRequest = () => ({
    type: actionTypes.GET_PRODUCT_ORDER_LIST_REQUEST
})

const getProductPromotionListSuccess = (payload: iList) => ({
    type: actionTypes.GET_PRODUCT_PROMOTION_LIST_SUCCESS,
    payload
})
const getProductPromotionListFailure = () => ({
    type: actionTypes.GET_PRODUCT_PROMOTION_LIST_FAILURE,
})
const getProductPromotionListRequest = () => ({
    type: actionTypes.GET_PRODUCT_PROMOTION_LIST_REQUEST
})

const getProductSoldListSuccess = (payload: iProductSoldList) => ({
    type: actionTypes.GET_PRODUCT_SOLD_LIST_SUCCESS,
    payload
})
const getProductSoldListFailure = () => ({
    type: actionTypes.GET_PRODUCT_SOLD_LIST_FAILURE
})
const getProductSoldListRequest = () => ({
    type: actionTypes.GET_PRODUCT_SOLD_LIST_REQUEST
})

const getRefundedListSuccess = (payload: iRefunedList) => ({
    type: actionTypes.GET_REFUNDED_LIST_SUCCESS, payload
})
const getRefundedListRequest = () => ({
    type: actionTypes.GET_REFUNDED_LIST_REQUEST
})
const getRefundedListFailure = () => ({
    type: actionTypes.GET_REFUNDED_LIST_FAILURE
})

// GET SAVE DATA TO REDUX VIA FORM
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
    dispatch(getCustomerListRequest())
    try {
        const res = await getCustomerList(formData);
        const { data, code } = res.data
        code !== 200 ? dispatch(getCustomerListFailure()) : dispatch(getCustomerListSuccess(data))
    } catch (error) {
        dispatch(getCustomerListFailure())
    }
}

export const fetchPromotionList = (formData: formValue) => async (dispatch: any) => {
    dispatch(getProductPromotionListRequest())
    try {
        const res = await getProductSaleList(formData)
        const { data, code } = res.data
        code !== 200 ? dispatch(getProductPromotionListFailure()) : dispatch(getProductPromotionListSuccess(data))
    } catch (error) {
        dispatch(getProductPromotionListFailure())
    }
}

export const fetchRefundedList = (formData: formValue) => async (dispatch: any) => {
    dispatch(getRefundedListRequest())
    try {
        const res = await getRefundedList(formData)
        const { data, code } = res.data
        code !== 200 ? dispatch(getRefundedListFailure()) : dispatch(getRefundedListSuccess(data))
    } catch (error) {
        dispatch(getRefundedListFailure())
    }
}

export const fetchProductSold = (formData: formValue) => async (dispatch: any) => {
    dispatch(getProductSoldListRequest())
    try {
        const res = await getProductSoldList(formData)
        const { data, code } = res.data
        code !== 200 ? dispatch(getProductSoldListFailure()) : dispatch(getProductSoldListSuccess(data))
    } catch (err) {
        dispatch(getProductSoldListFailure())
    }
}

export const fetchProductOrder = (formData: formValue) => async (dispatch: any) => {
    dispatch(getProductOrderListRequest())
    try {
        const res = await getProductOrderList(formData)
        const { data, code } = res.data
        code !== 200 ? dispatch(getProductOrderListFailure()) : dispatch(getProductOrderListSuccess(data))
    } catch (error) {
        dispatch(getProductOrderListFailure())
    }
}
