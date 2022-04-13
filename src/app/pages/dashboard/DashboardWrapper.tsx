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

import {BugReports, ItemOrders, NewUsers, WeeklySales} from '../../modules/sale/saleReport';

interface iReport {
  weeklySales: number | 0
  newUsers: number | 0
  itemOrders: number | 0
  bugReports: number | 0
}
type Props = {
  dataList: any | []
  isPageLoading: boolean | true
  saleReport: iReport
}

const DashboardPage: FC<Props> = ({ dataList = [], isPageLoading, saleReport }: Props) => (
  //MixedWidget2: className, chartColor, chartHeight, strokeColor, weeklySales, newUsers, itemOrders, bugReports

  <>
    {/* begin::Row Sale Report */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-6'>
        <MixedWidget2
          className='card-xl-stretch mb-xl-8'
          chartColor='danger'
          chartHeight='200px'
          strokeColor='#cb1e46'
          weeklySales={saleReport.weeklySales}
          newUsers={saleReport.newUsers}
          itemOrders={saleReport.itemOrders}
          bugReports={saleReport.bugReports}
        />
      </div>
      <div className='col-xxl-6'>
        <MixedWidget10
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='primary'
          chartHeight='150px'
        />
        <MixedWidget11
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='primary'
          chartHeight='175px'
        />
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
    bugReports: 0
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

  useEffect(() => {    
    loadReport()
  },[])
  
  const loadReport = () => {
    const reportInit: iReport = {...saleReportInit}

    const bugReports = BugReports(currentUserId)
    bugReports.then((result: any) => {
      console.log(result)
      reportInit.bugReports = result.data ? result.data.total_tickets : 0
    })

    const itemOrders = ItemOrders(currentUserId)
    itemOrders.then((result: any) => {
      console.log(result)
      reportInit.itemOrders = result.data ? result.data.total_orders : 0
    })

    const newUsers = NewUsers(currentUserId)
    newUsers.then((result: any) => {
      console.log(result)
      reportInit.newUsers = result.data ? result.data.total_customers : 0
    })

    const weeklySales = WeeklySales(currentUserId)
    weeklySales.then((result: any) => {
      console.log(result)
      reportInit.weeklySales = result.data ? result.data.total_products : 0
    })

    //setSaleReport(reportInit)
  }
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
