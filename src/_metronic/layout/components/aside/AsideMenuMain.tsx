/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
//import {KTSVG} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
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
        to='/sale-report'
        icon='/media/icons/duotune/communication/com012.svg'
        title='Sale Reports'
        fontIcon='bi-layers'
      />
      <AsideMenuItemWithSub
        to='#'
        title='Support Tickets'
        icon='/media/icons/duotune/communication/com007.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/support/ticket/create' title='Create New Ticket' hasBullet={true} />
        <AsideMenuItem to='/support/ticket/listing' title='Tickets Listing' hasBullet={true} />
        <AsideMenuItem to='/support/orders/listing' title='Orders Listing' hasBullet={true} />
      </AsideMenuItemWithSub>     
    </>
  )
}
