import { actionTypes } from './Types'

const inititalState: any = {
    orderListing: {},
    orderListingInput: {},
    orderListingInputDetails: {}
}

export const orderListingReducer = (state = inititalState, action: any) => {
    const { type, payload } = action
    switch (type) {
        case actionTypes.GET_ALL_ORDER_LISTINGS:
            return {
                ...state, orderListing: payload
            }
        case actionTypes.GET_ORDER_LISTING_INPUT:
            return {
                ...state, orderListingInput: payload
            }
        case actionTypes.GET_ORDER_LISTING_DETAILS:
            return {
                ...state, orderListingInputDetails: payload
            }
        default:
            return state
    }
}