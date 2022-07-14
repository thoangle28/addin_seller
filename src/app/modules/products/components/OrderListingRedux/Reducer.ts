import { actionTypes } from './Types'

const isLoading = {
    requestHasError: false,
    requestIsLoading: true,
    requestIsSuccess: false,
}
const isDetailLoading = {
    requestDetailHasError: false,
    requestDetailIsLoading: true,
    requestDetailIsSuccess: false,
}
const isSuccess = {
    requestHasError: false,
    requestIsLoading: false,
    requestIsSuccess: true,
}
const isDetailSuccess = {
    requestDetailHasError: false,
    requestDetailIsLoading: false,
    requestDetailIsSuccess: true,
}
const isError = {
    requestHasError: true,
    requestIsLoading: false,
    requestIsSuccess: false,
}
const isDetailErr = {
    requestHasError: true,
    requestIsLoading: false,
    requestIsSuccess: false,
}

const inititalState: any = {
    requestHasError: false,
    requestIsLoading: false,
    requestIsSuccess: false,
    requestDetailHasError: false,
    requestDetailIsLoading: false,
    requestDetailIsSuccess: false,
    message: '',
    orderListing: {},
    orderListingInput: {},
    orderListingInputDetails: {}
}

export const orderListingReducer = (state = inititalState, action: any) => {
    const { type, payload } = action
    switch (type) {
        case actionTypes.GET_ALL_ORDER_LISTING_FAILURE:
            return { ...state, ...isError, message: payload }
        case actionTypes.GET_ALL_ORDER_LISTING_REQUEST:
            return { ...state, ...isLoading }
        case actionTypes.GET_ALL_ORDER_LISTING_SUCCESS:
            return { ...state, ...isSuccess, orderListing: payload }
        case actionTypes.GET_ORDER_LISTING_DETAILS_FAILURE:
            return { ...state, ...isDetailErr }
        case actionTypes.GET_ORDER_LISTING_DETAILS_REQUEST:
            return { ...state, ...isDetailLoading }
        case actionTypes.GET_ORDER_LISTING_DETAILS_SUCCESS:
            return { ...state, ...isDetailSuccess, orderListingInputDetails: payload }
        case actionTypes.UPDATE_ORDER_LISTING_DETAILS_FAILURE:
            return { ...state, ...isDetailErr }
        case actionTypes.UPDATE_ORDER_LISTING_DETAILS_REQUEST:
            return { ...state, ...isLoading, ...isDetailLoading }
        case actionTypes.UPDATE_ORDER_LISTING_DETAILS_SUCCESS:
            return { ...state, ...isSuccess }
        default:
            return state
    }
}