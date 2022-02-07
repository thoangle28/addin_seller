import axios from 'axios'
import {AuthModel} from '../models/AuthModel'
import {UserModel} from '../models/UserModel'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`
//-------------------------------------------------------------------
const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT
//export const END_POINT = 
export function signup(email: string, password: string) {
  const args = { username: email, password: password };
  const result = axios.post(API_END_POINT_URL+ '/login', args);
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
export function register(email: string, firstname: string, lastname: string, password: string) {
  return axios.post<any>(API_END_POINT_URL+ '/register', {
    email,
    firstname,
    lastname,
    password,
  })
}
// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.get<{result: boolean}>(REQUEST_PASSWORD_URL, {
    params: {
      email: email,
    },
  })
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL)
}


export function getUserByAccessToken( token: string, user_id: number ) {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.post<any | UserModel>(API_END_POINT_URL + '/verify_token', { access_token: token, user_id: user_id })
}