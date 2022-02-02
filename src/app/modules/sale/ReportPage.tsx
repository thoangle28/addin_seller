import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

const productBreadCrumbs: Array<PageLink> = [];

const ReportPage: React.FC = () => {
  return (
    <>
      <Switch>
        <Route path='/sale-report'>
          <PageTitle breadcrumbs={productBreadCrumbs}>Sale Reports</PageTitle>
          <div className={`card card-products`}>
            {/* begin::Header */}
            <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>Sale Reports</span>         
              </h3>       
            </div>
            {/* end::Header */}
            {/* begin::Body */}
            <div className='card-body py-3'>
              This feature will be ready soon
            </div>
          </div>
        </Route>
      </Switch>
     
    </>
  )
}

export default ReportPage