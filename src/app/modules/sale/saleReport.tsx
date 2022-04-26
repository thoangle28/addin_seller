import axios from 'axios'

const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT

const currentDateTime = () => {
  //{ "user_id": 5, "filter_by_year": "2022", "filter_by_month": 3 } 
  const currentTime = new Date()
  // returns the month (from 0 to 11)
  const month = currentTime.getMonth() + 1

  // returns the day of the month (from 1 to 31)
  const day = currentTime.getDate()

  // returns the year (four digits)
  const year = currentTime.getFullYear()

  return { year: year, month: month, day: day }
}

function getWeeklySales(params: any) {
  //{ "user_id": 6125 } 
  return axios.post<any>(API_END_POINT_URL + '/sale-report/total-product-sale', params)
}

function getItemOrders(params: any) {
  //{ "user_id": 6125 } 
  const date = currentDateTime()
  const filter = { ...params, filter_by_year: date.year, filter_by_month: date.month }
  return axios.post<any>(API_END_POINT_URL + '/sale-report/total-order', filter)
}

function getNewUsers(params: any) {
  //{ "user_id": 6125 } 
  return axios.post<any>(API_END_POINT_URL + '/sale-report/new-customer-by-product', params)
}


function getBugReportsByMonth(userId: any) {
  const date = currentDateTime()
  const filter = { user_id: userId, filter_by_year: date.year, filter_by_month: date.month }
  return axios.post<any>(API_END_POINT_URL + '/sale-report/total-ticket', filter)
}

function getProductSales12Months(params: any) {
  //{ "user_id": 6125 } 
  return axios.post<any>(API_END_POINT_URL + '/sale-report/total-product-sales-twelve-months', params)
}

//{ "user_id": 6125 } 
function getStatisticsSales12Months(params: any) {
  return axios.post<any>(API_END_POINT_URL + '/sale-report/total-sales-twelve-months', params)
}


export const getCustomerList = (params: any) => axios.post(API_END_POINT_URL + '/sale-report/customer-list', params)
export const getProductSaleList = (params: any) => axios.post(API_END_POINT_URL + '/sale-report/product-sale-list', params)
export const getProductOrderList = (params: any) => axios.post(API_END_POINT_URL + '/sale-report/order-list', params)
export const getRefundedList = (params: any) => axios.post(API_END_POINT_URL + '/sale-report/orders-refund', params)

export const WeeklySales = (userId: any) => {
  return new Promise((resolve, reject) => {
    getWeeklySales({ user_id: userId })
      .then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.message)
      })
  })
}

export const NewUsers = (userId: any) => {
  return new Promise((resolve, reject) => {
    getNewUsers({ user_id: userId })
      .then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.message)
      })
  })
}

export const ItemOrders = (userId: any) => {
  return new Promise((resolve, reject) => {
    getItemOrders({ user_id: userId })
      .then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.message)
      })
  })
}

export const ProductSales12Months = (userId: any) => {
  return new Promise((resolve, reject) => {
    getProductSales12Months({ user_id: userId })
      .then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.message)
      })
  })
}

export const BugReports = (userId: any) => {
  return new Promise((resolve, reject) => {
    getBugReportsByMonth(userId)
      .then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.message)
      })
  })
}

export const StatisticsSales12Months = (userId: any) => {
  return new Promise((resolve, reject) => {
    getStatisticsSales12Months({ user_id: userId })
      .then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.message)
      })
  })
}

export const loadAllReports = (user_id: any) => {
  return Promise.all([
    WeeklySales(user_id),
    NewUsers(user_id),
    ItemOrders(user_id),
    BugReports(user_id),
    ProductSales12Months(user_id),
    StatisticsSales12Months(user_id)
  ]).then(([weeklySales, newUsers, itemOrders, bugReports, productSale12M, statistics]) => {
    return { weeklySales, newUsers, itemOrders, bugReports, productSale12M, statistics }
  })
}

