import React, {Suspense, lazy} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'

export function PrivateRoutes() {
  
  const ProductPage = lazy(() => import('../modules/products/ProductPage'))
  const ReportPage = lazy(() => import('../modules/sale/ReportPage'))
  
  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/dashboard' component={DashboardWrapper} />
        <Route path='/product/listing' component={ProductPage} />
        <Route path='/product/create' component={ProductPage} />
        <Route path='/product/update/:id' component={ProductPage} />
        <Route path='/sale-report' component={ReportPage} />
        <Redirect from='/auth' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        <Redirect to='error/404' />        
      </Switch>
    </Suspense>
  )
}
