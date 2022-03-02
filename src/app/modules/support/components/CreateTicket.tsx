import React, {useEffect, useState} from 'react'
import clsx from 'clsx'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {FallbackView} from '../../products/components/formOptions'
import {confirmAlert} from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import {useHistory, useLocation} from 'react-router-dom'
import {CreateNewTicket, iTicket, defaultValues, GetProductsByOrder, GetBrands} from './supportApi'
import {UploadImageField} from '../../../../_metronic/partials/content/upload/UploadFile'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

const validationTicket = Yup.object().shape({
  customer: Yup.string()
    .min(3, 'Minimum 3 symbols.')
    .max(50, 'Maximum 50 symbols.')
    .required('Customer is required'),
  category: Yup.string().required('Category is required'),
  sellerId: Yup.string().required('Brand is required'),
  orderId: Yup.number()    
    .when('category', {
      is: (category: string) => {
        return category === 'order'
      },
      then: Yup.number().min(1, 'Order Number is great then 0').required('Order Number is required'),
    }),
  productId: Yup.number().when(['orderId', 'category'], {
    is: (orderId: number, category: string) => {
      return !isNaN(orderId) && orderId > 0 && category === 'order'
    },
    then: Yup.number().required('Products is required'),
  }),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string()
    .test('message', 'Description is required', (value) => {
      return typeof value !== undefined && value !== '<p><br></p>'
    })
    .required('Description is required'),
})

