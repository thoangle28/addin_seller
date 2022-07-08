import { actionTypes } from './Types'

const inititalState: any = {
    requestHasError: false,
    requestIsLoading: false,
    requestIsSuccess: false,
    requestDetailHasError: false,
    requestDetailIsLoading: false,
    requestDetailIsSuccess: false,
    orderListing: {},
    orderListingInput: {},
    orderListingInputDetails: {}
}

export const orderListingReducer = (state = inititalState, action: any) => {
    const { type, payload } = action
    console.log(type)
    switch (type) {
        case actionTypes.GET_ALL_ORDER_LISTING_FAILURE:
            return {
                ...state,
                requestHasError: true,
                requestIsLoading: false,
                requestIsSuccess: false,
            }
        case actionTypes.GET_ALL_ORDER_LISTING_REQUEST: {
            return {
                ...state,
                requestHasError: false,
                requestIsLoading: true,
                requestIsSuccess: false,
            }
        }
        case actionTypes.GET_ALL_ORDER_LISTING_SUCCESS:
            return {
                ...state,
                requestIsSuccess: true,
                requestHasError: false,
                requestIsLoading: false,
                orderListing: payload,
            }
        case actionTypes.GET_ORDER_LISTING_DETAILS_FAILURE:
            return {
                ...state,
                requestDetailHasError: true,
                requestDetailIsLoading: false,
                requestDetailIsSuccess: false,
            }
        case actionTypes.GET_ORDER_LISTING_DETAILS_REQUEST: {
            return {
                ...state,
                requestDetailHasError: false,
                requestDetailIsLoading: true,
                requestDetailIsSuccess: false,
            }
        }
        case actionTypes.GET_ORDER_LISTING_DETAILS_SUCCESS:
            return {
                ...state,
                requestDetailIsSuccess: true,
                requestDetailHasError: false,
                requestDetailIsLoading: false,
                orderListingInputDetails: payload
            }
        case actionTypes.UPDATE_ORDER_LISTING_DETAILS_FAILURE: {
            return {
                ...state,
                requestHasError: true,
                requestIsLoading: false,
                requestIsSuccess: false
            }
        }
        case actionTypes.UPDATE_ORDER_LISTING_DETAILS_REQUEST: {
            return {
                ...state,
                requestHasError: false,
                requestIsLoading: true,
                requestIsSuccess: false,
                requestDetailIsSuccess: false,
                requestDetailHasError: false,
                requestDetailIsLoading: true,
            }
        }
        case actionTypes.UPDATE_ORDER_LISTING_DETAILS_SUCCESS: {
            return {
                ...state,
                requestHasError: false,
                requestIsLoading: false,
                requestIsSuccess: true
            }
        }
        default:
            return state
    }
}