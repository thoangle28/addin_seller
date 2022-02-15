/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import * as auth from '../redux/AuthRedux'
import {register, getTermsAndConditions} from '../redux/AuthCRUD'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Modal} from 'react-bootstrap-v5'

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
  brand: ''
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('First name is required.'), 
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Last name is required.'),
  email: Yup.string()
    .email('Wrong email format.')
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Email is required.'),
  brand: Yup.string()
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Brand name is required.'),
  password: Yup.string()
    .min(8, 'Minimum 8 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Password is required.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character."
    ),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and confirm password didn't match."),
    }),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions.'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState('danger')
  const [showModal, setShowModal] = useState(false)
  const [termsConditions, setTermsConditions] = useState('')

  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setTimeout(() => {
        register(values.email, values.firstname, 
          values.lastname, values.password, values.brand)
          .then((response) => { //{data: {accessToken}}            
            setLoading(false)            
            //const data = response.data
            const { code, message } = response.data
     
            if( code === 409 ) {
              setStatus(message)
              setSubmitting(false)
              setAlert('danger')
            } else if( code === 200) {
              setSubmitting(true)
              setStatus(message)
              setAlert('success')
              //reset
              initialValues.acceptTerms = false
              initialValues.changepassword = ''
              initialValues.password = ''
              initialValues.firstname = ''
              initialValues.lastname = ''
              initialValues.brand = ''
            }
            //dispatch(auth.actions.login(accessToken))
          })
          .catch(() => {
            setLoading(false)
            setSubmitting(false)
            setAlert('danger')
            setStatus('Registration process has broken.')
          })
      }, 1000)
    },
  })

  const handleShowModal = (event: any) => {
    event.preventDefault()
    setShowModal(true)
  }
  
  const handleHideModal = (event: any) => {
    event.preventDefault()
    setShowModal(false)
  }
  
  useEffect(() => {
    getTermsAndConditions().then((response) => {
      const { data} = response.data
      setTermsConditions(data)
    })
  }, [])
  
  return (
    <>
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='mb-10 text-center'>
        {/* begin::Title */}
        <h1 className='text-dark mb-3'>Create New Account</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-400 fw-normal fs-6'>
          Already have an account,&nbsp;
          <Link to='/auth/login' className='link-primary fw-normal'>
            click here to login.
          </Link>
        </div>
        {/* end::Link */}
      </div>
      {/* end::Heading */}

      {/* begin::Action */}
      {/* <button type='button' className='btn btn-light-primary fw-bolder w-100 mb-10'>
        <img
          alt='Logo'
          src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
          className='h-20px me-3'
        />
        Sign in with Google
      </button> */}
      {/* end::Action */}

      <div className='d-flex align-items-center mb-10'>
        <div className='border-bottom border-gray-300 mw-50 w-100'></div>
        <span className='fw-bold text-gray-400 fs-7 mx-2'>OR</span>
        <div className='border-bottom border-gray-300 mw-50 w-100'></div>
      </div>

      {formik.status && (
        <div className={`mb-lg-15 alert alert-${alert}`}>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Firstname */}
      { alert !== 'success' && (
      <>
      <div className='row fv-row mb-5'>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>First name</label>
          <input
            placeholder='First name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('firstname')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
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
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.firstname}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row'>
            <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
            <input
              placeholder='Last name'
              type='text'
              autoComplete='off'
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
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.lastname}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
      </div>     
      {/* end::Form group */}
      {/* begin::Form group Brand */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Brand name</label>
        <input
          placeholder='Brand name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('brand')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.brand && formik.errors.brand},
            {
              'is-valid': formik.touched.brand && !formik.errors.brand,
            }
          )}
        />
        {formik.touched.email && formik.errors.brand && (
          <div className='fv-plugins-message-container invalid-feedback'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.brand}</span>
            </div>
          </div>
        )}
      </div>        
      {/* begin::Form group Brand */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Email</label>
        <input
          placeholder='Email'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container invalid-feedback'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}      
      <div className="row">
        <div className="col-12 col-md-6"> 
        {/* begin::Form group Password */}
          <div className='mb-10 fv-row' data-kt-password-meter='true'>
            <div className='mb-1'>
              <label className='form-label fw-bolder text-dark fs-6'>Password</label>
              <div className='position-relative mb-3'>
                <input
                  type='password'
                  placeholder='Password'
                  autoComplete='off'
                  {...formik.getFieldProps('password')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {
                      'is-invalid': formik.touched.password && formik.errors.password,
                    },
                    {
                      'is-valid': formik.touched.password && !formik.errors.password,
                    }
                  )}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.password}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        {/* end::Form group */}
        </div>
        <div className="col-12 col-md-6"> 
          {/* begin::Form group Confirm password */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
            <input
              type='password'
              placeholder='Password confirmation'
              autoComplete='off'
              {...formik.getFieldProps('changepassword')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
                }
              )}
            />
            {formik.touched.changepassword && formik.errors.changepassword && (
              <div className='fv-plugins-message-container invalid-feedback'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.changepassword}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
      </div>
      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='form-check form-check-custom form-check-solid'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <label
            className='form-check-label fw-bold text-gray-700 fs-6'
            htmlFor='kt_login_toc_agree'
          >
            I agree to the{' '}
            <Link 
              to='#' 
              onClick={handleShowModal}
              target = '_blank'
              className='ms-1 link-primary'>
              terms and conditions
            </Link>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <div className="row">
          <div className="col-12 col-md-6">        
          <button
            type='submit'
            id='kt_sign_up_submit'
            className='btn btn-lg btn-primary w-100 mb-5'
            disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
          >
            {!loading && <span className='indicator-label'>Submit</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>              
          </div>
          <div className="col-12 col-md-6">         
            <Link to='/auth/login'>
              <button
                type='button'
                id='kt_login_signup_form_cancel_button'
                className='btn btn-lg btn-light-primary w-100 mb-5'
              >
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* end::Form group */}
      </>) 
      }
    </form>
    <Modal
      id='kt_modal_terms_conditions'
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog-centered mw-700px h-auto'
      show={showModal}
    >
      <div className='container-xxl px-10 py-10'>
        <div className='modal-header d-flex border-0 p-0'>
            <h2>Terms and Conditions</h2>
            {/* begin::Close */}
            <div 
              className='btn btn-icon btn-sm btn-light-primary'
              onClick={handleHideModal}
            >
              <KTSVG className='svg-icon-2' path='/media/icons/duotune/arrows/arr061.svg' />
            </div>
            {/* end::Close */}
        </div>

        <div className='modal-body px-0 py-0 pt-5'>
            {/*begin::Stepper */}
            <div
            className='stepper stepper-1 d-flex flex-column flex-xl-row flex-row-fluid'
            id='kt_modal_body'
            >
            {/*begin::Aside */}
            <div className='w-100' style={{ overflowY: "auto", height: "600px"}}>
              <div dangerouslySetInnerHTML={{ __html: termsConditions }} />
            </div>
            {/*end::Content */}
            </div>
            {/* end::Stepper */}
        </div>
    </div>
    </Modal>
    </>
  )
}
