import { iOrderListDetailResponse, iOrderListResponse, iPayload, iUpdateData } from '../../../../../models'
import { actionTypes } from './Types'

export const actions = {
    getAllOrderListing: (payload: iOrderListResponse) => ({
        type: actionTypes.GET_ALL_ORDER_LISTINGS,
        payload
    }),
    getOrderListingDetails: (payload: iOrderListDetailResponse) => ({
        type: actionTypes.GET_ORDER_LISTING_DETAILS,
        payload
    }),
    updateOrderListingDetails: (payload: iUpdateData | undefined) => ({
        type: actionTypes.UPDATE_ORDER_LISTING_DETAILS,
        payload
    }), 
}