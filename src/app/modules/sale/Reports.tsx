import React, { FC, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../setup'
import AlertMessage from '../../../_metronic/partials/common/alert'
import { MixedWidget11, MixedWidget12, MixedWidget13 } from '../../../_metronic/partials/widgets'
import { loadAllReports, getProductSaleList, getCustomerList, getProductOrderList } from './saleReport'
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
interface formValue {
  user_id: number,
  filter_by_month?: number | string,
  filter_by_year?: number | string,
  page_size?: number | string
  current_page?: number | string
}

const Loading: FC = () => {
  return <div className='card card-xxl-stretch-50 mb-5 mb-xl-8'>
    <div className="card-body d-flex justify-content-center align-items-center">
      <span className='indicator-progress text-center' style={{ display: 'block', width: '100px' }}>
        Loading...
        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
      </span>
    </div>
  </div>
}

const DashboardPage: FC<Props> = ({ dataList = [], isPageLoading, saleReport }: Props) => {
  return (
    <>
      {/* red chart */}
      <div className='col-xs-12 col-md-6'>
        {!saleReport.loading && (
          <MixedWidget13
            className='card-xl-stretch mb-xl-8'
            chartColor='danger'
            chartHeight='170px'
            strokeColor='#cb1e46'
            loading={saleReport.loading}
            statistics={saleReport.statistics}
          />
        ) || (<Loading />)}
      </div>
      <div className='col-xs-12 col-md-6'>
        {!saleReport.loading && (
          <MixedWidget11
            className='card-xxl-stretch-50 mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='250px'
            productSale12M={saleReport.productSale12M}
          />
        ) || (<Loading />)}
      </div>
      {/* infor card */}
      <div className='col-xs-12 col-md-12'>
        {!saleReport.loading && (
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
        ) || (<Loading />)}
      </div>
    </>
  )
}

const Reports: FC = () => {
  const data = useSelector<RootState>(({ product }) => product, shallowEqual)
  const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
  const currentUserId: number = user ? parseInt(user.ID) : 0
  const tabs = ['Weekly Sales', 'New Users', 'Item Orders', 'Ticket Reports', 'Product Sold']
  const now = new Date().getUTCFullYear();
  const years = Array(now - (now - 50)).fill('').map((v, idx) => now - idx);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const saleReportInit: iReport = {
    weeklySales: 0,
    newUsers: 0,
    itemOrders: 0,
    bugReports: 0,
    productSale12M: [],
    statistics: [],
    loading: true
  }

  const initFormValue: formValue = {
    user_id: currentUserId,
  }

  const [tab, setTab] = useState('Weekly Sales')
  const [isActiveIndex, setActiveIndex] = useState<number>(0);
  const [isPageLoading, setPageLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saleReport, setSaleReport] = useState<iReport>(saleReportInit)
  const [list, setList] = useState<any>()
  const [customerList, setCustomerList] = useState<any>()
  const [productOrderList, setProductOrderList] = useState<any>()
  const [formValue, setFormValue] = useState<formValue>(initFormValue)
  const [formProductOrderValue, setFormProductOrderValue] = useState<formValue>(initFormValue)
  const [formCustomerValue, setFormCustomerValue] = useState<formValue>(initFormValue)
  const [message, setMessage] = useState<string>('')
  const allReport = loadAllReports(currentUserId)

  const onChangeHandler = (e: any, current_page: number = 1) => {
    e.preventDefault()
    const { name, value } = e.target

    if (tab === 'Weekly Sales' || tab === 'Product Sold')
      setFormValue({ ...formValue, [name]: parseInt(value), current_page })

    if (tab === 'New Users')
      setFormCustomerValue({ ...formCustomerValue, [name]: parseInt(value), current_page })

    if (tab === 'Item Orders' || tab === "Item Orders")
      setFormProductOrderValue({ ...formProductOrderValue, [name]: parseInt(value), current_page })
  }
  // API Calling
  const showProductSaleList = (formValue: any) => {
    getProductSaleList(formValue).then(res => {
      const { code, data } = res.data
      setMessage('Processing')
      setIsLoading(true)
      if (code === 200) {
        setIsLoading(false)
        setList(data)
        setMessage(message)
        setTimeout(() => {
          setMessage('')
        }, 3500);
      }
    }).catch(err => console.log(err))
  }

  const showCustomerList = (formValue: any) => {
    const { user_id, page_size, current_page } = formValue
    getCustomerList(user_id, page_size, current_page).then(res => {
      const { code, data, message } = res.data
      setMessage('Processing')
      setIsLoading(true)
      if (code === 200) {
        setIsLoading(false)
        setCustomerList(data)
        setMessage(message)
        setTimeout(() => {
          setMessage('')
        }, 3500);
      }
    }).catch(err => console.log(err))
  }

  const showProductOrderList = (formValue: any) => {
    getProductOrderList(formValue).then(res => {
      const { code, data } = res.data
      setMessage('Processing')
      setIsLoading(true)
      if (code === 200) {
        setIsLoading(false)
        setProductOrderList(data)
        setMessage(message)
        setTimeout(() => {
          setMessage('')
        }, 3500);
      }
    }).catch(err => console.log(err))
  }

  useEffect(() => {
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
        loading: false
      })
    })
  }, [])

  // Load data each tab when user has clicked 
  useEffect(() => {
    if (tab === 'Weekly Sales' || tab === 'Product Sold')
      showProductSaleList(formValue)
  }, [formValue, tab])

  useEffect(() => {
    if (tab === 'New Users')
      showCustomerList(formCustomerValue)
  }, [formCustomerValue, tab])

  useEffect(() => {
    if (tab === 'Item Orders' || tab === "Item Orders")
      showProductOrderList(formProductOrderValue)
  }, [formProductOrderValue, tab])


  // UI components
  const displayProductSaleList = () => {
    console.log(list)
    return list ? (<div className='col-xs-12'>
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        <thead>
          <tr className="fw-bolder text-muted">
            <th className="w-20 text-center">Product Sale</th>
            <th className="w-30 text-center">Regular Price</th>
            <th className="w-25 text-center">Sale Price</th>
            <th className="w-25 text-center">Date</th>
          </tr>
          {list.product_sale_list?.map((item: any, index: number) => <tr key={index} className="fw-bolder text-muted">
            <th className="w-20 text-center">{item.product_sale}</th>
            <th className="w-30 text-center">{item.regular_price}</th>
            <th className="w-25 text-center">{item.sale_price}</th>
            <th className="w-25 text-center">{item.date}</th>
          </tr>
          )}
          {/* Pagination */}
        </thead>
      </table>
      <nav aria-label="Page navigation example" className='my-5'>
        <ul className="pagination justify-content-center">
          <li className={`page-item  ${list.current_page === 1 ? 'disabled' : ''}`}><span className={`page-link cursor-pointer`} aria-disabled="true">Previous</span></li>
          {getPageNumber(list)?.map((item: number, index: number) => <li key={index} onClick={(e: any) => onChangeHandler(e, item)} className={`page-item cursor-pointer ${list.current_page === item ? 'active' : ''}`}><span className="page-link" aria-disabled="true">{item}</span></li>)}
          <li className={`page-item  ${list.current_page === list.total_pages ? 'disabled' : ''}`}> <span className={`page-link cursor-pointer `}>Next</span></li>
        </ul>
      </nav>
    </div >) : <Loading />;
  }

  const displayProductOrderList = () => {
    return productOrderList ? (<div className='col-xs-12'>
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        <thead>
          <tr className="fw-bolder text-muted">
            <th className="w-20 text-center">Order ID</th>
            <th className="w-30 text-center">Product Title</th>
            <th className="w-25 text-center">Date</th>
            <th className="w-25 text-center">Price</th>
            <th className="w-25 text-center">Status</th>
          </tr>
          {productOrderList.order_list?.map((item: any, index: number) => <tr key={index} className="fw-bolder text-muted">
            <th className="w-20 text-center">{item.order_id}</th>
            <th className="w-30 text-center">{item.title_product}</th>
            <th className="w-25 text-center">{item.date}</th>
            <th className="w-25 text-center">{item.price}</th>
            <th className="w-25 text-center">{item.status}</th>
          </tr>
          )}
          {/* Pagination */}
        </thead>
      </table>
      <nav aria-label="Page navigation example" className='my-5'>
        <ul className="pagination justify-content-center">
          <li className={`page-item  ${productOrderList.current_page === 1 ? 'disabled' : ''}`}><span className={`page-link cursor-pointer`} aria-disabled="true">Previous</span></li>
          {getPageNumber(productOrderList)?.map((item: number, index: number) => <li key={index} onClick={(e: any) => onChangeHandler(e, item)} className={`page-item cursor-pointer ${productOrderList.current_page === item ? 'active' : ''}`}><span className="page-link" aria-disabled="true">{item}</span></li>)}
          <li className={`page-item  ${productOrderList.current_page === productOrderList.total_pages ? 'disabled' : ''}`} > <span className={`page-link cursor-pointer`}>Next</span></li>
        </ul>
      </nav>
    </div >) : <Loading />
  }

  const displayCustomerSaleList = () => {
    return customerList ? (
      <div className='col-xs-12'>
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
          <thead>
            <tr className="fw-bolder text-muted">
              <th className="w-20 text-center">User ID</th>
              <th className="w-30 text-center">Full Name</th>
              <th className="w-25 text-center">City</th>
              <th className="w-25 text-center">Country</th>
              <th className="w-25 text-center">Email</th>
              <th className="w-25 text-center">Phone</th>
            </tr>
            {customerList.customer_list ? customerList.customer_list?.map((item: any, index: number) => <tr key={index} className="fw-bolder text-muted">
              <th className="w-20 text-center">{item.user_id}</th>
              <th className="w-30 text-center">{item.full_name}</th>
              <th className="w-25 text-center">{item.city}</th>
              <th className="w-25 text-center">{item.country}</th>
              <th className="w-25 text-center">{item.email}</th>
              <th className="w-25 text-center">{item.phone}</th>
            </tr>
            ) : <AlertMessage hasErrors={true} message={message} />}
            {/* Pagination */}
          </thead>
        </table>
        <nav aria-label="Page navigation example" className='my-5'>
          <ul className="pagination justify-content-center">
            <li className={`page-item  ${customerList.current_page === 1 ? 'disabled' : ''}`}><span className={`page-link cursor-pointer`} aria-disabled="true">Previous</span></li>
            {getPageNumber(customerList)?.map((item: number, index: number) => <li key={index} onClick={(e: any) => onChangeHandler(e, item)} className={`page-item cursor-pointer ${customerList.current_page === item ? 'active' : ''}`}><span className="page-link" aria-disabled="true">{item}</span></li>)}
            <li className={`page-item  ${customerList.current_page === customerList.total_pages ? 'disabled' : ''}`} > <span className={`page-link cursor-pointer`}>Next</span></li>
          </ul>
        </nav>
      </div>) : <Loading />
  }

  const getPageNumber = (data: any) => {
    if (!data) {
      return;
    }
    const pageNumbers = [];
    for (let i = 1; i <= data?.total_pages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers
  }

  return (<div className="card card-reports pb-5">
    <div className='card-header border-0 pt-5'>
      <h3 className='card-title align-items-start flex-column'>
        <span className='card-label fw-bolder fs-3 mb-1'>Sale Reports</span>
      </h3>
    </div>
    <div className='card-body py-0'>
      <div className='card-wrapper'>
        <div className="row">
          <DashboardPage dataList={data} isPageLoading={isPageLoading} saleReport={saleReport} />
        </div>
      </div>
      <hr />
      <div>
        <div className='card-header border-0 ps-0'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Reports Detail</span>
          </h3>
        </div>
        {isLoading ? (<Loading />) : (
          <div className='card-wrapper'>
            <div className='row'>
              {/* Tabs */}
              <ul className="nav nav-tabs">
                {tabs.map((tab: string, index: number) => {
                  const checkOpen = isActiveIndex === index;
                  return <li key={index} onClick={() => { setTab(tab); setActiveIndex(index) }} className="nav-item cursor-pointer"><p className={`dropdown-item ${checkOpen ? 'active' : ''}`}  >{tab}</p></li>
                })}
              </ul>
              {/* Filter */}
              <div className="row my-2">
                <div className='col-md-3 me-4 my-1'>
                  <label>Month</label>
                  <select
                    className='form-select form-select-solid form-select-sm me-3'
                    name="filter_by_month"
                    onChange={(e) => { onChangeHandler(e); }}
                  >
                    <option value="">None</option>
                    {months.map((item, index) => <option key={index} value={index + 1}>{item}</option>)}
                  </select>
                </div>
                <div className='col-md-3 me-4 my-1'>
                  <label>Year</label>
                  <select
                    className='form-select form-select-solid form-select-sm me-3'
                    name="filter_by_year"
                    onChange={(e) => { onChangeHandler(e); }}
                  >
                    <option value="">None</option>
                    {years.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="col-md-3 me-4 my-1">
                  <label>Items Per Page</label>
                  <select
                    className='form-select form-select-solid form-select-sm me-3'
                    name="page_size"
                    onChange={(e) => { onChangeHandler(e); }}
                    value={10}
                  >
                    <option value="1">1</option>
                    <option value="2">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select>
                </div>
              </div>
              <div>
                {tab === 'Weekly Sales' && displayProductSaleList()}
                {tab === 'Product Sold' && displayProductSaleList()}
                {tab === 'New Users' && displayCustomerSaleList()}
                {tab === 'Item Orders' && displayProductOrderList()}
                {tab === 'Ticket Reports' && displayProductOrderList()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div >
  )
}

export default Reports