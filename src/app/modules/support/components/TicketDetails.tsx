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
                            <div className="subject_ticket  col-12">
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
                                            <div className="ticket_detail fade collapse">
                                                <div className="py-5">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                                    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
                                                </div>													
                                            </div>	
                                        </div>       
                                    </div>   
                                    <div className="separator my-6" />                                 												
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="message_wrapper col-12">
                                <div className="d-flex flex-wrap gap-2 flex-stack cursor-pointer">
                                    <div className="d-flex align-items-center">
                                    <div className="pe-5">
                                        <div className="d-flex align-items-center flex-wrap gap-1 mb-3">
                                            <a href="#" className="fw-bolder text-dark text-hover-primary">Alan Smith</a>         
                                            <span className="svg-icon svg-icon-7 svg-icon-success mx-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <circle fill="#000000" cx={12} cy={12} r={8} />
                                                </svg>
                                            </span>{/* 
                                            <span className="text-muted fw-bolder">2 days ago</span> */}
                                            <span className="text-muted text-end me-3">19 Aug 2021, 8:43 pm</span>
                                        </div>      
                                        <div className="text-muted ticket_detail_preview">
                                            But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes....
                                        </div>
                                        <div className="collapse fade">
                                            <div className="py-5">
                                                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                                                <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>     
                                </div> 
                                <div className="separator my-6" /> 
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