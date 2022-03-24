/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { KTSVG } from '../../../../../../_metronic/helpers'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { shallowEqual, useSelector } from 'react-redux'
import { IUpdatePassword, IUpdateEmail, updatePassword, updateEmail } from '../SettingsModel'
import { confirmAlert } from 'react-confirm-alert'

import { RootState } from '../../../../../../setup'
import { useHistory } from 'react-router-dom'
import { changePassword } from '../server/api'
import clsx from 'clsx'

const emailFormValidationSchema = Yup.object().shape({
  newEmail: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  confirmPassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const passwordFormValidationSchema = Yup.object().shape({
  old_password: Yup.string()
    .min(6, 'Minimum 6 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  new_password: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character."
    ),
  password_confirm: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required')
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
})

const SignInMethod: React.FC = () => {
  // Declares selector 
  const auth: any = useSelector<RootState>(({ auth }) => auth, shallowEqual)
  const { user } = auth
  // Declare States
  const [emailUpdateData, setEmailUpdateData] = useState<IUpdateEmail>(updateEmail)
  const [passwordUpdateData, setPasswordUpdateData] = useState<IUpdatePassword>(updatePassword)

  const [showEmailForm, setShowEmailForm] = useState<boolean>(false)
  const [showPasswordForm, setPasswordForm] = useState<boolean>(false)

  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)


  const formik1 = useFormik<IUpdateEmail>({
    initialValues: {
      ...emailUpdateData,
    },
    validationSchema: emailFormValidationSchema,
    onSubmit: (values) => {
      setLoading1(true)
      setTimeout((values) => {
        setEmailUpdateData(values)
        setLoading1(false)
        setShowEmailForm(false)
      }, 1000)
    },
  })
  const history = useHistory();

  const confirmRequest = (code: number, message: string) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h3 style={{ color: '#fff' }}>Change Password</h3>
            <p className="mt-5">{message}</p>
            <button
              className={`btn btn-sm ${code === 200 ? 'btn-success' : 'btn-danger'}`}
              onClick={() => {
                if (code === 200) {
                  history.push("/logout");
                  onClose()
                }
              }}
            >
              Close
            </button>
          </div>
        )
      }
    })
  }

  const formik2 = useFormik<IUpdatePassword>({
    initialValues: {
      ...passwordUpdateData,
    },
    validationSchema: passwordFormValidationSchema,
    onSubmit: (values) => {
      const userInfo = { user_id: user.ID }
      setLoading2(true)
      const payload = {
        ...values,
        ...userInfo
      }
      changePassword('change-password', payload).then(res => {
        const { code, message } = res.data
        setLoading2(false)
        confirmRequest(code, message)
      }).catch(err => console.log(err))
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_signin_method'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Sign-in Method</h3>
        </div>
      </div>

      <div id='kt_account_signin_method' className='collapse show'>
        <div className='card-body border-top p-9'>
          {/* <div className='d-flex flex-wrap align-items-center'>
            <div id='kt_signin_email' className={' ' + (showEmailForm && 'd-none')}>
              <div className='fs-6 fw-bolder mb-1'>Email Address</div>
              <div className='fw-bold text-gray-600'>support@keenthemes.com</div>
            </div>

            <div
              id='kt_signin_email_edit'
              className={'flex-row-fluid ' + (!showEmailForm && 'd-none')}
            >
              <form
                onSubmit={formik1.handleSubmit}
                id='kt_signin_change_email'
                className='form'
                noValidate
              >
                <div className='row mb-6'>
                  <div className='col-lg-6 mb-4 mb-lg-0'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='emailaddress' className='form-label fs-6 fw-bolder mb-3'>
                        Enter New Email Address
                      </label>
                      <input
                        type='email'
                        className='form-control form-control-lg form-control-solid'
                        id='emailaddress'
                        placeholder='Email Address'
                        {...formik1.getFieldProps('newEmail')}
                      />
                      {formik1.touched.newEmail && formik1.errors.newEmail && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik1.errors.newEmail}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <div className='fv-row mb-0'>
                      <label
                        htmlFor='confirmemailpassword'
                        className='form-label fs-6 fw-bolder mb-3'
                      >
                        Confirm Password
                      </label>
                      <input
                        type='password'
                        className='form-control form-control-lg form-control-solid'
                        id='confirmemailpassword'
                        {...formik1.getFieldProps('confirmPassword')}
                      />
                      {formik1.touched.confirmPassword && formik1.errors.confirmPassword && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik1.errors.confirmPassword}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='d-flex'>
                  <button
                    id='kt_signin_submit'
                    type='submit'
                    className='btn btn-primary  me-2 px-6'
                  >
                    {!loading1 && 'Update Email'}
                    {loading1 && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                  <button
                    id='kt_signin_cancel'
                    type='button'
                    onClick={() => {
                      setShowEmailForm(false)
                    }}
                    className='btn btn-color-gray-400 btn-active-light-primary px-6'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div id='kt_signin_email_button' className={'ms-auto ' + (showEmailForm && 'd-none')}>
              <button
                onClick={() => {
                  setShowEmailForm(true)
                }}
                className='btn btn-light btn-active-light-primary'
              >
                Change Email
              </button>
            </div>
          </div>

          <div className='separator separator-dashed my-6'></div> */}

          <div className='d-flex flex-wrap align-items-center mb-10'>
            <div id='kt_signin_password' className={' ' + (showPasswordForm && 'd-none')}>
              <div className='fs-6 fw-bolder mb-1'>Password</div>
              <div className='fw-bold text-gray-600'>************</div>
            </div>

            <div
              id='kt_signin_password_edit'
              className={'flex-row-fluid ' + (!showPasswordForm && 'd-none')}
            >
              <form
                onSubmit={formik2.handleSubmit}
                id='kt_signin_change_password'
                className='form'
                noValidate
              >
                <div className='row mb-1'>
                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='old_password' className='form-label fs-6 fw-bolder mb-3'>
                        Current Password
                      </label>
                      <input
                        type='text'
                        id='old_password'
                        {...formik2.getFieldProps('old_password')}
                        className={clsx(
                          'form-control form-control-lg form-control-solid',
                          {
                            'is-invalid': formik2.touched.old_password && formik2.errors.old_password,
                          },
                          {
                            'is-valid': formik2.touched.old_password && !formik2.errors.old_password,
                          }
                        )}
                      />
                      {formik2.touched.old_password && formik2.errors.old_password && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <div className='fv-help-block'>{formik2.errors.old_password}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='new_password' className='form-label fs-6 fw-bolder mb-3'>
                        New Password
                      </label>
                      <input
                        type='text'
                        id='new_password'
                        {...formik2.getFieldProps('new_password')}
                        className={clsx(
                          'form-control form-control-lg form-control-solid',
                          {
                            'is-invalid': formik2.touched.new_password && formik2.errors.new_password,
                          },
                          {
                            'is-valid': formik2.touched.new_password && !formik2.errors.new_password,
                          }
                        )}
                      />
                      {formik2.touched.new_password && formik2.errors.new_password && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <div className='fv-help-block'>{formik2.errors.new_password}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='password_confirm' className='form-label fs-6 fw-bolder mb-3'>
                        Confirm New Password
                      </label>
                      <input
                        type='text'
                        id='password_confirm'
                        {...formik2.getFieldProps('password_confirm')}
                        className={clsx(
                          'form-control form-control-lg form-control-solid',
                          {
                            'is-invalid': formik2.touched.password_confirm && formik2.errors.password_confirm,
                          },
                          {
                            'is-valid': formik2.touched.password_confirm && !formik2.errors.password_confirm,
                          }
                        )}
                      />
                      {formik2.touched.password_confirm && formik2.errors.password_confirm && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <div className='fv-help-block'>{formik2.errors.password_confirm}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='form-text mb-5 mt-5'>
                  Note:<span className='invalid-feedback d-flex'>
                    Password must be at least 8 characters, including:
                    <br />one uppercase, one lowercase, one number and one special case character.</span>
                  {/* Password must be at least 8 character and contain symbols */}
                </div>

                <div className='d-flex'>
                  <button
                    id='kt_password_submit'
                    type='submit'
                    className='btn btn-primary me-2 px-6'
                  >
                    {!loading2 && 'Update Password'}
                    {loading2 && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPasswordForm(false)
                    }}
                    id='kt_password_cancel'
                    type='button'
                    className='btn btn-color-gray-400 btn-active-light-primary px-6'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div
              id='kt_signin_password_button'
              className={'ms-auto ' + (showPasswordForm && 'd-none')}
            >
              <button
                onClick={() => {
                  setPasswordForm(true)
                }}
                className='btn btn-light btn-active-light-primary'
              >
                Reset Password
              </button>
            </div>
          </div>

          {/*  <div className='notice d-flex bg-light-primary rounded border-primary border border-dashed p-6'>
            <KTSVG
              path='/media/icons/duotune/general/gen048.svg'
              className='svg-icon-2tx svg-icon-primary me-4'
            />
            <div className='d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap'>
              <div className='mb-3 mb-md-0 fw-bold'>
                <h4 className='text-gray-800 fw-bolder'>Secure Your Account</h4>
                <div className='fs-6 text-gray-600 pe-7'>
                  Two-factor authentication adds an extra layer of security to your account. To log
                  in, in addition you'll need to provide a 6 digit code
                </div>
              </div>
              <a
                href='#'
                className='btn btn-primary px-6 align-self-center text-nowrap'
                data-bs-toggle='modal'
                data-bs-target='#kt_modal_two_factor_authentication'
              >
                Enable
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export { SignInMethod }
