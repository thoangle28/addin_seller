import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { MixedWidget1, MixedWidget3, MixedWidget2, } from '../../../_metronic/partials/widgets';

const productBreadCrumbs: Array<PageLink> = [];

const data = {
  weeklySales: 120,
  newUsers: 50,
  itemOrders: 40,
  bugReports: 44
}

const ReportPage: React.FC = () => {
  const [val, setVal] = useState()
  const onChangeHandler = (e: any) => {
    setVal(e.target.value)
  }
  return (
    <>
      <Switch>
        <Route path='/sale-report'>
          <PageTitle breadcrumbs={productBreadCrumbs}>Sale Reports</PageTitle>

          <div className={`card card-products`}>
            <div className='row gy-2 g-xl-8 px-6 py-6'>
              <div className='col-xxl-6'>
                <input
                  type='text'
                  name='searchTerm'
                  className='form-control px-2 py-2 me-3'
                  id='searchTerm'
                  placeholder='Search'
                  onChange={(e) => { onChangeHandler(e) }}
                />
              </div>
              <div className='col-xxl-6'>
                <select
                  className='form-select form-select-solid form-select-sm me-3'
                  onChange={(e) => { onChangeHandler(e) }}
                  style={{ width: '180px' }}
                >
                  <option value=''>All</option>
                  <option value='draft'>Draft</option>
                  <option value='pending'>Pending</option>
                  <option value='publish'>Publish</option>
                </select>
              </div>
            </div>
            <div className='row gy-2 g-xl-8 py-6 px-10'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>Sale Reports</span>
              </h3>
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