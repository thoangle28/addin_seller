import React, { useEffect, useState } from 'react'
import {ProfileDetails} from './cards/ProfileDetails'
import {SignInMethod} from './cards/SignInMethod'
/* import {ConnectedAccounts} from './cards/ConnectedAccounts'
import {EmailPreferences} from './cards/EmailPreferences'
import {Notifications} from './cards/Notifications' */
import {DeactivateAccount} from './cards/DeactivateAccount'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../../../setup'
import { IProfileDetails, profileDetailsInitValues as defaultValues } from './SettingsModel'
import { getUserProfile } from './server/api'

export function Settings() {

  //const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  //const { accessToken, user } = auth
  //const userProfile: IProfileDetails = {...defaultValues}
  
  //const [initialValues, setInitialValues] = useState({...defaultValues})
  const [loading, setLoading] = useState(true)

  /* useEffect(() => {
    const loadUserProfile = () => {
      return new Promise((resolve, reject) => {
        getUserProfile({ user_id: user.ID, user_email: user.user_email}).then((response) => {
          const userData = response.data;
          resolve(userData.data);
        }).catch(() => {})
      })
    }

    loadUserProfile().then((data: any) => {
      setInitialValues(data);
      setLoading(false)
    })
    
  }, [user, setLoading]) */

  return (
    <>
      <ProfileDetails />
      <SignInMethod />
      {/* <ConnectedAccounts />
      <EmailPreferences />
      <Notifications /> */}
      <DeactivateAccount />
    </>
  )
}
