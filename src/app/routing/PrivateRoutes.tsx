import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { FallbackView } from '../../_metronic/partials'
import LatestOrder from '../modules/products/components/LatestOrder'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'

export function PrivateRoutes() {

  const ProductPage = lazy(() => import('../modules/products/ProductPage'))
  const ReportPage = lazy(() => import('../modules/sale/ReportPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const SupportTicketPage = lazy(() => import('../modules/support/SupportTicket'))

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/dashboard' component={DashboardWrapper} />
        <Route path='/product/listing' component={ProductPage} />
        <Route path='/product/attributes' component={ProductPage} />
        <Route path='/product/OrdersListing' component={LatestOrder} />
        <Route path='/product/create' component={ProductPage} />
        <Route path='/product/update/:id' component={ProductPage} />
        <Route path='/sale-report' component={ReportPage} />
        {/* Account */}
        <Route path='/account/overview' component={AccountPage} />
        <Route path='/account/settings' component={AccountPage} />
        {/* Support Ticket */}
        <Route path='/support/ticket/create' component={SupportTicketPage} />
        <Route path='/support/ticket/listing' component={SupportTicketPage} />
        <Route path='/support/ticket/details' component={SupportTicketPage} />
        <Route path='/support/orders/listing' component={SupportTicketPage} />

        <Redirect from='/auth' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )
}
