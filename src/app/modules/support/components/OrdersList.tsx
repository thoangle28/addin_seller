import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {RootState} from '../../../../setup'
import {AddinLoading} from '../../../../_metronic/partials/content/fallback-view/FallbackView'
import {Pagination} from '../../../../_metronic/partials/content/pagination/Paginaton'
//import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import {GetOrdersListOfCustomer, CreatePagination} from './supportApi'

type props = {
  totalOrders: number
  totalPages: number
  currentPage: number
  pageSize: number
}

const OrdersList = () => {
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const currentUserId = auth && auth.user ? auth.user.ID : 0

  const [loading, setLoading] = useState(true)
  //const [ticketStatus, setTicketStatus] = useState('')
  const [ordersListing, setOrdersListing] = useState<any>({})
  const [orderInfo, setOrderInfo] = useState<props>({
    totalOrders: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 0,
  })
  const [isPaginate, setPaginate] = useState(false)
  const [listPages, setListPages] = useState<any>({})

  const initialParams = {
    customerId: currentUserId,
    accessToken: auth.accessToken,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    paymentStatus: '',
  }

  useEffect(() => {
    loadOrderListing(initialParams)
  }, [])

  const loadOrderListing = (params: any) => {
    const ordersList = GetOrdersListOfCustomer(params)
    ordersList.then((response: any) => {
      const {data} = response
      //console.log(data)
      setLoading(false)

      setOrdersListing(data.order_list)
      setOrderInfo({
        totalOrders: data.total_order,
        totalPages: data.total_pages,
        currentPage: data.current_page,
        pageSize: data.page_size,
      })

      const listPagination = CreatePagination(data.current_page, data.total_pages)
      setListPages(listPagination)
      setLoading(false)
      setPaginate(false)
    })
  }

  const onChangePage = (pageSize: number = 10, currentPage: number = 1) => {
    initialParams.pageSize = pageSize
    initialParams.currentPage = currentPage
    loadOrderListing(initialParams)
  }

  return (
    <>
      {(loading && (
        <div className='card mb-5 mb-xl-8 loading-wrapper'>
          <div className='card-body py-3 loading-body'>
            <AddinLoading />
          </div>
        </div>
      )) || (
        <div className='card mb-5 mb-xl-8'>
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Orders Listing</span>
              <span className='text-muted mt-1 fw-bold fs-7'>
                {(orderInfo.totalOrders && <>Over {orderInfo.totalOrders} order(s)</>) || ''}
              </span>
            </h3>
          </div>
          <div className='card-body py-3'>
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder text-muted'>
                    <th className='w-100px text-left'>Order</th>
                    <th className='w-150px text-left'>Date</th>
                    <th className='w-150px text-center'>Order Status</th>
                    <th className='w-auto text-left'>Total</th>
										<th className='w-150px text-center'>Supported</th>										
                    <th className='w-150px text-letf'>Action</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {(ordersListing &&
                    ordersListing.length > 0 &&
                    ordersListing.map((order: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td className='text-left'>#{order.id}</td>
                          <td className='text-left'>{order.date}</td>
                          <td className='text-center text-capitalize'>
                            <span className={`me-3 badge badge-light-primary`}>
                              {order.order_status}
                            </span>
                          </td>
                          <td className='text-left'>{order.total}</td>
													<td className='text-center'>{order.count_ticket}</td>
                          <td className='text-letf'>
                            <Link
                              className='btn btn-success btn-sm'
                              to={{
                                pathname: '/support/ticket/create',
                                hash: `#${order.id}`,
                                state: {orderId: order.id},
                              }}
                            >
                              Need Support
                            </Link>
                          </td>
                        </tr>
                      )
                    })) || (
                    <tr>
                      <td className='text-center' colSpan={5}>
                        No orders found! 
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* end::Table body */}
              </table>
              {/* begin: Pagination */}
              <Pagination
                totalPages={orderInfo.totalPages}
                pageSize={orderInfo.pageSize}
                currentPage={orderInfo.currentPage}
                onChange={onChangePage}
              />
							{/* end: Pagination */}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default OrdersList
