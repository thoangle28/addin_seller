import { FC, useEffect } from 'react'
import {shallowEqual, useSelector, connect, useDispatch, ConnectedProps} from 'react-redux'
import * as product from '../redux/ProductRedux'
import {RootState} from '../../../../setup'
import {TablesWidget14} from '../../../../_metronic/partials/widgets/tables/TablesWidget14'

const mapState = (state: RootState) => ({product: state.product})
const connector = connect(mapState, product.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const ProductList: FC<PropsFromRedux> = (props) => {
  const dispatch = useDispatch()
  const user: any = useSelector<RootState>(({auth}) => auth.user, shallowEqual)
  const currentUserId = user ? user.ID : 0

  const data : any = useSelector<RootState>(({product}) => product, shallowEqual) 

  let initLoad = {
    currentPage: 1,
    pageSize: 10,
    userId: 0,
  }
  
  useEffect(() => {
    initLoad.userId = currentUserId;
    dispatch(product.actions.getProductList(initLoad));
    // eslint-disable-next-line
  }, [])
  
  const onChangeNextPage = (pageNumber:number, newPageSize: number) => {   
    const { pageSize, userId } = data

    initLoad.currentPage = (pageNumber < 0 ) ? 1 : pageNumber; 
    initLoad.pageSize = (newPageSize && pageSize !== newPageSize && newPageSize > 0) ? newPageSize : pageSize;
    initLoad.userId = userId;
    
    dispatch(product.actions.getProductNextPage(initLoad));
  }   

  return (
    <>
     <TablesWidget14  className='mb-5 mb-xl-8' dataList={data} isHome={false} onChange={onChangeNextPage} />
    </>
  )
}

export default connector(ProductList)