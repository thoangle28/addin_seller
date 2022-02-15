import React from 'react';
import { FallbackView } from '../../products/components/formOptions';

const TicketsList = () => {
    return(
        <>
        {/* <div className='card mb-5 mb-xl-8 loading-wrapper'>
            <div className='card-body py-3 loading-body'>
            <FallbackView />
            </div>
        </div> */}        
        <div className="card card-xxl-stretch mb-5 mb-xxl-8">
            {/* begin::Header */}
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bolder fs-3 mb-1">Tickets Listing</span>
                </h3>
                <div className="card-toolbar">
                    <div className="me-4 my-1">
                        <div className="d-flex align-items-center position-relative my-1">
                            <span className="svg-icon svg-icon-3 position-absolute ms-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black" />
                                    <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black" />
                                </svg>
                            </span>
                            {/*end::Svg Icon */}
                            <input type="text" id="kt_filter_search" className="form-control form-control-solid form-select-sm w-150px ps-9" placeholder="Search Ticket" />
                        </div>
                    </div>
                    <div className="me-4 my-1">
                        <div className="d-flex align-items-center position-relative my-1 status-product">
                            <select name="business_type" className="form-select form-select-solid" data-control="select2" data-placeholder="Status" data-allow-clear="true" data-hide-search="true">
                                <option></option>
                                <option value="1">All</option>
                                <option value="2">Pedding</option>
                                <option value="3">Draf</option>
                            </select>
                        </div>
                    </div>
                    <a href="/html/support.html" className="btn btn-sm btn-light btn-primary" >
                        {/* begin::Svg Icon | path: icons/duotune/arrows/arr075.svg */}
                        <span className="svg-icon svg-icon-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect opacity="0.5" x="11.364" y="20.364" width="16" height="2" rx="1" transform="rotate(-90 11.364 20.364)" fill="black" />
                                <rect x="4.36396" y="11.364" width="16" height="2" rx="1" fill="black" />
                            </svg>
                        </span>
                        New Ticket
                    </a>
                </div>
            </div>
            {/*end::Header */}
            {/* begin::Body */}
            <div className="card-body py-5">
                <div className="tab-content">
                    {/* begin::Tap pane */}
                    <div className="tab-ticket mt-5">
                        {/* begin:: Row Ticket */}
                        <div id="kt_datatable_tickets_listing_wrapper" className="dataTables_wrapper dt-bootstrap4 ">
                            <div className="ticket-block mt-2 shadow-sm p-5 mb-5 bg-body rounded">
                                <div className="row">                                    
                                    <div className="col-12">
                                        <div className="customer">
                                            <div className="ticket-customer">
                                                <h4>Subject for question - Furniture</h4>
                                            </div>
                                            <div className="requests-customer">                                                
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                            </div>
                                            <ul className="list-inline mt-5 mb-0">
                                                <li className="list-inline-item me-5"><i className="feather icon-calendar f-14"></i>Updated 15/02/2022</li>
                                                <li className="list-inline-item me-5">
                                                    <img src="https://image.freepik.com/free-vector/young-black-girl-avatar_53876-115570.jpg" 
                                                    className="rounded img-fluid w-20px me-2" />Customer A</li>                                                
                                                <li className="list-inline-item me-5">
                                                    <img src="https://as2.ftcdn.net/v2/jpg/03/08/43/19/1000_F_308431972_g5fuiXwgOZpDCMFQougq13hgSaQVHVro.jpg" 
                                                    className="rounded img-fluid w-20px me-2" />Replied: 10</li>
                                                <li className="list-inline-item me-5">
                                                    <a href="./html/ticket-detail.html" className="mr-3 view">
                                                        <img src="https://cdn2.iconfinder.com/data/icons/picol-vector/32/view-512.png" 
                                                        className="rounded img-fluid w-20px me-2" />View Ticket</a></li>
                                                <li className="list-inline-item me-5">
                                                    <a href="#" className="mr-3 delete">
                                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-yDVmnjALftIAYwGsRo41C-RjDWChWCU1-g&usqp=CAU" 
                                                        className="rounded img-fluid h-15px w-auto me-2" />Delete</a></li>
                                                <li className="list-inline-item"><a href="#" className="mr-3 badge badge-light-success">Pendding</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>           
                            <div className="ticket-block mt-2 shadow-sm p-5 mb-5 bg-body rounded">
                                <div className="row">                                    
                                    <div className="col-12">
                                        <div className="customer">
                                            <div className="ticket-customer">
                                                <h4>Subject for question - Furniture</h4>
                                            </div>
                                            <div className="requests-customer">                                                
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                            </div>
                                            <ul className="list-inline mt-5 mb-0">
                                                <li className="list-inline-item me-5"><i className="feather icon-calendar f-14"></i>Updated 15/02/2022</li>
                                                <li className="list-inline-item me-5">
                                                    <img src="https://image.freepik.com/free-vector/young-black-girl-avatar_53876-115570.jpg" 
                                                    className="rounded img-fluid w-20px me-2" />Customer A</li>                                                
                                                <li className="list-inline-item me-5">
                                                    <img src="https://as2.ftcdn.net/v2/jpg/03/08/43/19/1000_F_308431972_g5fuiXwgOZpDCMFQougq13hgSaQVHVro.jpg" 
                                                    className="rounded img-fluid w-20px me-2" />Replied: 10</li>
                                                <li className="list-inline-item me-5">
                                                    <a href="./html/ticket-detail.html" className="mr-3 view">
                                                        <img src="https://cdn2.iconfinder.com/data/icons/picol-vector/32/view-512.png" 
                                                        className="rounded img-fluid w-20px me-2" />View Ticket</a></li>
                                                <li className="list-inline-item me-5">
                                                    <a href="#" className="mr-3 delete">
                                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-yDVmnjALftIAYwGsRo41C-RjDWChWCU1-g&usqp=CAU" 
                                                        className="rounded img-fluid h-15px w-auto me-2" />Delete</a></li>
                                                <li className="list-inline-item"><a href="#" className="mr-3 badge badge-light-success">Pendding</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>                          
                        </div>
                    </div>
                    {/*end::Tap pane */}    
                </div>
            </div>
            {/*end::Body */}
        </div>
        </>
    )
}
export default TicketsList