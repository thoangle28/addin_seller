/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { useIntl } from 'react-intl'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../../setup/redux/RootReducer'

export function AsideMenuMain() {
  const intl = useIntl()
  const auth: any = useSelector<RootState>(({ auth }) => auth, shallowEqual)
  const { accessToken, user } = auth

  return (
    <>
      {user && user.role === 'seller' && (
        <>
          <AsideMenuItem
            to='/dashboard'
            icon='/media/icons/duotune/art/art002.svg'
            title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
            fontIcon='bi-app-indicator'
          />
          <AsideMenuItem
            to='/product/listing'
            icon='/media/icons/duotune/general/gen019.svg'
            title='Products Listing'
            fontIcon='bi-layers'
          />
          <AsideMenuItem
            to='/product/create'
            state='createProduct'
            icon='/media/icons/duotune/general/gen022.svg'
            title='Create New Product'
            fontIcon='bi-layers'
          />

          <AsideMenuItem
            to='/product/attributes'
            state='attributes'
            icon='/media/icons/duotune/general/gen055.svg'
            title='Attributes'
            fontIcon='bi-layers'
          />
          <AsideMenuItem
            to='/sale-report'
            icon='/media/icons/duotune/communication/com012.svg'
            title='Sale Reports'
            fontIcon='bi-layers'
          />
          <AsideMenuItem
            to='/product/LatestOrder' 
            icon='/media/icons/duotune/general/gen019.svg'
            title='Order List'
            fontIcon='bi-layers'
          />
          <div className='menu-item'>
            <div className='menu-content'>
              <div className='separator mx-1 my-4'></div>
            </div>
          </div>
        </>
      )}


      <div className='menu-item'>
        <div className='menu-content'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Support Tickets</span>
        </div>
      </div>

      <AsideMenuItem to='/support/ticket/create' title='Create New Ticket' hasBullet={true} />
      <AsideMenuItem to='/support/ticket/listing' title='Tickets Listing' hasBullet={true} />
      {user && user.role === 'customer' && (
        <AsideMenuItem to='/support/orders/listing' title='Orders Listing' hasBullet={true} />
      )}
    </>
  )
}
