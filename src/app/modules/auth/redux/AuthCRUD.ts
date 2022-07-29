import axios from 'axios'
import { UserModel } from '../models/UserModel'

const API_URL = process.env.REACT_APP_API_URL

interface IRequestPasswordValidation {
  new_password: string;
  password_confirm: string;
  reset_token: string;
}

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`
//-------------------------------------------------------------------
const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT
//export const END_POINT = 
export function signup(email: string, password: string) {
  const args = { username: email, password: password };
  const result = axios.post(API_END_POINT_URL + '/login', args);
  return result
}
// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.get(LOGIN_URL, {
    params: {
      email: email,
      password: password,
    },
  })
}

// Server should return AuthModel
/* export function register(email: string, firstname: string, lastname: string, password: string) {
  return axios.post<AuthModel>(API_END_POINT_URL+ '/register', {
    email,
    firstname,
    lastname,
    password,
  })
} */
export function register(email: string, firstname: string,
  lastname: string, password: string, brand: string) {
  const params = { email, firstname, lastname, password, brand }
  return axios.post<any>(API_END_POINT_URL + '/register', params)
}
// Server should return object => { result: boolean } (Is Email in DB)
export const requestPassword = (user_email: string) => axios.post(API_END_POINT_URL + "/user/profile/send-mail-forgot-password", { user_email })
export const requestValidatePassword = (payload: IRequestPasswordValidation) => axios.post(API_END_POINT_URL + '/user/profile/password-recovery', payload)
export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL)
}


export function getUserByAccessToken(token: string, user_id: number) {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.post<any | UserModel>(API_END_POINT_URL + '/verify_token', { access_token: token, user_id: user_id })
}

export function getTermsAndConditions() {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.get<any>(API_END_POINT_URL + '/terms-and-conditions')
}
