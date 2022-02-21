import * as supportDB from './supportDB'

export interface iTicket {
    subject: string
    message: string
    customer: number | string
    category: string
    orderId: string
    productId: string
    attachments: Array<string>| []
    sellerId: string
}
////////////////////////////////
export const defaultValues: iTicket = {
    subject: '',
    message: '',
    customer: '',
    category: '',
    orderId: '',
    productId: '',
    attachments: [],
    sellerId: ''
}

////////////////////////////////
export const GetTicketsListing = (params: any) => {
    return new Promise((resolve, reject) => {
        supportDB.GetTicketsListing(params)
        .then((response) => {
            const result = response.data ? response.data : [1,2,3,4,5,6,7,8,9,10,11,12]
            resolve(result)
        }).catch((error) => {
            resolve([1,2,3,4,5,6,7,8,9,10,11,12])
            reject(error.message)
        })
    })
}

export const CreateNewTicket = (params: iTicket, userInfo: any) => {
    return new Promise((resolve, reject) => {
        supportDB.CreateTicket(params, userInfo)
        .then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error.message)
        })
    })
}


export const GetProductsByOrder = (orderId: number) => {
    return new Promise((resolve, reject) => {
        supportDB.GetProductsByOrder(orderId)
        .then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error.message)
        })
    })
}