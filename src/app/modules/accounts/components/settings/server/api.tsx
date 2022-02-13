import axios from 'axios'
import { userInfo } from 'os';
import { IProfileDetails } from '../SettingsModel';

const API_END_POINT_URL = process.env.REACT_APP_API_END_POINT

export function getBrandDetail(Id: number | 0) {
    return axios.post<any>(API_END_POINT_URL + '/product/brand', { id: Id});
}

export function getUserProfile( user: any) {
    return axios.post<any>(API_END_POINT_URL + '/user/profile', {user: user})
}

export function UpdateUserProfile( profileInfo: IProfileDetails, userInfo: any) {
    return axios.post<any>(API_END_POINT_URL + '/user/profile/update', { profile: profileInfo, userInfo: userInfo })
}

//get user info
export const UserProfile = ( UserInfo: any, accessToken: string ) => {    
    getUserProfile(UserInfo).then((response) => {
        return response.data;
    }).catch(() => {})
}

export const UpdateProfileDetails = (formValues: IProfileDetails, UserInfo: any) => {    
    formValues.email = UserInfo.email
    formValues.firstname = UserInfo.firstname;
    formValues.lastname = UserInfo.lastname;
    formValues.contactEmail = UserInfo.contactEmail;
    formValues.contactPhone = UserInfo.contactPhone;
    formValues.address = UserInfo.address;
    formValues.communications = UserInfo.communications;
    formValues.brand = UserInfo.brand;
    formValues.company = UserInfo.brand.name;
    formValues.avatar = UserInfo.avatar;
}