const CreateTicket = () => {
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const {accessToken, user} = auth

  const initialValues: iTicket = {...defaultValues}

  const [isLoading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderRequired, setOrderRequired] = useState(false)
  const [productRequired, setProductRequired] = useState(false)
  const [productsList, setProductsList] = useState([])
  const [brandsList, setBrandsList] = useState([])
  const [brandsListBk, setBrandsListBk] = useState([])
  const [attachFiles, setAttachFiles] = useState([])
  const [orderError, setOrderError] = useState(false)

  const location: any = useLocation()
  const history = useHistory()

  const confirmRequest = (message: string) => {
    confirmAlert({
      customUI: ({onClose}) => {
        return (
          <div className='custom-ui'>
            <h3 style={{color: '#fff'}}>Creat Ticket</h3>
            <p>{message}</p>
            <button
              className='btn btn-sm btn-success'
              onClick={() => {
                history.push('/support/ticket/listing')
                onClose()
              }}
            >
              Close
            </button>
          </div>
        )
      },
    })
  }

  const SetDefaultValues = () => {
    if (user) {
      initialValues.customer = user.display_name
      initialValues.customer_id = user.ID

      if( typeof location !== 'undefined' 
        && typeof location.state !== 'undefined' 
        && location.state.orderId > 0) {
        initialValues.orderId = location.state.orderId
        initialValues.category = 'order'
        setOrderRequired(true)
        getProductsListFromOrder(location.state.orderId, 'order')
      }
    }
  }

  const formik = useFormik<iTicket>({
    initialValues,
    validationSchema: validationTicket,
    onSubmit: (values, {resetForm}) => {
      
      setIsSubmitting(true)
      const userInfo = {userEmail: user.user_email, accessToken: accessToken}
      CreateNewTicket(values, userInfo).then((response: any) => {
        const {code, message, data} = response
        if (code === 200 && message === 'DONE') {
          confirmRequest('Your ticket has been created successfully.')
          setIsSubmitting(true)
          resetForm()
        }
      })
    },
  })

  useEffect(() => {
    setLoading(false)
    GetBrandsList()
    SetDefaultValues()
  }, [setLoading])

  const getProductsListFromOrder = (orderId: number, category: string) => {
    const proOptions: any = []
		if( !orderId && category !== 'order') {      
			setOrderError(false)
			setProductsList([])
      setBrandsList(brandsListBk)
			return
		} 

    GetProductsByOrder({orderId: orderId, userId: user.ID})
      .then((result: any) => {
       
        const {code, message, data} = result
       
        if (code === 200 && data) {
          
          const products: any = data.list_products
          const brandsList: any = data.list_brands

          products &&
          products.map((product: any) => {
              proOptions.push({value: product.id, label: '--> ' + product.name})
            })
          setProductsList(proOptions)
          setOrderError(false)
          
          const list: any = []
          brandsList &&
          brandsList.map((brand: any) => {
            list.push({value: brand.user_id, label: brand.name})
          })
          setBrandsList(list)

        } else {
          setProductsList([])
          setBrandsList(brandsListBk)
          setOrderError(message)
        }
      })
      .catch(() => {})
  }

  const GetBrandsList = () => {
    const params: any = null
    GetBrands(params).then((response: any) => {
      const list: any = response.data
      const brands: any = []
      list &&
        list.map((brand: any) => {
          brands.push({value: brand.user_id, label: brand.name})
        })
      setBrandsList(brands)
      setBrandsListBk(brands)
    })
  }

  const clearAllFiles = (e: any) => {
    e.preventDefault()
    setAttachFiles([])
    formik.setFieldValue('attachments', [])
  }

  return (
    <>
      {(isLoading && (
        <div className='card mb-5 mb-xl-8 loading-wrapper'>
          <div className='card-body py-3 loading-body'>
            <FallbackView />
          </div>
        </div>
      )) || (
        <div className='card mb-5 mb-xl-8'>
          <div className='card-header border-0 cursor-pointer'>
            <div className='card-title m-0'>
              <h2 className='fw-bolder m-0'>Create Ticket</h2>
            </div>
          </div>
          <div className='card-body py-3'>
            <form onSubmit={formik.handleSubmit} noValidate className='form'>
              <div className='card-body pt-0'>
                {/*begin::Input group*/}
                <div className='row customer'>
                  <div className='mb-5 col-md-4 fv-plugins-icon-container'>
                    {/*begin::Label*/}
                    <label className='required form-label'>Customer</label>
                    {/*end::Label*/}
                    {/*begin::Input*/}
                    <input
                      type='text'
                      placeholder='Customer'
                      readOnly
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
                  <div className='mb-5 col-md-4 fv-plugins-icon-container category'>
                    {/*begin::Label*/}
                    <label className='required form-label'>Category</label>
                    <select                     
                      placeholder='Select category'                      
                      {...formik.getFieldProps('category')}
                      onChange={(event) => {
                        const value = event.target.value
                       
                        formik.setFieldValue('category', value)
                        setOrderRequired(value === 'order')
												if(value !== 'order') {
													setOrderError(false)
													setProductsList([])
                          setBrandsList(brandsListBk)
                          formik.setFieldValue('orderId', '')
												}
                      }}
                      className={clsx(
                        'form-select',
                        {
                          'is-invalid': formik.touched.category && formik.errors.category,
                        },
                        {
                          'is-valid': formik.touched.category && !formik.errors.category,
                        }
                      )}
                    >
                      <option value=''>Select category</option>
                      <option value='general'>General Enquiry</option>
                      <option value='order'>Order Enquiry</option>
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <div className='fv-help-block'>{formik.errors.category}</div>
                      </div>
                    )}
                  </div>
                  <div className='mb-5 col-md-4 fv-plugins-icon-container'>
                    {/*begin::Label*/}
                    <label className='required form-label'>Brand</label>
                    <select
                      placeholder='Select Brand'
                      {...formik.getFieldProps('sellerId')}
                      className={clsx(
                        'form-select form-control-lg',
                        {
                          'is-invalid': formik.touched.sellerId && formik.errors.sellerId,
                        },
                        {
                          'is-valid': formik.touched.sellerId && !formik.errors.sellerId,
                        }
                      )}
                    >
                      <option value=''>Select Brand</option>
                      {brandsList &&
                        brandsList.map((item: any, index: number) => {
                          return (
                            <option key={index} value={item.value}>
                              {item.label}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.sellerId && formik.errors.sellerId && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <div className='fv-help-block'>{formik.errors.sellerId}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className='row' style={{'display': (orderRequired ? '' : 'none') }}>
                  <div className='mb-5 col-md-4 fv-plugins-icon-container order-number'>
                    {/*begin::Label*/}
                    <label className={(orderRequired ? 'required ' : '') + 'form-label'}>
                      Order Number
                    </label>
                    {/*end::Label*/}
                    {/*begin::Input*/}
                    <input
                      type='number'
                      placeholder='Order Number'
                      {...formik.getFieldProps('orderId')}
                      className={clsx(
                        'form-control form-control-lg',
                        {
                          'is-invalid': (formik.touched.orderId && formik.errors.orderId || orderError),
                        },
                        {
                          'is-valid': formik.touched.orderId && !formik.errors.orderId,
                        }
                      )}
                      onBlur={(event: any) => {                       
                        const orderId: any = (formik.values.orderId) ? formik.values.orderId : 0;                     
                        getProductsListFromOrder(orderId, formik.values.category)
                      }}
                    />
                    {((formik.touched.orderId && formik.errors.orderId) || orderError) && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <div className='fv-help-block'>{ formik.errors.orderId ? formik.errors.orderId : orderError}</div>
                      </div>
                    )}
                  </div>
                  <div className='mb-5  col-md-8 fv-plugins-icon-container products'>
                    {/*begin::Label*/}
                    <label className={(orderRequired ? 'required ' : '') + 'form-label'}>
                      Products
                    </label>
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
                      placeholder='Select a product'
                    >
                      {productsList.length > 0 && (
                        <option key={0} value=''>
                          Select a product
                        </option>
                      )}
                      {productsList.length > 0 &&
                        productsList.map((item: any, index) => {
                          return (
                            <option key={index + 1} value={item.value}>
                              {item.label}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.productId && formik.errors.productId && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <div className='fv-help-block'>{formik.errors.productId}</div>
                      </div>
                    )}
                  </div>
                </div>
             
                <div className='row row-cols-1 row-cols-md-2 row-cols-lg-1 g-9'>
                  <div className='col-12 mb-5 fv-row fv-plugins-icon-container'>
                    <label className='required form-label'>Subject</label>
                    <input
                      type='text'
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
                      placeholder='Subject'
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <div className='fv-help-block'>{formik.errors.subject}</div>
                      </div>
                    )}
                  </div>
                </div>
                {/*end::Input group*/}
                <div className='min-h-200px mb-5'>
                  <label className='required form-label'>Description</label>
                  <div className='ql-editor ql-blank'>
                    <SunEditor
                      name='message'
                      placeholder='Please type here...'
                      autoFocus={false}
                      onChange={(event: any) => {
                        formik.setFieldValue('message', event)
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
                          ['fontColor', 'textStyle'],
                          ['align', 'list'],
                          ['table', 'link'],
                        ],
                      }}
                    />
                  </div>
                  <div
                    className={clsx(
                      'text-muted fs-8 mt-2',
                      {
                        'is-invalid': formik.touched.message && formik.errors.message,
                      },
                      {
                        'is-valid': formik.touched.message && !formik.errors.message,
                      }
                    )}
                  >
                    Set a description to the question.
                  </div>
                  {formik.touched.message && formik.errors.message && (
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <div className='fv-help-block'>{formik.errors.message}</div>
                    </div>
                  )}
                  {/*end::Description*/}
                </div>
                {/*end::Input group*/}
                <div className='row'>
                  <div className='mb-2 col-md-4'>
                    <label className='form-label'>Select attachments:</label>
                    <UploadImageField
                      setFileToState={setAttachFiles}
                      setFieldValue={formik.setFieldValue}
                      fileName={'attachments'}
                      isMultiple={true}
                      maxFiles={5}
                      textLabel='Please choose files (maximum 5 files)'
                    />
                  </div>
                  <div className='mb-2 col-md-8'>
                    <div className='mt-2'>
                      {attachFiles && attachFiles.length > 0 && (
                        <>
                          <label className='form-label'>Files selected:</label>
                          <div className='attachments-list d-flex mb-2'>
                            {attachFiles.map((file: any, index: number) => {
                              return (
                                <div className='w-50px overflow-hidden me-2' key={index}>
                                  <img src={file} className='h-50px w-auto me-3' />
                                </div>
                              )
                            })}
                          </div>
                          <a
                            href='#'
                            onClick={(event) => {
                              clearAllFiles(event)
                            }}
                          >
                            Clear files
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='d-flex justify-content-end mt-5'>
                  <button type='submit' className='btn btn-primary btn-md' disabled={isSubmitting || orderError}>
                    {!isSubmitting && 'Submit Ticket'}
                    {isSubmitting && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait, processing...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
export default CreateTicket
