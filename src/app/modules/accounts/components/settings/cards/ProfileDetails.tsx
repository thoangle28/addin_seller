import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {IProfileDetails, profileDetailsInitValues as defaultValues} from '../SettingsModel'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { UploadImageField } from '../../../../../../_metronic/partials/content/upload/UploadFile'
import clsx from 'clsx'
import { UpdateProfileDetails, UpdateUserProfile, getUserProfile } from '../server/api'
import {RootState} from '../../../../../../setup'
import { shallowEqual, useSelector } from 'react-redux'
import { FallbackView } from '../../../../products/components/formOptions'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useHistory } from 'react-router-dom'

const phoneRegEx = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

const profileDetailsSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('First name is required'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Last name is required'),
  company: Yup.string()
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Brand name is required'),
  contactPhone: Yup.string()
    .min(1, 'Minimum 10 symbols.')
    .max(20, 'Maximum 20 symbols.') //.matches(phoneRegEx, 'Phone number is not valid')    
    .required('Contact phone is required'),
  contactEmail: Yup.string()
    .email('Wrong email format.')
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Contact email is required.'),
  address: Yup.string().required('Address is required'),
  new_avatar: Yup.string().required('Brand logo is required'),
  communications: Yup.array().transform((value, obj) => {
    if( obj.email || obj.phone) return [ obj.email || obj.phone ];
  }).required("At least email / phone is choosed")
  //country: Yup.string().required('Country is require)
  //country: Yup.string().required('Country is required'),
  //language: Yup.string().required('Language is required'),
  //timeZone: Yup.string().required('Time zone is required'),
  //currency: Yup.string().required('Currency is required'),
})

type Props = {
  onUpdateProfile?: (s: boolean) => void
}


