/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react'
import {shallowEqual, useSelector, useDispatch } from 'react-redux'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  MixedWidget2,
  MixedWidget10,
  MixedWidget11,
  TablesWidget14,
} from '../../../_metronic/partials/widgets'


import * as product from '../../modules/products/redux/ProductRedux'
import {RootState} from '../../../setup'

type Props = {
  dataList: any | []
}

const DashboardPage: FC<Props> = ( {dataList = []}) => (
  <>
    {/* begin::Row */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-6'>
        <MixedWidget2
          className='card-xl-stretch mb-xl-8'
          chartColor='danger'
          chartHeight='200px'
          strokeColor='#cb1e46'
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
        <TablesWidget14 className='card-xxl-stretch mb-5 mb-xxl-8' dataList={dataList} isHome={true} />
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
  const user: any = useSelector<RootState>(({auth}) => auth.user, shallowEqual)
  const currentUserId = user ? user.ID : 0
  useEffect(() => {
    const getProductList = () => {
      initLoad.userId = currentUserId
      dispatch(product.actions.getProductList(initLoad))
    }
    getProductList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const data = useSelector<RootState>(({product}) => product, shallowEqual)

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage dataList={data} />
    </>
  )
}

export {DashboardWrapper}
//export default connector(DashboardWrapper)
