/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {Link} from 'react-router-dom' 
import {useLocation} from 'react-router'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../setup'
import { profileDetailsInitValues as defaultValues } from './components/settings/SettingsModel'
import { getUserProfile } from './components/settings/server/api'

type Props = {
  reload: any
}
const AccountHeader: React.FC<Props> = ({reload} : Props) => {  
  const location = useLocation()
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const {  user } = auth
  //const userProfile: IProfileDetails = {...defaultValues}
  const [initialValues, setInitialValues] = useState({...defaultValues}) 

  useEffect(() => {
    const loadUserProfile = () => {
      return new Promise((resolve, reject) => {
        getUserProfile({ user_id: user.ID, user_email: user.user_email}).then((response) => {
          const userData = response.data     
          resolve(userData.data)
        }).catch(() => {})
      })
    }

    loadUserProfile().then((data: any) => {
      setInitialValues(data); 
    })
    
  }, [user, reload]) 
  
  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div 
              className='symbol symbol-100px symbol-lg-100px symbol-fixed position-relative h-70px d-flex align-items-center border border-2 overflow-hidden;'>
              { initialValues.personal_photo && (
              <><img className='w-auto h-75px' src={toAbsoluteUrl(initialValues.personal_photo)} />
              <div className='position-absolute translate-middle bottom-0 mb-3 start-100 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
              </>) || (
                <img style={{opacity: 0.5}} className='w-auto h-70px' src={toAbsoluteUrl('/media/avatars/blank.png')} />
              )}
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                  {initialValues.firstname + ' ' + initialValues.lastname}
                  </a>
                  { (initialValues.firstname || initialValues.lastname) &&
                  <a href='#'>
                    <KTSVG
                      path='/media/icons/duotune/general/gen026.svg'
                      className='svg-icon-1 svg-icon-primary'
                    />
                  </a> }                 
                </div>

                <div className='mb-4 pe-2'>
                  <div className="d-flex flex-wrap fw-normal fs-6">
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/communication/com006.svg'
                      className='svg-icon-4 me-1'
                    />
                    {initialValues.company}
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen018.svg'
                      className='svg-icon-4 me-1'
                    />
                    {initialValues.address}
                  </a>
                  </div>
                  <div className="d-flex flex-wrap fw-normal fs-6">
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary mb-2 me-5'
                  >
                    <KTSVG
                      path='/media/icons/duotune/communication/com011.svg'
                      className='svg-icon-4 me-1'
                    />
                    {initialValues.contactEmail}
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/communication/com004.svg'
                      className='svg-icon-4 me-1'
                    />
                    {initialValues.contactPhone}
                  </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='d-flex overflow-auto h-55px'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/account/overview' && 'active')
                }
                to='/account/overview'
              >
                Overview
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/account/settings' && 'active')
                }
                to='/account/settings'
              >
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {AccountHeader}
