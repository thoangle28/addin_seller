/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import {
  MixedWidget2,
  MixedWidget10,
  MixedWidget11,
  TablesWidget14,
} from '../../../_metronic/partials/widgets'

import { FallbackView } from '../../modules/products/components/formOptions'
import * as product from '../../modules/products/redux/ProductRedux'
import { RootState } from '../../../setup'
import { loadAllReports } from '../../modules/sale/saleReport'
interface iReport {
  weeklySales: any | 0
  newUsers: any | 0
  itemOrders: any | 0
  bugReports: any | 0
  productSale12M: any | [],
  statistics: any | [],
  loading: boolean | false
}

type Props = {
  dataList: any | []
  isPageLoading: boolean | true
  saleReport: iReport
}

const DashboardPage: FC<Props> = ({ dataList = [], isPageLoading, saleReport }: Props) => (
  <>
    {/* begin::Row Sale Report */}
    <div className='row gy-5 g-xl-8'>
      {console.log(saleReport)}
      <div className='col-xxl-6'>
        {!saleReport.loading && (
          <MixedWidget2
            className='card-xl-stretch mb-xl-8'
            chartColor='danger'
            chartHeight='200px'
            strokeColor='#cb1e46'
            weeklySales={saleReport.weeklySales}
            newUsers={saleReport.newUsers}
            itemOrders={saleReport.itemOrders}
            bugReports={saleReport.bugReports}
            loading={saleReport.loading}
            statistics={saleReport.statistics}
          />
        ) || (
            <div className='card card-xxl-stretch-50 mb-5 mb-xl-8'>
              <div className="card-body d-flex justify-content-center align-items-center">
                <span className='indicator-progress text-center' style={{ display: 'block', width: '100px' }}>
                  Loading...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              </div>
            </div>
          )}
      </div>
      <div className='col-xxl-6'>
        <MixedWidget10
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='primary'
          chartHeight='150px'
          reports={saleReport.statistics}
        />
        {!saleReport.loading && (
          <MixedWidget11
            className='card-xxl-stretch-50 mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='175px'
            productSale12M={saleReport.productSale12M}
          />
        ) || (
            <div className="card card-xxl-stretch-50 mb-5 mb-xl-8" style={{ minHeight: '520px' }}>
              <div className="card-body d-flex justify-content-center align-items-center">
                <span className='indicator-progress text-center' style={{ display: 'block', width: '100px' }}>
                  Loading...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
    {/* end::Row */}

    <div className='row g-5 gx-xxl-8'>
      <div className='col-xxl-12'>
        <TablesWidget14
          className='card-xxl-stretch mb-5 mb-xxl-8'
          FallbackView={FallbackView}
          dataList={dataList}
          isHome={true}
          isPageLoading={isPageLoading} />
      </div>
    </div>
  </>
)

let initLoad = {
  currentPage: 1,
  pageSize: 10,
  userId: 0,
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
  const currentUserId = user ? user.ID : 0

  const [isPageLoading, setPageLoading] = useState(true);
  const saleReportInit: iReport = {
    weeklySales: 0,
    newUsers: 0,
    itemOrders: 0,
    bugReports: 0,
    productSale12M: [],
    statistics: [],
    loading: true
  }

  const [saleReport, setSaleReport] = useState<iReport>(saleReportInit)

  useEffect(() => {
    initLoad.userId = currentUserId
    const getProductList = () => {
      return new Promise((resolve, reject) => {
        dispatch(product.actions.getProductList(initLoad));
        resolve(true)
      });
    }

    getProductList().then((data: any) => {
      setPageLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allReport = loadAllReports(currentUserId)

  useEffect(() => {
    allReport.then((results: any) => {
      console.log(results)
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
        loading: false
      })
    })
  }, [])

  const data = useSelector<RootState>(({ product }) => product, shallowEqual)

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage dataList={data} isPageLoading={isPageLoading} saleReport={saleReport} />
    </>
  )
}

export { DashboardWrapper }
//export default connector(DashboardWrapper)
