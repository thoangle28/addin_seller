import * as supportDB from './supportDB'

export interface iTicket {
    subject: string
    messages: string
    customer: number | null
    category: string
    orderId: number | null
    productId: number | null
    attachments: [string] | []
    sellerId: number | null
}
////////////////////////////////
export const defaultValues: iTicket = {
    subject: '',
    messages: '',
    customer: 0,
    category: '',
    orderId: 0,
    productId: 0,
    attachments: [],
    sellerId: 0
}

////////////////////////////////
export const GetTicketsListing = (params: any) => {
    return new Promise((resolve, reject) => {
        supportDB.getTicketsListing(params)
        .then((response) => {
            const result = response.data ? response.data : [1,2,3,4,5,6,7,8,9,10,11,12]
            resolve(result)
        }).catch((error) => {
            resolve([1,2,3,4,5,6,7,8,9,10,11,12])
            reject(error.message)
        })
        /* setTimeout(() => {
            resolve('OK')
        }, 3000) */
    })
}

export const CreateNewTicket = (params: any) => {
    return new Promise((resolve, reject) => {
        supportDB.getTicketsListing(params)
        .then((response) => {
            const result = response.data ? response.data : [1,2,3,4,5,6,7,8,9,10,11,12]
            resolve(result)
        }).catch((error) => {
            resolve([1,2,3,4,5,6,7,8,9,10,11,12])
            reject(error.message)
        })
        /* setTimeout(() => {
            resolve('OK')
        }, 3000) */
    })
}