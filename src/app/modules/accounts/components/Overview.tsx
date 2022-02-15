/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../../setup'
import { getUserProfile, UpdateProfileDetails } from './settings/server/api'
import { IProfileDetails, profileDetailsInitValues as defaultValues } from './settings/SettingsModel'
import { FallbackView } from '../../products/components/formOptions'
/* import {KTSVG} from '../../../../_metronic/helpers'
import {
  ChartsWidget1,
  TablesWidget1,
  ListsWidget5,
  TablesWidget5,
} from '../../../../_metronic/partials/widgets' */

export function Overview() {
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const { accessToken, user } = auth
  const userProfile: IProfileDetails = {...defaultValues}

  const [loading, setLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({...defaultValues})

  useEffect(() => {
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
    
  }, [user, setLoading])

  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profile Details</h3>
          </div>
          { !loading && 
          <Link to='/account/settings' className='btn btn-primary align-self-center btn-sm'>
            Edit Profile
          </Link> }
        </div>
        { loading ? (
          <div className='card-body py-10 loading-body'>
           <FallbackView />
          </div>
        ) : (
          <div className='card-body p-9'> 
            <div className='row mb-7'>
              <label className='col-lg-4 fw-bold text-muted'>Brand Name</label>

              <div className='col-lg-8 fv-row'>
                <span className='fw-bold fs-6'>{initialValues.company}</span>
              </div>
            </div>         
            <div className='row mb-7'>
              <label className='col-lg-4 fw-bold text-muted'>
                Full Name
                <i
                  className='fas fa-exclamation-circle ms-1 fs-7'
                  data-bs-toggle='tooltip'
                  title='Full name is contact person name'
                ></i>
              </label>
              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 text-dark'>{initialValues.firstname + ' ' + initialValues.lastname}</span>
              </div>
            </div>
            <div className='row mb-7'>
              <label className='col-lg-4 fw-bold text-muted'>
                Contact Phone
                <i
                  className='fas fa-exclamation-circle ms-1 fs-7'
                  data-bs-toggle='tooltip'
                  title='Phone number must be active'
                ></i>
              </label>

              <div className='col-lg-8 d-flex align-items-center'>
                <span className='fw-bolder fs-6 me-2'>{initialValues.contactPhone}</span>
                {initialValues.contactPhone && <span className='badge badge-success'>Verified</span>}
              </div>
            </div>

            <div className='row mb-7'>
              <label className='col-lg-4 fw-bold text-muted'>
                Contact Email
                <i
                  className='fas fa-exclamation-circle ms-1 fs-7'
                  data-bs-toggle='tooltip'
                  title='Email address must be active'
                ></i>
                </label>
              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 me-2'>{initialValues.contactEmail}</span>
                {initialValues.contactEmail && <span className='badge badge-success'>Verified</span>}
              </div>
            </div>

            <div className='row mb-7'>
              <label className='col-lg-4 fw-bold text-muted'>Address</label>
              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 me-2'>{initialValues.address}</span>
              </div>
            </div>

          {/*  <div className='row mb-7'>
              <label className='col-lg-4 fw-bold text-muted'>
                Country
                <i
                  className='fas fa-exclamation-circle ms-1 fs-7'
                  data-bs-toggle='tooltip'
                  title='Country of origination'
                ></i>
              </label>

              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 text-dark'>Germany</span>
              </div>
            </div> */}

            <div className='row mb-7'>
              <label className='col-lg-4 fw-bold text-muted'>Communications</label>

              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 text-dark'>
                  {
                    (initialValues.communications.email 
                    && initialValues.communications.phone) 
                    ? 'Email, Phone' 
                    : (initialValues.communications.email && 'Email' 
                    || initialValues.communications.phone && 'Phone')
                  }
                </span>
              </div>
            </div>

          {/*  <div className='row mb-10'>
              <label className='col-lg-4 fw-bold text-muted'>Allow Changes</label>

              <div className='col-lg-8'>
                <span className='fw-bold fs-6'>Yes</span>
              </div>
            </div> */}

            {/* <div className='notice d-flex bg-light-warning rounded border-warning border border-dashed p-6'>
              <KTSVG
                path='icons/duotune/general/gen044.svg'
                className='svg-icon-2tx svg-icon-warning me-4'
              />
              <div className='d-flex flex-stack flex-grow-1'>
                <div className='fw-bold'>
                  <h4 className='text-gray-800 fw-bolder'>We need your attention!</h4>
                  <div className='fs-6 text-gray-600'>
                    Your payment was declined. To start using tools, please
                    <Link className='fw-bolder' to='/crafted/account/settings'>
                      {' '}
                      Add Payment Method
                    </Link>
                    .
                  </div>
                </div>
              </div>
            </div> */}
          </div>)}
      </div>

      {/* <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ChartsWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div>

      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ListsWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div> */}
    </>
  )
}
