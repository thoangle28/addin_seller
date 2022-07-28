import {toAbsoluteUrl} from '../../../helpers'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      <img src={toAbsoluteUrl('/media/logos/logo-v5-200.png')} alt='Addin Seller Portal' />
      <span>Loading ...</span>
    </div>
  )
}

export const AddinLoading = () => {
  return (
    <div className='text-center w-100'>
      <img className='h-40px' src={toAbsoluteUrl('/media/logos/logo-v5-200.png')} alt='Addin Seller Portal' />
      <div className='mt-5 text-center d-flex justify-content-center'>
        <div className='loadding'>
          {/* <span>Loading ...</span> */}
          <div className="balls">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}