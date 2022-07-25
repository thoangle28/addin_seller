import { iPayload, iUpdateData } from '../../../../../models'
import { actionTypes } from './Types'
import { getOrderListPage, getOrderDetailById, updateOrderStatus } from './../../redux/ProductsList'

const isSuccess = (type: string, payload?: any) => ({ type, payload });
const isFailure = (type: string, payload?: any) => ({ type, payload })
const isRequest = (type: string) => ({ type })

export const fetchOrderListings = (iPayload: iPayload) => async (dispatch: any) => {
    dispatch(isRequest(actionTypes.GET_ALL_ORDER_LISTING_REQUEST))
    try {
        const res = await getOrderListPage(iPayload);
        const { data, code, message } = res.data
        code !== 200 ? dispatch(isFailure(actionTypes.GET_ALL_ORDER_LISTING_FAILURE, message)) : dispatch(isSuccess(actionTypes.GET_ALL_ORDER_LISTING_SUCCESS, data))
    } catch (error: any) {
        dispatch(isFailure(actionTypes.GET_ALL_ORDER_LISTING_FAILURE, error.message))
    }
}

export const updateOrderListingDetail = (payload: iUpdateData) => async (dispatch: any) => {
    dispatch(isRequest(actionTypes.UPDATE_ORDER_LISTING_DETAILS_REQUEST))
    try {
        const res = await updateOrderStatus(payload)
        const { code } = res.data
        code !== 200 ? dispatch(isFailure(actionTypes.UPDATE_ORDER_LISTING_DETAILS_FAILURE)) : dispatch((actionTypes.UPDATE_ORDER_LISTING_DETAILS_SUCCESS))
    } catch (error) {
        dispatch(isFailure(actionTypes.UPDATE_ORDER_LISTING_DETAILS_FAILURE))
    }
}

export const getOrderListingById = (id: string | number, order_id: string, access_token: string) => async (dispatch: any) => {
    dispatch(isRequest(actionTypes.GET_ORDER_LISTING_DETAILS_REQUEST))
    try {
        const res = await getOrderDetailById(id, order_id, access_token);
        const { data, code } = res.data
        code !== 200 ? dispatch(isFailure(actionTypes.GET_ORDER_LISTING_DETAILS_FAILURE)) : dispatch(isSuccess(actionTypes.GET_ORDER_LISTING_DETAILS_SUCCESS, data))
    } catch (error) {
        dispatch(isFailure(actionTypes.GET_ORDER_LISTING_DETAILS_FAILURE))
    }
}
