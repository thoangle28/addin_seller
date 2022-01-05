import {toAbsoluteUrl} from '../../../helpers'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      <img src={toAbsoluteUrl('/media/logos/logo-v5-200.png')} alt='Addin Seller Portal' />
      <span>Loading ...</span>
    </div>
  )
}
