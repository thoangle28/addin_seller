import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom'
import { RootState } from '../../../setup';
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { AddinLoading } from '../../../_metronic/partials';
import { MixedWidget1, MixedWidget2, MixedWidget10, MixedWidget11, } from '../../../_metronic/partials/widgets';
import { TotalYearData } from './SaleReportAPI';

const productBreadCrumbs: Array<PageLink> = [];

const data = {
  weeklySales: 120,
  newUsers: 50,
  itemOrders: 40,
  bugReports: 44
}

const ReportPage: React.FC = () => {
  // Declares constant
  const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
  const currentUserId = user ? user.ID : undefined
  const tabs: string[] = ['Year', 'Last Month', 'This Month', 'Week']

  // Declare States
  const [totalData, setTotalData] = useState<any>()
  console.log(totalData)
  const [isActiveIndex, setActiveIndex] = useState<number>(0);
  const [tab, setTab] = useState<string>('Year')
  const [formValue, setFormValue] = useState({})
  const onChangeHandler = (e: any) => {
    const { name, value } = e.target
    setFormValue({ ...formValue, [name]: value });
  }


  // get 12 months data 
  const getTotalYearData = (userId: string | number) => {
    TotalYearData(userId).then(res => {
      const { data, code } = res.data
      if (code === 200) {
        setTotalData(data)
      }
    }).catch()
  }
  useEffect(() => {
    switch (tab) {
      case 'Year':
        getTotalYearData(currentUserId)
        break;
      case 'Last Month':
        console.log("This Month is Calling")
        break;
      case 'This Month':
        console.log("This Month isCalling")
        break;
      case 'Week':
        console.log("Week Is calling")
        break;
      default:
        getTotalYearData(currentUserId)
        break;
    }
    return setTotalData('')
  }, [tab])

  const total = totalData && totalData.list.map((item: any) => {
    if (!item.total) {
      return 0;
    }
    return parseInt(item.total)
  })

  const timeline = totalData && totalData.list.map((item: any) => {
    return `${item.month} - ${item.year}`
  })

  console.log(timeline)
  const pageHeader = () => {
    return (<>
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
            name="searchSelect"
            style={{ width: '180px' }}
          >
            <option value=''>All</option>
            <option value='draft'>Draft</option>
            <option value='pending'>Pending</option>
            <option value='publish'>Publish</option>
          </select>
        </div>
      </div>
      <div className='row gy-2 g-xl-8 px-6 py-0'>
        <div className='col-xxl-6'>
          <ul className="nav nav-tabs">
            {tabs.map((tab: string, index: number) => {
              const checkOpen = isActiveIndex === index;
              return <li key={index} onClick={() => { setTab(tab); setActiveIndex(index) }} className="nav-item cursor-pointer"><p className={`dropdown-item ${checkOpen ? 'active' : ''}`}  >{tab}</p></li>
            })}
          </ul>
        </div>
      </div></>)
  }

  const renderData = () => {
    return (
      <>
        <div className='row gy-2 g-xl-8 py-6 px-10'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Sale Reports</span>
          </h3>
        </div>
        <div className='row gy-2 g-xl-8 px-6 py-6'>
          <MixedWidget10
            className='card-xxl-stretch-50 mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='150px'
          />
          <MixedWidget11
            className='card-xxl-stretch-50 mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='175px'
            dateTime={totalData.time}
            total={total}
            timeline={timeline}
          />
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
      </>
    )
  }

  return (
    <>
      <Switch>
        <Route path='/sale-report'>
          <PageTitle breadcrumbs={productBreadCrumbs}>Sale Reports</PageTitle>
          <div className={`card card-products`}>
            {pageHeader()}
            {
              totalData ? renderData() : (
                <div className='card mb-5 mb-xl-8 loading-wrapper'>
                  <div className='card-body py-3 loading-body'>
                    <AddinLoading />
                  </div>
                </div>
              )}
          </div>
        </Route>
      </Switch>

    </>
  )
}

export default ReportPage