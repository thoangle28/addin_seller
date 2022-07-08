import { FC, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../../setup'
import { MixedWidget11, MixedWidget12, MixedWidget13 } from '../../../../_metronic/partials/widgets'
import { loadAllReports, } from '../saleReport'
import { CURRENT_MONTH, CURRENT_YEAR, } from '../../../../constant'
import { iReport, formValue } from '../../../../models'
import Loading from '../../../../_metronic/partials/content/Loading' 
import PromotionProducts from './PromotionProducts'
import Customers from './Customers'
import ProductSold from './ProductSold'
import ProductOrder from './ProductOrder'
import ProductRefuned from './ProductRefuned'

type Props = {
  dataList: any | []
  isPageLoading: boolean | true
  saleReport: iReport
}

const DashboardPage: FC<Props> = ({ saleReport }: Props) => {
  return (
    <>
      {/* red chart */}
      <div className='col-xs-12 col-md-6'>
        {(!saleReport.loading && (
          <MixedWidget13
            className='card-xl-stretch mb-xl-8'
            chartColor='danger'
            chartHeight='170px'
            strokeColor='#cb1e46'
            loading={saleReport.loading}
            statistics={saleReport.statistics}
          />
        )) || <Loading />}
      </div>
      <div className='col-xs-12 col-md-6'>
        {(!saleReport.loading && (
          <MixedWidget11
            className='card-xxl-stretch-50 mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='220px'
            productSale12M={saleReport.productSale12M}
          />
        )) || <Loading />}
      </div>
      {/* infor card */}
      <div className='col-xs-12 col-md-12'>
        {(!saleReport.loading && (
          <MixedWidget12
            className='card-xl-stretch mb-xl-8'
            chartColor='danger'
            chartHeight='150px'
            strokeColor='#cb1e46'
            weeklySales={saleReport.weeklySales}
            newUsers={saleReport.newUsers}
            itemOrders={saleReport.itemOrders}
            bugReports={saleReport.bugReports}
          />
        )) || <Loading />}
      </div>
    </>
  )
}

const Reports: FC = () => { 
  const data = useSelector<RootState>(({ product }) => product, shallowEqual)
  const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)

  const access_token: any = useSelector<RootState>(({ auth }) => auth.accessToken, shallowEqual)
  const user_id: number = user ? parseInt(user.ID) : 0
  const tabs = ['Promotion Products', 'Customers', 'Item Orders', 'Product Sold', 'Refunded']

  const saleReportInit: iReport = {
    weeklySales: 0,
    newUsers: 0,
    itemOrders: 0,
    bugReports: 0,
    productSale12M: [],
    statistics: [],
    loading: true,
  }

  const initFormValue: formValue = {
    user_id,
    page_size: 20,
    filter_by_month: CURRENT_MONTH,
    filter_by_year: CURRENT_YEAR,
    access_token
  }

  const [tab, setTab] = useState('Promotion Products')
  const [isActiveIndex, setActiveIndex] = useState<number>(0)
  const [isPageLoading, setPageLoading] = useState<boolean>(true)
  const [saleReport, setSaleReport] = useState<iReport>(saleReportInit)

  useEffect(() => {
    const allReport = loadAllReports(user_id)
    allReport.then((results: any) => {
      const weeklySales = results.weeklySales.data ? results.weeklySales.data.total_products : 0
      const newUsers = results.newUsers.data ? results.newUsers.data.total_customers : 0
      const itemOrders = results.itemOrders.data ? results.itemOrders.data.total_orders : 0
      const bugReports = results.bugReports.data ? results.bugReports.data.total_tickets : 0
      const productSale12M = results.productSale12M.data ? results.productSale12M.data : []
      const statistics = results.statistics.data ? results.statistics.data : []

      setSaleReport({
        weeklySales: weeklySales,
        newUsers: newUsers,
        itemOrders: itemOrders,
        bugReports: bugReports,
        productSale12M: productSale12M,
        statistics: statistics,
        loading: false,
      })
    })
  }, []) 
  
  return (
    <div className='card card-reports pb-5'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Sale Reports</span>
        </h3>
      </div>
      <div className='card-body py-0'>
        <div className='card-wrapper'>
          <div className='row'>
            <DashboardPage dataList={data} isPageLoading={isPageLoading} saleReport={saleReport} />
          </div>
        </div>
        <div className='card-wrapper'>
          <div className='row'>
            {/* Tabs */}
            <ul className="nav nav-tabs">
              {tabs.map((tab: string, index: number) => {
                const checkOpen = isActiveIndex === index;
                return <li key={index} onClick={() => { setTab(tab); setActiveIndex(index) }} className="nav-item cursor-pointer"><p className={`dropdown-item ${checkOpen ? 'active' : ''}`}  >{tab}</p></li>
              })}
            </ul>
            {tab === 'Promotion Products' ? <PromotionProducts initFormValue={initFormValue} /> : ''}
            {tab === 'Product Sold' ? <ProductSold initFormValue={initFormValue} /> : ''}
            {tab === 'Customers' ? <Customers initFormValue={initFormValue} /> : ''}
            {tab === 'Item Orders' ? <ProductOrder initFormValue={initFormValue} /> : ''}
            {tab === 'Refunded' ? <ProductRefuned initFormValue={initFormValue} /> : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
