import axios from 'axios'

const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT


function getWeeklySales(params: any) {
  //{ "user_id": 6125 } 
  return axios.post<any>(API_END_POINT_URL + '/sale-report/total-product-sale', params)
}

function getItemOrders(params: any) {
  //{ "user_id": 6125 } 
  return axios.post<any>(API_END_POINT_URL + '/sale-report/total-order', params)
}

function getNewUsers(params: any) {
  //{ "user_id": 6125 } 
  return axios.post<any>(API_END_POINT_URL + '/sale-report/new-customer-by-product', params)
}

function getBugReportsByMonth(userId: any) {
  //{ "user_id": 5, "filter_by_year": "2022", "filter_by_month": 3 } 
  const filter = {user_id: userId,  filter_by_year: 2022, filter_by_month: 3 }
  return axios.post<any>(API_END_POINT_URL + '/sale-report/total-ticket', filter)
}

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
    getNewUsers({ user_id: userId})
    .then((response) => {
      resolve(response.data)
    }).catch((error) => {
        reject(error.message)
    })
  })
}

export const ItemOrders = (userId: any) => {
  return new Promise((resolve, reject) => {   
    getItemOrders({ user_id: userId})
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

export const loadAllReports = (user_id: any) => {  
  Promise.all([
    WeeklySales(user_id),
    NewUsers(user_id),
    ItemOrders(user_id),
    BugReports(user_id)
  ])
}