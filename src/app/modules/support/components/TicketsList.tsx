import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {RootState} from '../../../../setup'
import { Pagination } from '../../../../_metronic/partials/content/pagination/Paginaton'
//import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import {FallbackView} from '../../products/components/formOptions'
import {GetTicketsListing, CreatePagination} from './supportApi'
//import { useReducer } from "react";
type props = {
  totalTicket: number
  totalPages: number
  currentPage: number
  pageSize: number
  status?: string
}

const TicketsList = () => {
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const currentUserId = auth && auth.user ? auth.user.ID : 0

  const [loading, setLoading] = useState(true)
  const [ticketStatus, setTicketStatus] = useState('')
  const [ticketsListing, setTicketsListing] = useState<any>({})
  const [ticketInfo, setTicketInfo] = useState<props>({
    totalTicket: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 0,
    status: '',
  })

  const initialParams = {
    userId: currentUserId,
    accessToken: auth.accessToken,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    status: '',
  }

  const [isPaginate, setPaginate] = useState(false)
  const [listPages, setListPages] = useState<any>({})

  //const loadTicketsListing = GetTicketsListing(initialParams)

  useEffect(() => {
    loadTicketListing(initialParams)
  }, [])

  const onChangePage = (pageSize: number = 10, currentPage: number = 1) => {
    initialParams.pageSize = pageSize
    initialParams.currentPage = currentPage
    loadTicketListing(initialParams)
  }

  const onChangeStaus = (ticketStatus: string) => {
    const params = {...initialParams, status: ticketStatus}
    setTicketStatus(ticketStatus)
    params.currentPage = 1
    loadTicketListing(params)
  }

  const loadTicketListing = (initialParams: any) => {
    const loadTicketsListing = GetTicketsListing(initialParams)
    loadTicketsListing.then((response: any) => {
      const {data} = response

      setTicketsListing(data.ticket_list)
      setTicketInfo({
        totalTicket: data.total_ticket,
        totalPages: data.total_pages,
        currentPage: data.current_page,
        pageSize: data.page_size,
        status: ticketInfo.status,
      })

      const listPagination = CreatePagination(data.current_page, data.total_pages)
      setListPages(listPagination)
      setLoading(false)
      setPaginate(false)
    })
  }

  return (
    <>
      {(loading && (
        <div className='card mb-5 mb-xl-8 loading-wrapper'>
          <div className='card-body py-3 loading-body'>
            <FallbackView />
          </div>
        </div>
      )) || (
        <div className='card card-xxl-stretch mb-5 mb-xxl-8'>
          {/* begin::Header */}
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Tickets Listing</span>
              <span className='text-muted mt-1 fw-bold fs-7'>
                {(ticketInfo.totalTicket && <>Over {ticketInfo.totalTicket} ticket(s)</>) || ''}
              </span>
            </h3>
            <div className='card-toolbar'>
              <div className='me-4 my-1 d-none'>
                <div className='d-flex align-items-center position-relative my-1'>
                  <span className='svg-icon svg-icon-3 position-absolute ms-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <rect
                        opacity='0.5'
                        x='17.0365'
                        y='15.1223'
                        width='8.15546'
                        height='2'
                        rx='1'
                        transform='rotate(45 17.0365 15.1223)'
                        fill='black'
                      />
                      <path
                        d='M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z'
                        fill='black'
                      />
                    </svg>
                  </span>
                  {/*end::Svg Icon */}
                  <input
                    type='text'
                    id='kt_filter_search'
                    className='form-control form-control-solid form-select-sm w-150px ps-9'
                    placeholder='Search Ticket'
                  />
                </div>
              </div>
              <div className='me-4 my-1'>
                <div className='d-flex align-items-center position-relative my-1 status-product'>
                  <select
                    className='form-select form-select-solid form-select-sm'
                    value={ticketStatus}
                    onChange={(e) => {
                      setPaginate(true)
                      onChangeStaus(e.target.value)
                    }}
                  >
                    <option value=''>All</option>
                    <option value='processing'>Processing</option>
                    <option value='closed'>Closed</option>
                    <option value='open'>Opening</option>
                  </select>
                </div>
              </div>
              <Link to='/support/ticket/create' className='btn btn-sm btn-light btn-primary'>
                <span className='svg-icon svg-icon-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <rect
                      opacity='0.5'
                      x='11.364'
                      y='20.364'
                      width='16'
                      height='2'
                      rx='1'
                      transform='rotate(-90 11.364 20.364)'
                      fill='black'
                    />
                    <rect x='4.36396' y='11.364' width='16' height='2' rx='1' fill='black' />
                  </svg>
                </span>
                New Ticket
              </Link>
            </div>
          </div>
          {/*end::Header */}
          {/* begin::Body */}
          <div className='card-body py-5'>
            <div className='tab-content'>
              {/* begin::Tap pane */}
              <div className='tab-ticket mt-5'>
                {/* begin:: Row Ticket */}
                <div id='tickets_listing_wrapper'>
                  {(ticketsListing &&
                    ticketsListing.length > 0 &&
                    ticketsListing.map((ticket: any, i: number) => {
                      const statusTicket: any = {text: 'New', status: 'open'}
                      switch (ticket.status) {
                        case 'open':
                          statusTicket.text = 'Open'
                          statusTicket.status = 'primary'
                          break

                        case 'closed':
                          statusTicket.text = 'Closed'
                          statusTicket.status = 'success'
                          break

                        case 'processing':
                          statusTicket.text = 'Processing'
                          statusTicket.status = 'warning'
                          break
                      }

                      return (
                        <div
                          key={i}
                          className='ticket-block mt-2 shadow-sm p-5 mb-5 bg-body rounded'
                        >
                          <div className='row'>
                            <div className='col-12'>
                              <div className='ticket-container'>
                                <div className='ticket-subject mb-3'>
                                  <h4>
                                    <Link
                                      className='fs-4 fw-bold'
                                      to={{
                                        pathname: '/support/ticket/details',
                                        hash: '#' + ticket.id,
                                        state: {ticketId: ticket.id},
                                      }}
                                    >
                                      {ticket.subject}
                                    </Link>
                                  </h4>
                                </div>
                                <div className='ticket-requests'>{ticket.message_content}</div>
                                <ul className='list-inline mt-5 mb-0'>
                                  <li className='list-inline-item me-5'>From: {ticket.customer}</li>
                                  <li className='list-inline-item me-5'>
                                    Replied: {ticket.count_ticket}
                                  </li>
                                  <li className='list-inline-item me-5'>
                                    <Link
                                      className='mr-3 view'
                                      to={{
                                        pathname: '/support/ticket/details',
                                        hash: '#' + ticket.id,
                                        state: {ticketId: ticket.id},
                                      }}
                                    >
                                      View Ticket
                                    </Link>
                                  </li>
                                  {/*  <li className="list-inline-item me-5">
																															<a href="#" className="mr-3 delete badge badge-light-danger">
																																	<img src={toAbsoluteUrl("/media/icons/duotune/general/gen027.svg")} 
																																	className="h-15px w-auto me-2" />Delete</a></li> */}
                                  <li className='list-inline-item me-5'>
                                    <span className='me-2'>Status: </span>
                                    <span
                                      className={`me-3 badge badge-light-${statusTicket.status}`}
                                    >
                                      {statusTicket.text}
                                    </span>
                                  </li>
                                  <li className='list-inline-item me-5'>
                                    <i className='feather icon-calendar f-14'></i>Updated:{' '}
                                    {ticket.created}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })) || (
                    <div className='ticket-block mt-2 shadow-sm p-5 mb-5 bg-body rounded'>
                      <div className='row'>
                        <div className='col-12 text-center p-4'>There is not the ticket found!</div>
                      </div>
                    </div>
                  )}
                </div>
                {/* end: Row Ticket*/}
                {/* begin: Pagination */}
								<Pagination
									totalPages={ticketInfo.totalPages}
									pageSize={ticketInfo.pageSize}
									currentPage={ticketInfo.currentPage}
									onChange={onChangePage}
								/>
								{/* end: Pagination */}
              </div>
              {/*end::Tap pane */}
            </div>
          </div>
          {/*end::Body */}
        </div>
      )}
    </>
  )
}
export default TicketsList
