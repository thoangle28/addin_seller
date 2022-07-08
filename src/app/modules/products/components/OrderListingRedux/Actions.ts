import { iOrderListDetailResponse, iOrderListResponse, iPayload, iUpdateData } from '../../../../../models'
import { actionTypes } from './Types'
import { getOrderListPage, getOrderDetailById, updateOrderStatus } from './../../redux/ProductsList'

const getAllOrderFail = () => ({
    type: actionTypes.GET_ALL_ORDER_LISTING_FAILURE
})
const getAllOrderRequest = () => ({
    type: actionTypes.GET_ALL_ORDER_LISTING_REQUEST
})
const getAllOrderListingSuccess = (payload: iOrderListResponse) => ({
    type: actionTypes.GET_ALL_ORDER_LISTING_SUCCESS,
    payload
})

export const fetchOrderListings = (iPayload: iPayload) => async (dispatch: any) => {
    dispatch(getAllOrderRequest())
    try {
        const res = await getOrderListPage(iPayload);
        const { data, code } = res.data
        code !== 200 ? dispatch(getAllOrderFail()) : dispatch(getAllOrderListingSuccess(data))
    } catch (error) {
        dispatch(getAllOrderRequest())
    }
}
const updateOrderListingDetailFailure = () => ({
    type: actionTypes.UPDATE_ORDER_LISTING_DETAILS_FAILURE
})
const updateOrderListingDetailRequest = () => ({
    type: actionTypes.UPDATE_ORDER_LISTING_DETAILS_REQUEST
})
const updateOrderListingDetailSuccess = () => ({
    type: actionTypes.UPDATE_ORDER_LISTING_DETAILS_SUCCESS
})

export const updateOrderListingDetail = (payload: iUpdateData) => async (dispatch: any) => {
    dispatch(updateOrderListingDetailRequest())
    try {
        const res = await updateOrderStatus(payload)
        const { code } = res.data
        code !== 200 ? dispatch(updateOrderListingDetailFailure()) : dispatch(updateOrderListingDetailSuccess())
    } catch (error) {
        dispatch(updateOrderListingDetailFailure())
    }
}

const getOrderDetailFailure = () => ({
    type: actionTypes.GET_ORDER_LISTING_DETAILS_FAILURE
})

const getOrderDetailRequest = () => ({
    type: actionTypes.GET_ORDER_LISTING_DETAILS_REQUEST
})

const getOrderDetailSuccess = (payload: iOrderListDetailResponse) => ({
    type: actionTypes.GET_ORDER_LISTING_DETAILS_SUCCESS,
    payload
})

export const getOrderListingById = (id: string | number, order_id: string, access_token: string) => async (dispatch: any) => {
    dispatch(getOrderDetailRequest())
    try {
        const res = await getOrderDetailById(id, order_id, access_token);
        const { data, code } = res.data
        code !== 200 ? dispatch(getOrderDetailFailure()) : dispatch(getOrderDetailSuccess(data))
    } catch (error) {
        dispatch(getOrderDetailFailure())
    }
}
