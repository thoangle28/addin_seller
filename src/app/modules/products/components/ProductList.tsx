import { FC, useEffect, useState } from 'react'
import {shallowEqual, useSelector, connect, useDispatch, ConnectedProps} from 'react-redux'
import * as product from '../redux/ProductRedux'
import {RootState} from '../../../../setup'
import {TablesWidget14} from '../../../../_metronic/partials/widgets/tables/TablesWidget14'
import { FallbackView } from './formOptions'

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
    userId: currentUserId,
  }  

  const [isPageLoading, setPageLoading] = useState(true);
  
  useEffect(() => {
    //initLoad.userId = currentUserId;    
    const getProductsListing = () => {
      return new Promise((resolve, reject) => { 
        dispatch(product.actions.getProductList(initLoad));        
        resolve(true)
      });
    }    

    getProductsListing().then((data: any) => {       
      setPageLoading(!data);
    });
    // eslint-disable-next-line
  }, [product])
  
  const onChangeNextPage = (pageNumber:number, newPageSize: number) => {   
    const { pageSize, userId } = data;

    initLoad.currentPage = (pageNumber < 0 ) ? 1 : pageNumber; 
    initLoad.pageSize = (newPageSize && pageSize !== newPageSize && newPageSize > 0) ? newPageSize : pageSize;
    initLoad.userId = userId;    

    setPageLoading(true);
    const getProductsListing = () => {
      return new Promise((resolve, reject) => { 
        dispatch(product.actions.getProductNextPage(initLoad));
        resolve(true)
      });
    }    

    getProductsListing().then(() => {      
      setPageLoading(false);
    });
  }   

  return (
    <>
     <TablesWidget14  
      className='mb-5 mb-xl-8' 
      FallbackView={FallbackView} 
      dataList={data} 
      isHome={false} 
      onChange={onChangeNextPage} 
      isPageLoading={isPageLoading}
     />
    </>
  )
}

export default connector(ProductList)