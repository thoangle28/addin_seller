import React, {useState} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {IProfileDetails, profileDetailsInitValues as initialValues} from '../SettingsModel'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { handleFileUpload,  UploadImageField } from '../../../../../../_metronic/partials/content/upload/UploadFile'
import clsx from 'clsx'

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
    .required('Company name is required'),
  contactPhone: Yup.string()
    .min(1, 'Minimum 10 symbols.')
    .max(20, 'Maximum 20 symbols.')
    .matches(phoneRegEx, 'Phone number is not valid')
    .required('Contact phone is required'),
  contactEmail: Yup.string()
    .email('Wrong email format.')
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Contact email is required.'),
  address: Yup.string().required('Company site is required'),
  //country: Yup.string().required('Country is required'),
  //language: Yup.string().required('Language is required'),
  //timeZone: Yup.string().required('Time zone is required'),
  //currency: Yup.string().required('Currency is required'),
})

const ProfileDetails: React.FC = () => {
  const [data, setData] = useState<IProfileDetails>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [loading, setLoading] = useState(false)
  const [newBrandLogo, setNewBrandLogo] = useState('')

  const formik = useFormik<IProfileDetails>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        values.communications.email = data.communications.email
        values.communications.phone = data.communications.phone
        values.allowMarketing = data.allowMarketing
        const updatedData = Object.assign(data, values)
        setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })
  
  return (
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
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Brand Logo</label>
              <div className='col-lg-8'>
                <div className='d-flex align-items-end'>
                  <div
                    className='image-input image-input-outline me-2'
                    data-kt-image-input='true'
                    style={{backgroundImage: `url(${toAbsoluteUrl('/media/avatars/blank.png')})`}}
                  >
                    { newBrandLogo ?
                    (<div
                        className='image-input-wrapper w-100px h-100px'
                        style={{backgroundImage: `url(${newBrandLogo})`}}
                      ></div>) : (
                      <div
                        className='image-input-wrapper w-100px h-100px'
                        style={{backgroundImage: `url(${toAbsoluteUrl(data.avatar)})`}}
                      ></div>
                    )}
                  </div>

                  <UploadImageField
                    setFileToState={setNewBrandLogo}
                    setFieldValue={formik.setFieldValue}
                    fileName='brand_logo'
                    isMultiple={false}
                  />
                </div>
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Brand Name</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  placeholder='Company name'
                  {...formik.getFieldProps('company')}
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
                  placeholder='+00 (000) 000 0000'
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
                      name='communication[]'
                      type='checkbox'
                      defaultChecked={data.communications?.email}
                      onChange={() => {
                        updateData({
                          communications: {
                            email: !data.communications?.email,
                            phone: data.communications?.phone,
                          },
                        })
                      }}
                    />
                    <span className='fw-bold ps-2 fs-6'>Email</span>
                  </label>

                  <label className='form-check form-check-inline form-check-solid'>
                    <input
                      className='form-check-input'
                      name='communication[]'
                      type='checkbox'
                      defaultChecked={data.communications?.phone}
                      onChange={() => {
                        updateData({
                          communications: {
                            email: data.communications?.email,
                            phone: !data.communications?.phone,
                          },
                        })
                      }}
                    />
                    <span className='fw-bold ps-2 fs-6'>Phone</span>
                  </label>
                </div>
              </div>
            </div>

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
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
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
  )
}

export {ProfileDetails}
