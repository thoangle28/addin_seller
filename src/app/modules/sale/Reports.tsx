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
            chartHeight='220px'
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
  const tabs = ['Weekly Sales', 'New Users', 'Item Orders', 'Product Sold']
  const now = new Date().getUTCFullYear();
  const years = Array(now - (now - 2)).fill('').map((v, idx) => now - idx);
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
  const [isPaginate, setIsPaginate] = useState<boolean>(false)
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

    if (tab === 'Item Orders')
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

  const find_page_begin_end = (currentPage: number, maxPage: number) => {
    const step = 5
    let beginBlock = 1
    let begin: number = 1
    let next_end = step * beginBlock

    while (currentPage > next_end) {
      beginBlock++ //next with 5 items
      next_end = step * beginBlock
    }

    begin = next_end - step + 1
    let end: number = next_end
    end = end > maxPage ? maxPage : end

    const listPages = []
    //fist
    listPages.push({ label: '«', page: 1, class: 'btn-light-primary' })
    //previous
    listPages.push({
      label: '‹',
      page: currentPage - 1 <= 0 ? 1 : currentPage - 1,
      class: 'btn-light-primary',
    })
    //list page with 5 items
    for (let index = begin; index <= end; index++) {
      listPages.push({ label: index, page: index, class: currentPage === index ? 'active' : '' })
    }
    //next
    listPages.push({
      label: '›',
      page: currentPage + 1 > maxPage ? maxPage : currentPage + 1,
      class: 'btn-light-primary',
    })
    //last
    listPages.push({ label: '»', page: maxPage, class: 'btn-light-primary' })

    return listPages
  }
  // UI components
  const displayProductSaleList = () => {
    const listPages = find_page_begin_end(list?.current_page, list?.total_pages)
    return list ? (<div className='col-xs-12'>
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        <thead>
          <tr className="fw-bolder text-muted">
            <th className="w-15 text-left">#ID</th>
            <th className="w-35 text-left ">Product Name</th>
            <th className="w-25 text-center"> Price</th>
            <th className="w-15 text-center"> SKU</th>
            <th className="w-15 text-center"> Status</th>
            <th className="w-25 text-end">Date Created</th>
          </tr>
        </thead>
        <tbody>
          {list ? list.product_sale_list?.map((item: any, index: number) => <tr key={index} >
            <td className="w-5 text-left">{item.product_id}</td>
            <td className="w-35 text-left">
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-45px me-5'>
                  <img src={item.product_img ? item.product_img : 'https://via.placeholder.com/75x75/f0f0f0'} alt={item.product_sale} />
                </div>
                <div className='d-flex justify-content-start flex-column'>
                  <span className='text-dark fw-bolder text-hover-primary fs-6' >
                    {item.product_sale}
                  </span>
                </div>
              </div>
            </td>
            <td className="w-15 fs-4 text-center"><span>$ {item.regular_price}</span><span className='fs-8 m-0 text-muted'> <s>$ {item.sale_price}</s></span></td>
            <td className="w-25 text-center">{item.sku ? item.sku : '-'}</td>
            <td className="w-15 text-center">{item.status === 'processing' ? <span className='badge badge-light-warning'>Pending</span> : <span className='badge badge-light-success'>Approved</span>}</td>
            <td className="w-25 text-end">{item.date}</td>
          </tr>
          ) : <AlertMessage hasErrors={true} message={message} />}
          {/* Pagination */}
        </tbody>
      </table>
      <div className="row justify-content-between align-items-center">
        <div className="col-md-6">
          <div className='d-flex align-items-center py-3'>
            <span className='text-muted me-3'>Showing</span>
            <select
              name="page_size"
              onChange={(e) => { onChangeHandler(e) }}
              className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
            >
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='50'>50</option>
              <option value='30'>30</option>
              <option value='100'>100</option>
            </select>
            <span className='text-muted ms-3'>item(s)/page</span>
            <span className='text-muted ms-5'>
              Displaying {list.current_page} of {list.total_pages} pages
            </span>
            {isPaginate && (<Loading />)}
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <div>
            {listPages &&
              listPages.map((item, index) => <span key={index} onClick={(e: any) => { onChangeHandler(e, item.page) }} className={'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class}>
                {item.label}
              </span>
              )}
          </div>
        </div>
      </div>
    </div >) : <Loading />;
  }

  const displayProductOrderList = () => {
    const listPages = find_page_begin_end(productOrderList?.current_page, productOrderList?.total_pages)
    return productOrderList ? (<div className='col-xs-12'>
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        <thead>
          <tr className="fw-bolder text-muted">
            <th className=" text-center">#ID</th>
            <th className="w-30 text-center">Product Name</th>
            <th className="w-25 text-center">Date Created</th>
            <th className="w-25 text-center">Price</th>
            <th className="w-25 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {productOrderList.order_list ? productOrderList.order_list?.map((item: any, index: number) => <tr key={index} >
            <td className=" text-center">{item.order_id}</td>
            <td className="w-30 text-center text-dark fw-bolder text-hover-primary fs-6">{item.title_product}</td>
            <td className="w-25 text-center">{item.date}</td>
            <td className="w-25 text-center">$ {item.price}</td>
            <td className="w-25 text-center">{item.status === 'processing' ? <span className='badge badge-light-warning'>Pending</span> : <span className='badge badge-light-success'>Approved</span>}</td>
          </tr>
          ) : <AlertMessage hasErrors={true} message={message} />}
        </tbody>
        {/* Pagination */}
      </table>
      <div className="row justify-content-between align-items-center">
        <div className="col-md-6">
          <div className='d-flex align-items-center py-3'>
            <span className='text-muted me-3'>Showing</span>
            <select
              name="page_size"
              onChange={(e) => { onChangeHandler(e) }}
              className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
            >
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='50'>50</option>
              <option value='30'>30</option>
              <option value='100'>100</option>
            </select>
            <span className='text-muted ms-3'>item(s)/page</span>
            <span className='text-muted ms-5'>
              Displaying {productOrderList.current_page} of {productOrderList.total_pages} pages
            </span>
            {isPaginate && (<Loading />)}
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <div className="col-md-6 d-flex justify-content-end">
            {listPages &&
              listPages.map((item, index) => <span key={index} onClick={(e: any) => { onChangeHandler(e, item.page) }} className={'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class}>
                {item.label}
              </span>
              )}
          </div>
        </div>
      </div>
    </div >) : <Loading />
  }

  const displayCustomerSaleList = () => {
    const listPages = find_page_begin_end(customerList?.current_page, customerList?.total_pages)
    return customerList ? (
      <div className='col-xs-12'>
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
          <thead>
            <tr className="fw-bolder text-muted">
              <th className="w-5 text-start">#ID</th>
              <th className="w-30 text-start">Full Name</th>
              <th className="w-25 text-center">City</th>
              <th className="w-25 text-center">Country</th>
              <th className="w-25 text-center">Email</th>
              <th className="w-25 text-end">Phone</th>
            </tr>
          </thead>
          <tbody>
            {customerList.customer_list ? customerList.customer_list?.map((item: any, index: number) => <tr key={index}>
              <td className="w-5 text-start">{item.user_id}</td>
              <td className="w-30 text-start">{item.full_name}</td>
              <td className="w-25 text-center">{item.city ? item.city : '-'}</td>
              <td className="w-25 text-center">{item.country ? item.country : '-'}</td>
              <td className="w-25 text-center">{item.email ? item.email : '-'}</td>
              <td className="w-25 text-end">{item.phone}</td>
            </tr>
            ) : <AlertMessage hasErrors={true} message={message} />}
          </tbody>
          {/* Pagination */}
        </table>
        <div className="row justify-content-between align-items-center">
          <div className="col-md-5">
            <div className='d-flex align-items-center py-3'>
              <span className='text-muted me-3'>Showing</span>
              <select
                name="page_size"
                className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                onChange={(e) => { onChangeHandler(e) }}
              >
                <option value='10'>10</option>
                <option value='20'>20</option>
                <option value='50'>50</option>
                <option value='30'>30</option>
                <option value='100'>100</option>
              </select>
              <span className='text-muted ms-3'>item(s)/page</span>
              <span className='text-muted ms-5'>
                Displaying {customerList.current_page} of {customerList.total_pages} pages
              </span>
              {isPaginate && (<Loading />)}
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            {listPages &&
              listPages.map((item, index) => <span key={index} onClick={(e: any) => { onChangeHandler(e, item.page) }} className={'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class}>
                {item.label}
              </span>
              )}
          </div>
        </div>
      </div>) : <Loading />
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
                  <label className="form-label">Month</label>
                  <select
                    className='form-select text-primary form-select-solid bg-light-primary form-select-sm me-3'
                    name="filter_by_month"
                    onChange={(e) => { onChangeHandler(e); }}
                  >
                    <option value="">None</option>
                    {months.map((item, index) => <option key={index} value={index + 1}>{item}</option>)}
                  </select>
                </div>
                <div className='col-md-3 me-4 my-1'>
                  <label className="form-label">Year</label>
                  <select
                    className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
                    name="filter_by_year"
                    onChange={(e) => { onChangeHandler(e); }}
                  >
                    <option value="">None</option>
                    {years.map(item => <option key={item} value={item}>{item}</option>)}
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