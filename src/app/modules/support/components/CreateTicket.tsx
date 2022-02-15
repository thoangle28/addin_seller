import React from 'react'
import { FallbackView } from '../../products/components/formOptions'

const CreateTicket = () => {
    return(
        <div className='card mb-5 mb-xl-8 loading-wrapper'>
            <div className='card-body py-3 loading-body'>
            <FallbackView />
            </div>
        </div>
    )
}
export default CreateTicket