import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useLocation} from 'react-router-dom'
import {RootState} from '../../../../setup'
import {AddinLoading} from '../../../../_metronic/partials/content/fallback-view/FallbackView'
import {GetTicketDetails, CreatePagination} from './supportApi'

const TicketDetails = () => {
  const ticketLocation: any = useLocation()
  const [isLoading, setLoading] = useState(true)
  const [ticketInfo, setTicketInfo] = useState<any>()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  })

  useEffect(() => {
    loadTicketDetails()
  }, [])

  const loadTicketDetails = () => {
    console.log(ticketLocation)
    if (typeof ticketLocation !== 'undefined') {
      const ticketId = ticketLocation.state.ticketId
      const detail = GetTicketDetails(1, null)
      detail
        .then((response: any) => {
          console.log(response)
          const created = response.created.split(' ')
          setTicketInfo({
            head: {
              customer: response.customer_name,
              email: response.email,
              order_id: response.order_id,
              created: created[0],
              time: created[1],
              assigned: 'Assigned',
            },
            subject: response.subject,
            messages: response.ticket_message,
          })
        })
        .catch(() => {})
    }
    //GetTicketDetails
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
                        <h4>
												{ticketInfo.subject}
                        </h4>
                      </div>
											{ticketInfo && ticketInfo.messages && (
												<>												
												<div className='text-muted fw-bold ticket_detail_preview'>
													{ticketInfo.messages[0].ticket_message}
												</div>
												<div className='ticket_detail fade collapse'>
													<div className='py-5'>
													{ticketInfo.messages[0].ticket_message}
													</div>
												</div>
												</>
											)}
                    </div>
                    <div className='separator my-6' />
                  </div>
                </div>
                <div className='row'>
                  <div className='message_wrapper col-12'>
                    <div className='d-flex flex-wrap gap-2 flex-stack cursor-pointer'>
                      <div className='d-flex align-items-center'>
                        <div className='pe-5'>
                          <div className='d-flex align-items-center flex-wrap gap-1 mb-3'>
                            <a href='#' className='fw-bolder text-dark text-hover-primary'>
                              Alan Smith
                            </a>
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
                            <span className='text-muted text-end me-3'>19 Aug 2021, 8:43 pm</span>
                          </div>
                          <div className='text-muted ticket_detail_preview'>
                           sdfsdf
                          </div>
                          <div className='collapse fade'>
                            <div className='py-5'>
                             sdfdsf
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='separator my-6' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default TicketDetails
