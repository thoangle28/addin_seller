import axios from 'axios'
import { IProfileDetails } from '../SettingsModel';

const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT

export function getBrandDetail(Id: number | 0) {
    return axios.post<any>(API_END_POINT_URL + '/product/brand', { id: Id});
}

export function getUserProfile( userId: number | 0) {
    return axios.post<any>(API_END_POINT_URL + '/user/profile', {userId: userId})
}

export function updateUserProfile( user: IProfileDetails) {
    return axios.post<any>(API_END_POINT_URL + '/user/profile/update', {...user})
}