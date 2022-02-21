import React, {useEffect, useState} from 'react'
import clsx from 'clsx'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { FallbackView } from '../../products/components/formOptions'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useHistory } from 'react-router-dom'
import {CreateNewTicket, iTicket, defaultValues, GetProductsByOrder} from './supportApi'
import { UploadImageField } from '../../../../_metronic/partials/content/upload/UploadFile'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../../setup'

const validationTicket =  Yup.object().shape({
    customer: Yup.string()
        .nullable()
        .min(3, 'Minimum 3 symbols.')
        .max(50, 'Maximum 50 symbols.')
        .required('Customer is required'),
    category: Yup.string()
        .required('Category is required'),
    orderId: Yup.number()
        .min(1, 'Order Id is great then 0')
        .when('category', {
            is:  (category: string) => { 
                return (category === 'order') 
            },
            then: Yup.number().required('Order Id is required')
        }
    ),
    productId: Yup.number()    
        .when(['orderId', 'category'], {
            is: (orderId: number, category: string) => { 
                return (!isNaN(orderId) && orderId > 0 && category === 'order')
            },
            then: Yup.number().required('Products is required')
        }
    ),
    subject: Yup.string()
        .required('Subject is required'),
    message: Yup.string()
        .test('message', 'Description is required', value => {
            return (typeof value !== undefined && value !== '<p><br></p>')
        })
        .required('Description is required'),
})

