import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { MixedWidget1, MixedWidget10, MixedWidget4, MixedWidget3, MixedWidget2, } from '../../../_metronic/partials/widgets';

const productBreadCrumbs: Array<PageLink> = [];

const profile = {
  image: '/media/avatars/150-2.jpg',
  title: 'title',
  date: '12/2/2022'
}
const data = {
  weeklySales: 120,
  newUsers: 50,
  itemOrders: 40,
  bugReports: 44
}

const ReportPage: React.FC = () => {

  return (
    <>
      <Switch>
        <Route path='/sale-report'>
          <PageTitle breadcrumbs={productBreadCrumbs}>Sale Reports</PageTitle>
          <div className={`card card-products`}>
            <div className='row gy-2 g-xl-8 py-6 px-10'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>Sale Reports</span>
              </h3>
            </div>
            <div className='row gy-2 g-xl-8 py-6 px-10'>
              <MixedWidget4 {...profile} className='success bg-info bg-gradient' color={'success'} progress='69%' />
            </div>
            <div className='row gy-2 g-xl-8 px-6 py-6'>
              <div className="col-xxl-12">
                <MixedWidget3 chartHeight='200' className='success bg-warning' chartColor='success' />
              </div>
            </div>
            <div className='row gy-2 g-xl-8 px-6'>
              <div className="col-xxl-6">
                <MixedWidget1 className='success bg-dark bg-gradient' color='default' />
              </div>
              <div className="col-xxl-6">
                <MixedWidget2
                  className='card-xl-stretch mb-xl-8'
                  chartColor='danger'
                  chartHeight='180px'
                  strokeColor='#cb1e46'
                  {...data} />
              </div>
            </div>

          </div>
        </Route>
      </Switch>

    </>
  )
}

export default ReportPage