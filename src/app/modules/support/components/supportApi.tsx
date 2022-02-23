import * as supportDB from './supportDB'

export interface iTicket {
    subject: string
    message: string
    customer: number | string
    customer_id: number
    category: string
    orderId: string
    productId: string
    attachments: Array<string>| []
    sellerId: string
    accessToken?: string
}
////////////////////////////////
export const defaultValues: iTicket = {
    subject: '',
    message: '',
    customer: '',
    customer_id: 0,
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
            const result = response.data ? response.data : []
            resolve(result)
        }).catch((error) => {
            resolve([])
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


export const GetTicketDetails = (ticketID: number, userInfo: any) => {
    return new Promise((resolve, reject) => {
        supportDB.GetTicketDetails(ticketID, userInfo)
        .then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error.message)
        })
    })
}


export const GetProductsByOrder = (params: any) => {
    return new Promise((resolve, reject) => {
        supportDB.GetProductsByOrder(params)
        .then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error.message)
        })
    })
}

export const GetOrdersListOfCustomer = (params: any) => {
    return new Promise((resolve, reject) => {
        supportDB.GetOrdersListOfCustomer(params)
        .then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error.message)
        })
    })
}

export const CreateMesssageTicket = (params: any) => {
    return new Promise((resolve, reject) => {
        supportDB.CreateMesssageTicket(params)
        .then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error.message)
        })
    })
}

export const GetBrands = (params: any) => {
    return new Promise((resolve, reject) => {
        supportDB.GetBrands(params)
        .then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error.message)
        })
    })
}


////////////////////////////////
export const CreatePagination = (currentPage: number, maxPage: number) => {
    const step = 5
    let beginBlock = 1
    let begin: number = 1
    let next_end = step * beginBlock
  
    while (currentPage > next_end) {
      beginBlock++ //next with 5 items
      next_end = step * beginBlock
    }
  
    begin = next_end - step + 1
    let end: number = next_end
    end = end > maxPage ? maxPage : end
    
    const listPages = []
    //fist
    listPages.push({ label: '«', page: 1, class: 'btn-light-primary' })
    //previous
    listPages.push({ label: '‹', page: (currentPage - 1) <= 0 ? 1 : currentPage - 1, class: 'btn-light-primary' })
    //list page with 5 items
    for (let index = begin; index <= end; index++) {
      listPages.push({ label: index, page: index, class: (currentPage === index ? 'active' : '') })    
    }
    //next
    listPages.push({ label: '›', page: (currentPage + 1) > maxPage ? maxPage : currentPage + 1, class: 'btn-light-primary' })
    //last
    listPages.push({ label: '»', page: maxPage, class: 'btn-light-primary' })
  
    return listPages
  }