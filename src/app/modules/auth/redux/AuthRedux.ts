import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {put, takeLatest} from 'redux-saga/effects'
import {UserModel} from '../models/UserModel'
import {getUserByToken} from './AuthCRUD'

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Signup: '[Signup] Action',
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
  UserRequestedSuccess: '[Request User Success] Action',
}

const initialAuthState: IAuthState = {
  user: undefined,
  accessToken: undefined,
  expireDate: undefined,
  expireTime: undefined
}

export interface IAuthState {
  user?: any | UserModel
  accessToken?: string
  expireDate?: string
  expireTime?: string
}

export const reducer = persistReducer(
  {storage, key: 'addin-seller-auth', whitelist: ['user', 'accessToken','expireDate']},
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {

      case actionTypes.Signup: {
        const accessToken = action.payload?.accessToken
        const expireDate = action.payload?.expireDate
        const user = action.payload?.user
       
        return {accessToken, user, expireDate}
      }

      case actionTypes.Login: {
        const accessToken = action.payload?.accessToken
        return {accessToken, user: undefined, expireDate: undefined}
      }

      case actionTypes.Register: {
        const accessToken = action.payload?.accessToken
        return {accessToken, user: undefined, expireDate: undefined}
      }

      case actionTypes.Logout: {
        return initialAuthState
      }

      case actionTypes.UserRequested: {
        return {...state, user: undefined}
      }

      case actionTypes.UserRequestedSuccess: { 
        return {...state}
      }

      case actionTypes.UserLoaded: { 
        const user = action.payload?.user  
        return {...state, user}
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        return {...state, user}
      }

      default:
        return state
    }
  }
)

export const actions = {
  signup: (accessToken: string, expireDate: string, user: any) => ({
    type: actionTypes.Signup, 
    payload: {accessToken, expireDate, user}
  }),
  login: (accessToken: string) => ({type: actionTypes.Login, payload: {accessToken}}),
  register: (accessToken: string) => ({
    type: actionTypes.Register,
    payload: {accessToken},
  }),
  logout: () => ({type: actionTypes.Logout}),
  requestUser: () => ({
    type: actionTypes.UserRequested,
  }),
  fulfillUser: (user: UserModel) => ({type: actionTypes.UserLoaded, payload: {user}}),
  setUser: (user: UserModel) => ({type: actionTypes.SetUser, payload: {user}}),
  requestUserSuccess: () => ({
    type: actionTypes.UserRequestedSuccess,
  })
}

export function* saga() {

  yield takeLatest(actionTypes.Signup, function* signupSaga() { 
    yield put(actions.requestUserSuccess())
  })

  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const {data: user} = yield getUserByToken() 
    yield put(actions.fulfillUser(user))
  })
}
