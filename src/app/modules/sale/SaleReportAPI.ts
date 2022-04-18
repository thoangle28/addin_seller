import axios from 'axios'

const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT

export const TotalYearData = (user_id: string | number) => axios.post(API_END_POINT_URL + '/sale-report/total-product-sales-twelve-months', { user_id })