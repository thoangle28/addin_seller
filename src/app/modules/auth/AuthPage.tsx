/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Registration } from './components/Registration'
import { ForgotPassword } from './components/ForgotPassword'
import { ForgotPasswordValidation } from './components/ForrgotPasswordValidation'
import { Login } from './components/Login'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import { useLocation } from 'react-router-dom';

export function AuthPage() {

  const location = useLocation()
  const withForm = (location.pathname === '/auth/registration') ? 600 : 500;

  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
      }}
    >
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        <a href='#' className='mb-12'>
          <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-v5-200.png')} className='h-60px' />
        </a>
        {/* end::Logo */}
        {/* begin::Wrapper */}
        <div
          className={`w-lg-${withForm}px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto`}
          style={{ minHeight: '475px' }}>
          <Switch>
            <Route path='/auth/login' component={Login} />
            <Route path='/auth/registration' component={Registration} />
            <Route path='/auth/forgot-password' component={ForgotPassword} />
            <Route path='/auth/forgot-password-validation' component={ForgotPasswordValidation} />
            <Redirect from='/auth' exact={true} to='/auth/login' />
            <Redirect to='/auth/login' />
          </Switch>
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
      {/* begin::Footer */}
      {/* <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-bold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact Us
          </a>
        </div>
      </div> */}
      {/* end::Footer */}
    </div>
  )
}
