import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../../../setup';
//import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { FallbackView } from '../../products/components/formOptions';
import { GetOrdersListOfCustomer, CreatePagination } from './supportApi';


type props = {
	totalTicket: number 
	totalPages: number
	currentPage: number
	pageSize: number
	paymentStatus?: string // fail, procecssing, complete, pending
}

const OrdersList = () => {
    const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
	const currentUserId = (auth && auth.user) ? auth.user.ID : 0

    const [loading, setLoading] = useState(true)
	//const [ticketStatus, setTicketStatus] = useState('')
    const [ordersListing, setOrdersListing] = useState<any>({})
	const [orderInfo, setOrderInfo] = useState<props>({totalTicket: 0, totalPages: 0, currentPage: 0, pageSize: 0, paymentStatus: ''})	
    const [isPaginate, setPaginate] = useState(false)
	const [listPages, setListPages] = useState<any>({})

    const initialParams = {
        customerId: currentUserId,
        accessToken: auth.accessToken,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        paymentStatus: ''
    }
    
    useEffect(() => {
        loadOrderListing(initialParams)
    }, [])

    const loadOrderListing = (params: any) => {
        const ordersList = GetOrdersListOfCustomer(params)
        ordersList.then((response: any) => {
            const { data } =  response		
            console.log(data)		
            setLoading(false)
            /*   
            setOrdersListing(data.ticket_list)						
            setOrderInfo({
                totalTicket: data.total_ticket, 
                totalPages: data.total_pages, 
                currentPage: data.current_page, 
                pageSize: data.page_size,
                status: ticketInfo.status
            }) */
            
           /*  const listPagination = CreatePagination(data.current_page, data.total_pages)
            setListPages(listPagination)
            setLoading(false)
            setPaginate(false) */
        })
    }

    return(
        <>
        {
            (loading && (
            <div className='card mb-5 mb-xl-8 loading-wrapper'>
                <div className='card-body py-3 loading-body'>
                <FallbackView />
                </div>
            </div>
            )) || (
            <div className='card mb-5 mb-xl-8'>
                <div className='card-body py-3'>
                    fsdf
                </div>
            </div>
            )
        }        
        </>   
    )
}
export default OrdersList