import { delay } from "redux-saga/effects"
import { actionTypes } from "./Types"

const getAllStatusOrder = (data: any) => {
    return {
        type: actionTypes.getAllStatusOrder,
        payload: data
    }
}

function* sagaGetAllStatusOrder(action: any) {
    
    yield delay(100)
}

export const actions = {
    getAllStatusOrder
}