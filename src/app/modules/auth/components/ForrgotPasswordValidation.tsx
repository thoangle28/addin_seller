import React, { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'

import { requestValidatePassword } from '../redux/AuthCRUD'
import AlertMessage from '../../../../_metronic/partials/common/alert'

const initialValues = {
    new_password: '',
    password_confirm: '',
    reset_token: ''
}

const forgotPasswordSchema = Yup.object().shape({
    new_password: Yup.string()
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character."
        ),
    password_confirm: Yup.string()
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Confirm password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character."
        )
        .oneOf([Yup.ref('new_password'), null], 'Confirm password have to match'),
    reset_token: Yup.string().required('The token is required')
})

export function ForgotPasswordValidation() {
    const history = useHistory();
    const [loading, setLoading] = useState(false)
    const [hasErrors, setHasErrors] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const formik = useFormik({
        initialValues,
        validationSchema: forgotPasswordSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            setLoading(true)
            setHasErrors(false)
            setMessage('please wait for a while, your request is sending !')
            const payload = {
                ...values
            }
            requestValidatePassword(payload)
                .then(res => {
                    const { code, message } = res.data
                    setLoading(true)
                    if (code === 200) {
                        setLoading(false)
                        setHasErrors(false)
                        setMessage(message + " ! This page will be redirected automatically in a few seconds.")
                        setTimeout(() => {
                            history.push('/auth/login')
                        }, 3500);
                    } else {
                        setMessage(message)
                        setHasErrors(true)
                    }
                })
                .catch((err) => {
                    setHasErrors(true)
                    setLoading(false)
                    setSubmitting(false)
                    setStatus(err + 'Something went wrong ! please try again ')
                })
        },
    })

    const alertClass = `${hasErrors ? 'mb-lg-15 alert alert-danger' : 'mb-lg-8 p-8 alert-success'}`

    return (
        <>
            <form
                className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
                noValidate
                id='kt_login_password_reset_form'
                onSubmit={formik.handleSubmit}
            >
                <div className='text-center mb-10'>
                    {/* begin::Title */}
                    <h1 className='text-dark mb-3'>Forgot Password Validation</h1>
                    {/* end::Title */}

                    {/* begin::Link */}
                    <div className='text-gray-400 fs-6'>Enter your email to reset your password.</div>
                    {/* end::Link */}
                </div>
                {message && <AlertMessage alertClass={alertClass} message={message} />}
                {/* begin::Form group */}
                <div className='mb-10 fv-row' data-kt-password-meter='true'>
                    <div className='mb-1'>
                        <label className='form-label fw-bolder text-dark fs-6 required'>New Password</label>
                        <div className='position-relative mb-3'>
                            <input
                                type='password'
                                placeholder='New Password'
                                autoComplete='off'
                                {...formik.getFieldProps('new_password')}
                                className={clsx(
                                    'form-control form-control-lg form-control-solid',
                                    {
                                        'is-invalid': formik.touched.new_password && formik.errors.new_password,
                                    },
                                    {
                                        'is-valid': formik.touched.new_password && !formik.errors.new_password,
                                    }
                                )}
                            />
                            {formik.touched.new_password && formik.errors.new_password && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.new_password}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-10 fv-row' data-kt-password-meter='true'>
                    <div className='mb-1'>
                        <label className='form-label fw-bolder text-dark fs-6 required'>Password Confirmation</label>
                        <div className='position-relative mb-3'>
                            <input
                                type='password'
                                placeholder='Password Confirmation'
                                autoComplete='off'
                                {...formik.getFieldProps('password_confirm')}
                                className={clsx(
                                    'form-control form-control-lg form-control-solid',
                                    {
                                        'is-invalid': formik.touched.password_confirm && formik.errors.password_confirm,
                                    },
                                    {
                                        'is-valid': formik.touched.password_confirm && !formik.errors.password_confirm,
                                    }
                                )}
                            />
                            {formik.touched.password_confirm && formik.errors.password_confirm && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.password_confirm}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-10 fv-row' data-kt-password-meter='true'>
                    <div className='mb-1'>
                        <label className='form-label fw-bolder text-dark fs-6 required'>Reset token</label>
                        <div className='position-relative mb-3'>
                            <input
                                type='text'
                                placeholder='Reset Token'
                                autoComplete='off'
                                {...formik.getFieldProps('reset_token')}
                                className={clsx(
                                    'form-control form-control-lg form-control-solid',
                                    {
                                        'is-invalid': formik.touched.reset_token && formik.errors.reset_token,
                                    },
                                    {
                                        'is-valid': formik.touched.reset_token && !formik.errors.reset_token,
                                    }
                                )}
                            />
                            {formik.touched.reset_token && formik.errors.reset_token && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.reset_token}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* end::Form group */}

                {/* begin::Form group */}
                <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
                    <button
                        type='submit'
                        id='kt_password_reset_submit'
                        className='btn btn-lg btn-primary fw-bolder me-4'
                    >
                        <span className='indicator-label'>Submit</span>
                        {loading && (
                            <span className='indicator-progress'>
                                Please wait...
                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                        )}
                    </button>
                    <Link to='/auth/login'>
                        <button
                            type='button'
                            id='kt_login_password_reset_form_cancel_button'
                            className='btn btn-lg btn-light-primary fw-bolder'
                            disabled={formik.isSubmitting || !formik.isValid}
                        >
                            Cancel
                        </button>
                    </Link>{' '}
                </div>
                {/* end::Form group */}
            </form>
        </>
    )
}
