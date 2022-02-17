import React, { useEffect, useState } from 'react';
import { FallbackView } from '../../products/components/formOptions';

const TicketDetails = () => {

    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    })
    return (
        <>
        {isLoading && (
        <div className='card mb-5 mb-xl-8 loading-wrapper'>
            <div className='card-body py-3 loading-body'>
                <FallbackView />
            </div>
         </div>
        ) || (
        <div className='card mb-5 mb-xl-8'>
            <div className='card-header border-0 cursor-pointer' >
                <div className='card-title m-0'>
                    <h2 className='fw-bolder m-0'>Ticket Details</h2>
                </div>
            </div>
            <div className='card-body py-3'>
                <div className='ticket-content'>
                    <table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
                        <tr className="odd">
                            <td className="ticket_detail_td_title">
                                Customer
                            </td>
                            <td className="">					
                                <a href="#">Emma Smith</a>
                            </td>
                            <td className="ticket_detail_td_title">
                                Assigned
                            </td>
                            <td className="">
                                <a href="#">Alan Smith</a>
                            </td>
                        </tr>
                        <tr className="even">
                            <td className="ticket_detail_td_title">
                                Contact
                            </td>
                            <td>
                                <i className="far fa-envelope"></i>
                                <a href="#">mail@gmail.com</a>
                            </td>
                            <td className="ticket_detail_td_title">
                                Created
                            </td>
                            <td className="">
                                <i className="fas fa-calendar-week"></i>
                                10 Mar 2021
                            </td>
                        </tr>
                        <tr className="odd">
                            <td className="ticket_detail_td_title">
                                Order
                            </td>
                            <td>
                                #75757
                            </td>
                            <td className="ticket_detail_td_title">
                                Response
                            </td>
                            <td className="">
                                <i className="far fa-clock"></i>
                                8:00 am
                            </td>
                        </tr>

                    </table>
                    <div className="card card-xxl-stretch mb-5 mb-xl-8">
                        <div className="row">
                            <div className="subject_ticket">
                                <div data-kt-inbox-message="message_wrapper">                
                                    <div className="d-flex flex-wrap gap-2 flex-stack cursor-pointer">                    
                                        <div className="pe-5">                            
                                            <div className="d-flex align-items-center flex-wrap gap-1">
                                                <div className="mb-3">
                                                <h4>Lorem Ipsum is simply dummy text of the printing and typesetting industry</h4>
                                                </div>                        
                                            </div>                            
                                            <div className="text-muted fw-bold ticket_detail_preview">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                            </div>
                                            <div className="ticket_detail fade collapse show">
                                                <div className="py-5">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                                    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
                                                </div>													
                                            </div>	
                                        </div>       
                                    </div>                                   												
                                </div>
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