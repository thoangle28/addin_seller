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

type Props = {
  dataList: any | []
  isPageLoading: boolean | true
}

const DashboardPage: FC<Props> = ({ dataList = [], isPageLoading }: Props) => (
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
          weeklySales={Math.round(Math.random()*100)}
          newUsers={Math.round(Math.random()*100)}
          itemOrders={Math.round(Math.random()*100)}
          bugReports={Math.round(Math.random()*100)}
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

  const data = useSelector<RootState>(({ product }) => product, shallowEqual)

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage dataList={data} isPageLoading={isPageLoading} />
    </>
  )
}

export { DashboardWrapper }
//export default connector(DashboardWrapper)