const CreateTicket = () => {

    const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
    const { accessToken, user } = auth 
    
    const initialValues: iTicket = {...defaultValues}    

    const [isLoading, setLoading] = useState(true)
    const [orderRequired, setOrderRequired] = useState(false)
    const [productRequired, setProductRequired] = useState(false)
    const [productsList, setProductsList] = useState([])
    
    const history = useHistory();
    const confirmRequest = (message: string) => {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className="custom-ui">
                <h3 style={{color: '#fff'}}>Creat Ticket</h3>
                <p>{message}</p>           
                <button
                  className='btn btn-sm btn-success'
                  onClick={() => {
                    history.push("/ticket/list");
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

    const formik = useFormik<iTicket>({
        initialValues,
        validationSchema: validationTicket,
        onSubmit : (values) => {
            console.log(values)
            setLoading(true)     
            const userInfo = { userEmail: user.user_email, accessToken: accessToken }  
            CreateNewTicket(values, userInfo).then((response: any) => {        
                const { code, message, data } = response.data   
                if(code === 200 && message === 'DONE') {
                confirmRequest('Your ticket has been created successfully.')
                setLoading(false)
                }
            })
        }
    })

    useEffect(() => {
        setLoading(false) 
    }, [setLoading])

    const getProductsListFromOrder = (orderId: string) => {
        const products: any = [
            { value: 1, label: "Test Product 1"},
            { value: 2, label: "Test Product 2"},
            { value: 3, label: "Test Product 3"},
            { value: 4, label: "Test Product 4"},
            { value: 5, label: "Test Product 5"},
        ]
        
        GetProductsByOrder(parseInt(orderId)).then((result: any) => {
            const productsList: any = result.data
            productsList && productsList.map((product: any) => {
                products.push({ value: product.Id, label: product.title})
            })
            setProductsList(products)
            
        }).catch(() => {})
    }

    return(
        <>
            { isLoading && 
            (<div className='card mb-5 mb-xl-8 loading-wrapper'>
                <div className='card-body py-3 loading-body'>
                <FallbackView />
                </div>
            </div>) || 
            (<div className='card mb-5 mb-xl-8'>
                <div className='card-header border-0 cursor-pointer' >
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
                                        placeholder="Select a Category"
                                        onChange={(event) => {
                                            const value = event.target.value
                                            formik.setFieldValue('category', value)
                                            setOrderRequired( value === 'order')
                                        }}
                                        //{...formik.getFieldProps('category')}                                        
                                    >                                      
                                        <option value="general">General Enquiry</option>
                                        <option value="order">Order Enquiry</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-1 row-cols-xl-2 g-9 ">
                                <div className="mb-10 fv-row fv-plugins-icon-container order-number">
                                    {/*begin::Label*/}
                                    <label className={(orderRequired ? 'required ' : '') + 'form-label'}>Order Number</label>
                                    {/*end::Label*/}
                                    {/*begin::Input*/}
                                    <input 
                                        type="number" 
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
                                        onBlur={(event: any) => {
                                            getProductsListFromOrder(formik.values.orderId)
                                        }}
                                    />                   
                                    {formik.touched.orderId && formik.errors.orderId && (
                                    <div className='fv-plugins-message-container invalid-feedback'>
                                        <div className='fv-help-block'>{formik.errors.orderId}</div>
                                    </div>
                                    )}
                                </div>
                                <div className="mb-10 fv-row fv-plugins-icon-container products">
                                    {/*begin::Label*/}
                                    <label className={(orderRequired ? 'required ' : '') + 'form-label'}>Products</label>
                                    {/*end::Label*/}
                                    {/*begin::Input*/}
                                    <select 
                                        className={clsx(
                                            'form-select form-control-lg',
                                            {
                                            'is-invalid': formik.touched.productId && formik.errors.productId,
                                            },
                                            {
                                            'is-valid': formik.touched.productId && !formik.errors.productId,
                                            }
                                        )}
                                        {...formik.getFieldProps('productId')}
                                        placeholder="Select a product">
                                        {productsList.length > 0 && (<option key={0} value=''>Select a product</option>)}
                                        {(productsList.length > 0 && 
                                            productsList.map((item: any, index) => {
                                                return (
                                                    <option key={index + 1} value={item.value}>{item.label}</option>
                                                )
                                            }))}                                        
                                    </select>
                                    {formik.touched.productId && formik.errors.productId && (
                                        <div className='fv-plugins-message-container invalid-feedback'>
                                            <div className='fv-help-block'>{formik.errors.productId}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-1 g-9">
                                <div className="col-12 mb-10 fv-row fv-plugins-icon-container">
                                    <label className="required form-label">Subject</label>
                                    <input 
                                    type="text"
                                    {...formik.getFieldProps('subject')}
                                    className={clsx(
                                        'form-control mb-2 form-control-lg',
                                        {
                                        'is-invalid': formik.touched.subject && formik.errors.subject,
                                        },
                                        {
                                        'is-valid': formik.touched.subject && !formik.errors.subject,
                                        }
                                    )}
                                    placeholder="Subject"/>
                                    {formik.touched.subject && formik.errors.subject && (
                                    <div className='fv-plugins-message-container invalid-feedback'>
                                        <div className='fv-help-block'>{formik.errors.subject}</div>
                                    </div>
                                    )}
                                </div>
                            </div>
                            {/*end::Input group*/}                            
                            <div className="min-h-200px mb-5">
                                <label className="required form-label">Description</label>
                                <div className="ql-editor ql-blank">
                                    <SunEditor
                                        name='message'
                                        placeholder="Please type here..."
                                        autoFocus={false}
                                       onChange={(event: any) => {
                                            formik.setFieldValue('message', event);
                                            formik.handleChange(event)
                                        }}
                                        /*onBlur={(event: any) => {
                                            formik.setFieldValue('message', event);
                                            formik.handleChange(event)
                                        }} */
                                        defaultValue={formik.values.message}
                                        setContents={formik.values.message}
                                        width='100%'
                                        height='300px'
                                        setDefaultStyle={''}
                                        setOptions={{
                                            buttonList: [
                                                ['font', 'fontSize', 'formatBlock'],
                                                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                                ['fontColor',  'textStyle'],
                                                ['align', 'list'],['table', 'link'],
                                            ],
                                        }}                                        
                                    />
                                </div>                        
                                <div 
                                    className={clsx('text-muted fs-8 mt-2',
                                        {
                                        'is-invalid': formik.touched.message && formik.errors.message,
                                        },
                                        {
                                        'is-valid': formik.touched.message && !formik.errors.message,
                                        }
                                    )}> Set a description to the product for better visibility. {formik.values.message}
                                </div>
                                {formik.touched.message && formik.errors.message && (
                                    <div className='fv-plugins-message-container invalid-feedback'>
                                        <div className='fv-help-block'>{formik.errors.message}</div>
                                    </div>
                                )}
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