const ProfileDetails: React.FC<Props> = ({ onUpdateProfile = (status: boolean) => undefined } : Props) => {
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const { accessToken, user } = auth 

  const initialValues: IProfileDetails = {...defaultValues}
  const [data, setData] = useState<IProfileDetails>(initialValues)
  const [forLoading, setFormLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [newBrandLogo, setNewBrandLogo] = useState('')
  
  useEffect(() => {
    const loadUserProfile = () => {
      return new Promise((resolve, reject) => {
        getUserProfile({ user_id: user.ID, user_email: user.user_email}).then((response) => {
          const userData = response.data;
          resolve(userData.data);
        }).catch(() => {})
      })
    }

    loadUserProfile().then((data) => {      
      UpdateProfileDetails(initialValues, data);
      setFormLoading(false)
    })
    
  }, [user, initialValues])

  const updateUserProfile = (formValues: any, userInfo: any) => {
    return new Promise((resolve, reject) => {
      UpdateUserProfile(formValues, userInfo).then((response) => {
        //const { code, message, data } = response.data
        resolve(response)
      }).catch(() => {})
    })
  }

  const reloadHeader = (s: boolean) => {
    onUpdateProfile(s)
  }

  const history = useHistory();
  const confirmRequest = (message: string) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h3 style={{color: '#fff'}}>Update Profile</h3>
            <p>{message}</p>           
            <button
              className='btn btn-sm btn-success'
              onClick={() => {
                reloadHeader(true)
                history.push("/account/overview");
                onClose()
              }}
            >
              Close
            </button>
          </div>
        )
      }
    })
  }

  const formik = useFormik<IProfileDetails>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values, {setStatus}) => {
      setLoading(true)     
      const userInfo = { userEmail: user.user_email, accessToken: accessToken }  
      updateUserProfile(values, userInfo).then((response: any) => {        
        const { code, message, data } = response.data   
        if(code === 200 && message === 'DONE') {
          confirmRequest('Your profile has been updated successfully.')
          setLoading(false)
          setStatus('')
        } else {
          setStatus(message)
          setLoading(false)
        }
      })
    },
  })
  
  return (
    <>
    {forLoading ? (
        <div className='card mb-5 mb-xl-8 loading-wrapper'>
          <div className='card-body py-3 loading-body'>
            <FallbackView />
          </div>
        </div>
      ) : (
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_details'
          aria-expanded='true'
          aria-controls='kt_account_profile_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profile Details</h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              {formik.status && (
                <div className='row mb-2'>
                  <div className='col-lg-12'>
                    <div className="alert alert-danger">
                      <div className='alert-text font-weight-bold'>{formik.status}</div>
                    </div>
                  </div>
                </div>
              )}
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6 required'>Brand Logo</label>
                <div className='col-lg-8'>
                  <div className='d-flex align-items-end'>
                    <div
                      className='image-input image-input-outline me-5'
                      data-kt-image-input='true'
                    >
                      {(newBrandLogo || formik.values.avatar) && (
                      <>
                        <div className='image-input-wrapper h-65px w-auto'>
                          <img className='symbol'
                            style={{ height: '100%', width: 'auto', maxWidth: '200px' }} 
                            src={ newBrandLogo ? newBrandLogo : formik.values.avatar} /> 
                        </div>
                        { newBrandLogo && (
                        <span
                          className='btn btn-icon btn-circle btn-active-color-primary w-15px h-15px bg-body shadow'
                          data-kt-image-input-action='remove'
                          data-bs-toggle='tooltip'
                          title='Remove Image'
                          id="remove_image"
                          ref={(span) => {
                            if (span) {
                              span.style.setProperty("width", "20px", "important");
                              span.style.setProperty("height", "20px", "important");
                            }
                          }}
                          onClick={(event) => {
                            setNewBrandLogo('')
                            const new_avatar = formik.values.avatar ? formik.values.avatar : ''
                            formik.setFieldValue('new_avatar', new_avatar)
                            formik.setFieldValue('brand.logo', '')
                            formik.handleChange(event)
                          }}
                        >
                          <i className='bi bi-x fs-2' id="remove_x"></i>
                        </span>
                        ) }
                      </>
                      ) || (
                        <img style={{opacity: 0.5}} 
                        className='symbol w-auto h-70px' 
                        src={toAbsoluteUrl('/media/avatars/blank.png')} />
                      )}
                    </div>
                    <UploadImageField
                      setFileToState={setNewBrandLogo}                      
                      setFieldValue={formik.setFieldValue}
                      fileName={'brand.logo'}
                      isMultiple={false}     
                      setFieldToInput={formik.setFieldValue}   
                      inputName={"new_avatar"}              
                    />                   
                  </div>
                  <div>
                    <input type="hidden" 
                      {...formik.getFieldProps('new_avatar')}
                      className={clsx(
                        'form-control form-control-lg form-control-solid',
                        {
                          'is-invalid': formik.touched.new_avatar && formik.errors.new_avatar,
                        },
                        {
                          'is-valid': formik.touched.new_avatar && !formik.errors.new_avatar,
                        }
                      )}
                    />                   
                    {formik.touched.avatar && formik.errors.avatar && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <div className='fv-help-block'>{formik.errors.avatar}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>Brand Name</label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    placeholder='Brand name'
                    {...formik.getFieldProps('company')}
                    onBlur={(event) => {
                      formik.setFieldValue('brand.name', formik.values.company)
                      formik.handleChange(event)
                    }}
                    className={clsx(
                      'form-control form-control-lg form-control-solid',
                      {
                        'is-invalid': formik.touched.company && formik.errors.company,
                      },
                      {
                        'is-valid': formik.touched.company && !formik.errors.company,
                      }
                    )}
                  />
                  {formik.touched.company && formik.errors.company && (
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <div className='fv-help-block'>{formik.errors.company}</div>
                    </div>
                  )}
                </div>
                <input
                  type='hidden'
                  {...formik.getFieldProps('brand_id')}
                />
              </div>          
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>Full Name</label>
                <div className='col-lg-8'>
                  <div className='row'>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        placeholder='First name'
                        {...formik.getFieldProps('firstname')}
                        className={clsx(
                          'form-control form-control-lg form-control-solid mb-3 mb-lg-0',
                          {
                            'is-invalid': formik.touched.firstname && formik.errors.firstname,
                          },
                          {
                            'is-valid': formik.touched.firstname && !formik.errors.firstname,
                          }
                        )}
                      />
                      {formik.touched.firstname && formik.errors.firstname && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <div className='fv-help-block'>{formik.errors.firstname}</div>
                        </div>
                      )}
                    </div>

                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        placeholder='Last name'
                        {...formik.getFieldProps('lastname')}
                        className={clsx(
                          'form-control form-control-lg form-control-solid',
                          {
                            'is-invalid': formik.touched.lastname && formik.errors.lastname,
                          },
                          {
                            'is-valid': formik.touched.lastname && !formik.errors.lastname,
                          }
                        )}
                      />
                      {formik.touched.lastname && formik.errors.lastname && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <div className='fv-help-block'>{formik.errors.lastname}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
                    
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Contact Phone</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='tel'
                    placeholder='+00 (00) 0000000'
                    {...formik.getFieldProps('contactPhone')}
                    className={clsx(
                      'form-control form-control-lg form-control-solid',
                      {
                        'is-invalid': formik.touched.contactPhone && formik.errors.contactPhone,
                      },
                      {
                        'is-valid': formik.touched.contactPhone && !formik.errors.contactPhone,
                      }
                    )}
                  />
                  {formik.touched.contactPhone && formik.errors.contactPhone && (
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <div className='fv-help-block'>{formik.errors.contactPhone}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Contact Email</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='email'
                    placeholder='Email address'
                    {...formik.getFieldProps('contactEmail')}
                    className={clsx(
                      'form-control form-control-lg form-control-solid',
                      {
                        'is-invalid': formik.touched.contactEmail && formik.errors.contactEmail,
                      },
                      {
                        'is-valid': formik.touched.contactEmail && !formik.errors.contactEmail,
                      }
                    )}
                  />
                  {formik.touched.contactEmail && formik.errors.contactEmail && (
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <div className='fv-help-block'>{formik.errors.contactEmail}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Address</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'                  
                    placeholder='Address'
                    {...formik.getFieldProps('address')}
                    className={clsx(
                      'form-control form-control-lg form-control-solid',
                      {
                        'is-invalid': formik.touched.address && formik.errors.address,
                      },
                      {
                        'is-valid': formik.touched.address && !formik.errors.address,
                      }
                    )}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <div className='fv-help-block'>{formik.errors.address}</div>
                    </div>
                  )}
                </div>
              </div>         

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Communication</label>

                <div className='col-lg-8 fv-row'>
                  <div className='d-flex align-items-center mt-3'>
                    <label className='form-check form-check-inline form-check-solid me-5'>
                      <input
                        className='form-check-input'
                        name='communications.email'
                        type='checkbox'
                        defaultChecked={data.communications?.email}
                        onChange={(event) => {
                          formik.handleChange(event)
                        }}
                      />
                      <span className='fw-bold ps-2 fs-6'>Email</span>
                    </label>

                    <label className='form-check form-check-inline form-check-solid'>
                      <input
                        className='form-check-input'
                        name='communications.phone'
                        type='checkbox'
                        defaultChecked={data.communications?.phone}
                        onChange={(event) => {   
                          formik.handleChange(event)
                        }}
                      />
                      <span className='fw-bold ps-2 fs-6'>Phone</span>
                    </label>
                  </div>
                  <div className='mt-2'>
                  {formik.touched.communications && (
                    <div className='fv-plugins-message-container invalid-feedback d-block'>
                      <div className='fv-help-block'>{formik.errors.communications}</div>
                    </div>
                  )}
                  </div>
                </div>
              </div>

              {/*   
              <div className='row mb-0'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Allow Marketing</label>
                <div className='col-lg-8 d-flex align-items-center'>
                  <div className='form-check form-check-solid form-switch fv-row'>
                    <input
                      className='form-check-input w-45px h-30px'
                      type='checkbox'
                      id='allowmarketing'
                      defaultChecked={data.allowMarketing}
                      onChange={() => {
                        updateData({allowMarketing: !data.allowMarketing})
                      }}
                    />
                    <label className='form-check-label'></label>
                  </div>
                </div>
              </div>
              */}
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
                {!loading && 'Save Changes'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  )
}

export {ProfileDetails}
