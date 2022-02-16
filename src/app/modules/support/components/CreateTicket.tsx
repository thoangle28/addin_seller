import React, {useEffect, useState} from 'react'
import clsx from 'clsx'
import * as Yup from 'yup'
import {useFormik} from 'formik'
//import { UploadImageField } from '../../../../../../_metronic/partials/content/upload/UploadFile'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
//import {IProfileDetails, profileDetailsInitValues as defaultValues} from '../SettingsModel'
import { FallbackView } from '../../products/components/formOptions'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useHistory } from 'react-router-dom'
import {CreateNewTicket, iTicket, defaultValues} from './supportApi'
import { UploadImageField } from '../../../../_metronic/partials/content/upload/UploadFile'


const validationTicket =  Yup.object().shape({
    customer: Yup.string()
        .nullable()
        .min(3, 'Minimum 3 symbols.')
        .max(50, 'Maximum 50 symbols.')
        .required('Customer is required'),
    category: Yup.number().nullable()
        .required('Customer is required'),
    orderId: Yup.number().nullable().when('category', {
        is: 'order',
        then: Yup.string().required('Order Id is required')
    }),
    productId: Yup.number().when('orderId', {
        is: (orderId: number) => { return orderId > 0 },
        then: Yup.string().required('Product is required')
    }),
    subject: Yup.string()
        .required('Subject is required'),
    messages: Yup.string()
        .required('Messages is required'),
})

const CreateTicket = () => {

    const initialValues: iTicket = {...defaultValues}    

    const [isLoading, setLoading] = useState(true)
    
    const formik = useFormik<iTicket>({
        initialValues,
        validationSchema: validationTicket,
        onSubmit : (values) => {
            setLoading(true) 
            setTimeout(() => {
                setLoading(false) 
            }, 3000)
        }
    })

    useEffect(() => {
        setLoading(false) 
    }, [setLoading])

    return(
        <>
            { isLoading && 
            (<div className='card mb-5 mb-xl-8 loading-wrapper'>
                <div className='card-body py-3 loading-body'>
                <FallbackView />
                </div>
            </div>) || 
            (<div className='card mb-5 mb-xl-8'>
                <div
                    className='card-header border-0 cursor-pointer'
                    role='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#kt_account_profile_details'
                    aria-expanded='true'
                    aria-controls='kt_account_profile_details'
                    >
                    <div className='card-title m-0'>
                        <h2 className='fw-bolder m-0'>Create Ticket</h2>
                    </div>
                </div>
                <div className='card-body py-3'>
                    <form onSubmit={formik.handleSubmit} noValidate className='form'>
                        <div className="card-body pt-0">
                            {/*begin::Input group*/}
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 g-9 customer">
                                <div className="mb-10 fv-row fv-plugins-icon-container">
                                    {/*begin::Label*/}
                                    <label className="required form-label">Customer</label>
                                    {/*end::Label*/}
                                    {/*begin::Input*/}                                
                                    <input type="text" 
                                        placeholder="Customer"
                                        {...formik.getFieldProps('customer')}
                                        className={clsx(
                                            'form-control form-control-lg',
                                            {
                                            'is-invalid': formik.touched.customer && formik.errors.customer,
                                            },
                                            {
                                            'is-valid': formik.touched.customer && !formik.errors.customer,
                                            }
                                        )}
                                    />                   
                                    {formik.touched.customer && formik.errors.customer && (
                                    <div className='fv-plugins-message-container invalid-feedback'>
                                        <div className='fv-help-block'>{formik.errors.customer}</div>
                                    </div>
                                    )}
                                </div>

                                <div className="mb-10 fv-row fv-plugins-icon-container category">
                                    {/*begin::Label*/}
                                    <label className="required form-label">Category</label>
                                    <select 
                                        className="form-select create_ticket_category" 
                                        name="category" 
                                        data-placeholder="Select a Category">                                      
                                        <option value="general-enquiry">General Enquiry</option>
                                        <option value="order-enquiry">Order Enquiry</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 g-9 ">
                                <div className="mb-10 fv-row fv-plugins-icon-container order-number">
                                    {/*begin::Label*/}
                                    <label className="required form-label">Order Number</label>
                                    {/*end::Label*/}
                                    {/*begin::Input*/}
                                    <input type="text" 
                                     placeholder="Order Number"
                                    {...formik.getFieldProps('orderId')}
                                    className={clsx(
                                        'form-control form-control-lg',
                                        {
                                        'is-invalid': formik.touched.orderId && formik.errors.orderId,
                                        },
                                        {
                                        'is-valid': formik.touched.orderId && !formik.errors.orderId,
                                        }
                                    )}
                                    />                   
                                    {formik.touched.orderId && formik.errors.orderId && (
                                    <div className='fv-plugins-message-container invalid-feedback'>
                                        <div className='fv-help-block'>{formik.errors.orderId}</div>
                                    </div>
                                    )}
                                </div>
                                <div className="mb-10 fv-row fv-plugins-icon-container products">
                                    {/*begin::Label*/}
                                    <label className="required form-label">Products</label>
                                    {/*end::Label*/}
                                    {/*begin::Input*/}
                                    <select 
                                        className="form-select create_ticket_category" 
                                        name="product" 
                                        data-placeholder="Select a product">                                      
                                        <option value="general-enquiry">General Enquiry1</option>
                                        <option value="order-enquiry">Order Enquiry2</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-1 g-9">
                                <div className="col-12 mb-10 fv-row fv-plugins-icon-container">
                                    <label className="required form-label">Subject</label>
                                    <input type="text" name="product_name" className="form-control mb-2" placeholder="Subject" value="" />
                                    <div className="fv-plugins-message-container invalid-feedback"></div>
                                </div>
                            </div>
                            {/*end::Input group*/}
                            {/*begin::Input group*/}
                            <div>
                                {/*begin::Label*/}
                                <label className="form-label">Description</label>
                                {/*end::Label*/}										
                            </div>
                            <div className="min-h-200px mb-2">
                                <div className="ql-editor ql-blank" data-placeholder="Type your text here...">
                                  lk;
                                </div>
                                <div className="ql-clipboard"></div>                                
                                {/*end::Editor*/}
                                {/*begin::Description*/}
                                <div className="text-muted fs-7">Set a description to the product for better visibility.</div>
                                {/*end::Description*/}
                            </div>
                            {/*end::Input group*/}
                            <div className="mb-2">
                                <label className="form-label">Attachments</label>
                                <UploadImageField
                                    setFileToState={() => {}}                      
                                    setFieldValue={formik.setFieldValue}
                                    fileName={'attachments'}
                                    isMultiple={true}     
                                    textLabel="Please choose your files"
                                />       
                            </div>
                            <div className='d-flex justify-content-end mt-5'>
                                <button type='submit' className='btn btn-primary btn-sm' disabled={isLoading}>
                                    {!isLoading && 'Submit Ticket'}
                                    {isLoading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                        Please wait...{' '}
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                    )}
                                </button>
                            </div>    
                        </div>
                    </form>
                </div>
            </div>) }
        </>
    )
}
export default CreateTicket