import { FC } from 'react'

const Loading: FC = () => {
    return (
        <div className='card card-xxl-stretch-50 mb-5 mb-xl-8'>
            <div className='card-body d-flex justify-content-center align-items-center'>
                <span className='indicator-progress text-center' style={{ display: 'block', width: '100px' }}>
                    Loading...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
            </div>
        </div>
    )
}

export default Loading