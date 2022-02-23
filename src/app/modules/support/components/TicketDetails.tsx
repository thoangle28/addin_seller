import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useLocation} from 'react-router-dom'
import {RootState} from '../../../../setup'
import {AddinLoading} from '../../../../_metronic/partials/content/fallback-view/FallbackView'
import {GetTicketDetails, CreateMesssageTicket} from './supportApi'
import {UploadImageField} from '../../../../_metronic/partials/content/upload/UploadFile'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {confirmAlert} from 'react-confirm-alert'

const TicketDetails = () => {
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const userId = auth && auth.user ? auth.user.ID : 0

  const ticketLocation: any = useLocation()
  const ticketId = (ticketLocation && ticketLocation.state.ticketId) || 0

  const [isLoading, setLoading] = useState(true)
  const [ticketInfo, setTicketInfo] = useState<any>()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadTicketDetails()
  }, [])

  const loadTicketDetails = () => {
    if (typeof ticketLocation !== 'undefined') {
      const detail = GetTicketDetails(ticketId, null)
      detail
        .then((response: any) => {
          const created = response.created.split(' ')
          setTicketInfo({
            head: {
              customer: response.customer_name,
              email: response.email,
              order_id: response.order_id,
              created: created[0],
              time: created[1],
              assigned: response.assigned,
            },
            subject: response.subject,
            messages: response.ticket_message,
          })
					setLoading(false)
        })
        .catch(() => {})
    }
  }

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
								setLoading(true)
                loadTicketDetails()
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

  ////////////////////////////

  type iTicket = {
    userId: number
    ticketId: number
    message: string
    attachments: string[]
    closed: boolean
  }

  const [attachFiles, setAttachFiles] = useState<any>([])
  const defaultValues: iTicket = {
    userId: userId,
    ticketId: ticketId,
    message: '',
    attachments: [],
    closed: false,
  }
	
	const initialValues = {...defaultValues}

  const validationTicket = Yup.object().shape({
    message: Yup.string()
      .test('message', 'Message is required', (value) => {
        return typeof value !== undefined && value !== '<p><br></p>'
      })
      .required('Message is required'),
  })

  const formik = useFormik<iTicket>({
    initialValues,
    validationSchema: validationTicket,
		enableReinitialize: true,
    onSubmit: (values, {setSubmitting, resetForm}) => {
      setIsProcessing(true)
      CreateMesssageTicket(values).then((response: any) => {
        const { code, message, data } = response   
				if(code === 200 && message === 'DONE') {
					confirmRequest('Your ticket has been created successfully.')
					setIsProcessing(false)
					resetForm()
					setSubmitting(false);
				}
      })
    },
  })

  const clearAllFiles = (e: any) => {
    e.preventDefault()
    setAttachFiles([])
    formik.setFieldValue('attachments', [])
  }

  const ShowAttachments = (attachments: any) => {
    return (attachments && attachments.length > 0 && (
      <div className='files pt-3'>
        <div>
          <span className='fw-bold'>Attachments: </span>
        </div>
        <div className='files pt-3'>
          {attachments.map((image: any, index: number) => {
            return (
              <Link
                to={{
                  pathname: image.path,
                }}
                target='_blank'
                rel='noopener'
                key={index}
              >
                <img
                  src={image.path}
                  className='h-50px w-auto me-3'
                />
              </Link>
            )
          })}
        </div>
      </div>
    ))
  }
  return (
    <>
      {(isLoading && (
        <div className='card mb-5 mb-xl-8 loading-wrapper'>
          <div className='card-body py-3 loading-body'>
            <AddinLoading />
          </div>
        </div>
      )) || (
        <div className='card mb-5 mb-xl-8'>
          <div className='card-header border-0 cursor-pointer'>
            <div className='card-title m-0'>
              <h2 className='fw-bolder m-0'>Ticket Details</h2>
            </div>
          </div>
          <div className='card-body py-3'>
            <div className='ticket-content'>
              <table className='table table-border align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'>
                <tbody>
                  <tr className='odd'>
                    <td className='ticket_detail_td_title'>Customer</td>
                    <td className='fw-bold'>{ticketInfo.head.customer}</td>
                    <td className='ticket_detail_td_title'>Assigned</td>
                    <td className='fw-bold'>{ticketInfo.head.assigned}</td>
                  </tr>
                  <tr className='even'>
                    <td className='ticket_detail_td_title'>
                      <i className='far fa-envelope'></i> Contact
                    </td>
                    <td className='fw-bold'>{ticketInfo.head.email}</td>
                    <td className='ticket_detail_td_title'>
                      <i className='fas fa-calendar-week'></i> Created
                    </td>
                    <td className='fw-bold'>{ticketInfo.head.created}</td>
                  </tr>
                  <tr className='odd'>
                    <td className='ticket_detail_td_title'>Order</td>
                    <td className='fw-bold'>{ticketInfo.head.order_id}</td>
                    <td className='ticket_detail_td_title'>
                      <i className='far fa-clock'></i>Time
                    </td>
                    <td className='fw-bold'>{ticketInfo.head.time}</td>
                  </tr>
                </tbody>
              </table>
              <div className='card card-xxl-stretch mb-5 mb-xl-8'>
                <div className='row'>
                  <div className='subject_ticket  col-12'>
                    <div className='pe-5'>
                      <div className='mb-3'>
                        <h4>{ticketInfo.subject}</h4>
                      </div>
                      {ticketInfo && ticketInfo.messages && (
                        <>
                          <div className='ticket_detail'>
                            <div className='py-5' dangerouslySetInnerHTML={{__html: ticketInfo.messages[0].ticket_message}} />
                          </div>
                          { ShowAttachments(ticketInfo.messages[0].attchment_image) }
                        </>
                      )}
                    </div>
                    <div className='separator my-6' />
                  </div>
                </div>
								<div className='overflow-auto' 
								style={{	
									position: 'relative',
									maxHeight: '500px',
									overflow: 'scroll',
									width: 'auto',
									paddingRight: '15px'}} >
                {!!ticketInfo.messages &&
                  ticketInfo.messages.map((message: any, index: number) => {
                    const attachments = message.attchment_image
                    return (index > 0 && (
                      <div className='row' key={index}>
                        <div className='message_wrapper col-12'>
                          <div className='d-flex flex-wrap gap-2 flex-stack cursor-pointer'>
                            <div className='d-flex align-items-center'>
                              <div className='pe-5'>
                                <div className='d-flex align-items-center flex-wrap gap-1 mb-3'>
                                  <span className='fw-bolder text-dark text-hover-primary'>
                                    {message.author_name}
                                  </span>
                                  <span className='svg-icon svg-icon-7 svg-icon-success mx-3'>
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      width='24px'
                                      height='24px'
                                      viewBox='0 0 24 24'
                                      version='1.1'
                                    >
                                      <circle fill='#000000' cx={12} cy={12} r={8} />
                                    </svg>
                                  </span>
                                  <span className='text-muted text-end me-3'>
                                    {message.ticket_created_on}
                                  </span>
                                </div>
                                <div className='collapse show'>
                                  <div className='message' dangerouslySetInnerHTML={{__html: message.ticket_message}} />
                                  { ShowAttachments(attachments) }                                 
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='separator my-6' />
                        </div>
                      </div>
                    ))
                  })
								}
								</div>
                <form onSubmit={formik.handleSubmit} noValidate className='form'>
                  <div className='row'>
                    <div className='col-12'>
											<hr />
                      <h3 className='mb-5'>New Message</h3>
                      <div className='min-h-200px mb-5'>
                        <label className='required form-label'>Reply / Request</label>
                        <div className='ql-editor ql-blank'>
                          <SunEditor
                            name='message'
                            placeholder='Please type here...'
                            autoFocus={false}
                            onChange={(event: any) => {
                              formik.setFieldValue('message', event)
                              formik.handleChange(event)
                            }}
                            defaultValue={formik.values.message}
                            setContents={formik.values.message}
                            width='100%'
                            height='300px'
                            setDefaultStyle={''}
                            setOptions={{
                              buttonList: [
                                ['font', 'fontSize', 'formatBlock'],
                                [
                                  'bold',
                                  'underline',
                                  'italic',
                                  'strike',
                                  'subscript',
                                  'superscript',
                                ],
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
                          {' '}
                        </div>
                        {formik.touched.message && formik.errors.message && (
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <div className='fv-help-block'>{formik.errors.message}</div>
                          </div>
                        )}
                        {/*end::Description*/}
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-4'>
                      {/*end::Input group*/}
                      <div className='attchments'>
                        <label className='form-label'>Attachments</label>
                        <UploadImageField
                          setFileToState={setAttachFiles}
                          setFieldValue={formik.setFieldValue}
                          fileName={'attachments'}
                          isMultiple={true}
                          textLabel='Add attachments to message'
                        />
                      </div>
                    </div>
                    <div className='col-5'>
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
                    <div className='col-3'>
                      <div className='form-check form-check-custom form-check-solid mt-5 mb-3'>
                        <label className='form-check-label ms-0 d-flex align-items-center'>
                          <input
                            type='checkbox'
                            name='closed'
                            className='form-check-input me-2 fs-7'
                            checked={formik.values.closed}
                            onChange={formik.handleChange}
                          />
                          Close this ticket
                        </label>
                      </div>
                      <div className='d-flex'>
                        <button
                          type='submit'
                          className='btn btn-primary btn-md'
                          disabled={isProcessing}
                        >
                          {!isProcessing && 'Submit Ticket'}
                          {isProcessing && (
                            <span className='indicator-progress' style={{display: 'block'}}>
                              Please wait...{' '}
                              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default TicketDetails
