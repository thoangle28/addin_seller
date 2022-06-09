import { FC, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../setup'
import { MixedWidget11, MixedWidget12, MixedWidget13 } from '../../../_metronic/partials/widgets'
import { loadAllReports, getProductSaleList, getCustomerList, getProductOrderList, getRefundedList, getProductSoldList } from './saleReport'
import { CURRENT_MONTH, CURRENT_YEAR, MONTHS, YEARS, ITEMS_PER_PAGES, TABLE_CUSTOMER_SALE, TABLE_PRODUCT_ORDER, TABLE_PRODUCT_ORDER_REFUND, TABLE_PRODUCT_SALE, TABLE_PRODUCT_SOLD, TABLE_PRODUCT_STATUS, TABLE_PRODUCT_SALE_STATUS } from '../../../constant'
import {
  iReport,
  formValue,
  iList,
  iCustomerList,
  iProductOrderList,
  iRefunedList,
  iProductSoldList,
  iProduct,
  iProductSold,
  iOrderList,
  iRefuned,
  iCustomer,
} from '../../../models'
import Loading from './../../../_metronic/partials/content/Loading'
import { find_page_begin_end, formatMoney } from './../../../_metronic/helpers'

type Props = {
  dataList: any | []
  isPageLoading: boolean | true
  saleReport: iReport
}

const DashboardPage: FC<Props> = ({ dataList = [], isPageLoading, saleReport }: Props) => {
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
  const currentUserId: number = user ? parseInt(user.ID) : 0
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
    user_id: currentUserId,
    page_size: 20,
    filter_by_month: CURRENT_MONTH,
    filter_by_year: CURRENT_YEAR,
  }

  const [tab, setTab] = useState('Promotion Products')
  const [isActiveIndex, setActiveIndex] = useState<number>(0)
  const [isPageLoading, setPageLoading] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [saleReport, setSaleReport] = useState<iReport>(saleReportInit)
  const [list, setList] = useState<iList>()
  const [customerList, setCustomerList] = useState<iCustomerList>()
  const [productSoldList, setProductSoldList] = useState<iProductSoldList>()
  const [productOrderList, setProductOrderList] = useState<iProductOrderList>()
  const [refundList, setRefundList] = useState<iRefunedList>()
  const [formValue, setFormValue] = useState<formValue>(initFormValue)
  const [formProductOrderValue, setFormProductOrderValue] = useState<formValue>(initFormValue)
  const [formCustomerValue, setFormCustomerValue] = useState<formValue>(initFormValue)
  const [formProductSold, setFormProductSold] = useState<formValue>(initFormValue)
  const [formRefund, setFormRefund] = useState<formValue>(initFormValue)
  const [message, setMessage] = useState<string>('')
  const onChangeHandler = (e: any, current_page: number = 1) => {
    e.preventDefault()
    const { name, value } = e.target
    if (tab === 'Product Sold') setFormProductSold({ ...formProductSold, [name]: parseInt(value), current_page })
    if (tab === 'Promotion Products') setFormValue({ ...formValue, [name]: parseInt(value), current_page })
    if (tab === 'Customers') setFormCustomerValue({ ...formCustomerValue, [name]: parseInt(value), current_page })
    if (tab === 'Item Orders') setFormProductOrderValue({ ...formProductOrderValue, [name]: parseInt(value), current_page })
    if (tab === 'Refunded') setFormRefund({ ...formRefund, [name]: parseInt(value), current_page })
  }
  // API Calling
  const showProductSaleList = (formValue: formValue) => {
    getProductSaleList(formValue)
      .then((res) => {
        const { code, data } = res.data
        setMessage('Processing')
        setIsLoading(true)
        if (code === 200) {
          setIsLoading(false)
          setList(data)
          setMessage(message)
          setTimeout(() => {
            setMessage('')
          }, 3500)
        }
      })
      .catch((err) => console.log(err))
  }

  const showCustomerList = (formCustomerValue: formValue) => {
    getCustomerList(formCustomerValue)
      .then((res) => {
        const { code, data, message } = res.data
        setMessage('Processing')
        setIsLoading(true)
        if (code === 200) {
          setIsLoading(false)
          setCustomerList(data)
          setMessage(message)
          setTimeout(() => {
            setMessage('')
          }, 3500)
        }
      })
      .catch((err) => console.log(err))
  }

  const showProductOrderList = (formProductOrderValue: formValue) => {
    getProductOrderList(formProductOrderValue)
      .then((res) => {
        const { code, data } = res.data
        setMessage('Processing')
        setIsLoading(true)
        if (code === 200) {
          setIsLoading(false)
          setProductOrderList(data)
          setMessage(message)
          setTimeout(() => {
            setMessage('')
          }, 3500)
        }

      })
      .catch((err) => console.log(err))
  }

  const showProductSoldList = (formProductSold: formValue) => {
    getProductSoldList(formProductSold).then(res => {
      const { code, data } = res.data
      setMessage('Processing')
      setIsLoading(true)
      if (code === 200) {
        setIsLoading(false)
        setProductSoldList(data)
        setMessage(message)
        setTimeout(() => {
          setMessage('')
        }, 3500)
      }
    }).catch((err) => console.log(err))
  }

  const showRefundList = (formRefund: formValue) => {
    getRefundedList(formRefund).then(res => {
      const { code, data, message } = res.data
      setMessage('Processing')
      setIsLoading(true)
      if (code === 200) {
        setIsLoading(false)
        setRefundList(data)
        setMessage(message)
        setTimeout(() => {
          setMessage('')
        }, 3500);
      }
    }).catch(err => console.log(err))
  }


  useEffect(() => {
    const allReport = loadAllReports(currentUserId)
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
  // Load data each tab when user has clicked
  useEffect(() => {
    if (tab === 'Promotion Products') showProductSaleList({ ...formValue })
    if (tab === 'Customers') showCustomerList({ ...formCustomerValue })
    if (tab === 'Item Orders') showProductOrderList({ ...formProductOrderValue })
    if (tab === 'Product Sold') showProductSoldList({ ...formProductSold })
    if (tab === 'Refunded') showRefundList({ ...formRefund })
  }, [formValue, formCustomerValue, formProductOrderValue, formProductSold, formRefund, tab])

  // UI components
  const getStatus = (status: string) => {
    const item = TABLE_PRODUCT_STATUS.find((item: any) => item.key.toLocaleLowerCase() === status);
    return item ? <span className={`badge badge-light-${item.btnStatus} text-capitalize`}>{item.key === 'publish' ? 'approved' : item.name}</span>
      : <span className='badge badge-light-info text-capitalize'>Draft</span>
  }

  const getProductListStt = (stt: string) => {
    const item = TABLE_PRODUCT_SALE_STATUS.find((item: any) => item.name.toLocaleLowerCase() === stt);
    return item ? <span className={`badge badge-light-${item.btnStatus} text-capitalize`}>{item.name === 'publish' ? 'approved' : item.name}</span>
      : <span className='badge badge-light-info text-capitalize'>Draft</span>

  }

  const displayProductSoldList = () => {
    const listPages = find_page_begin_end(productSoldList?.current_page, productSoldList?.total_pages)
    return productSoldList ? (
      <div className='col-xs-12'>
        <div className="table-responsive">
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bolder text-muted'>
                {TABLE_PRODUCT_SOLD.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {productSoldList.product_list.length > 0 ? (
                productSoldList.product_list?.map((item: iProductSold, index: number) => (
                  <tr key={index}>
                    <td className='text-start'>{item.order_id}</td>
                    <td style={{ width: '250px' }} className='text-left'>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          <img
                            src={
                              item.product_img
                                ? item.product_img
                                : 'https://via.placeholder.com/75x75/f0f0f0'
                            }
                            alt={item.title_product}
                          />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a style={{ fontSize: "13px !important" }} target="blank" href={item.product_url ? item.product_url : '#'} className='text-dark fw-bolder text-hover-primary fs-6 '>
                            {item.title_product}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className='text-center '>{item.sku ? item.sku : '-'}</td>
                    <td className='text-center '>{item.quantity}</td>
                    <td className='text-end '>{formatMoney(item.price)}</td>
                    <td className='text-end'>{item.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='text-center'>
                    No Item Found
                  </td>
                </tr>
              )}
              {/* Pagination */}
            </tbody>
          </table>
        </div>
        <div className='row justify-content-between align-items-center'>
          <div className='col-md-6'>
            <div className='d-flex align-items-center py-3'>
              <span className='text-muted me-3'>Showing</span>
              <select
                name='page_size'
                onChange={(e) => {
                  onChangeHandler(e)
                }}
                className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                value={
                  productSoldList.page_size ? productSoldList.page_size : initFormValue.page_size
                }
              >
                {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
              </select>
              <span className='text-muted fs-8 ms-3'>item(s)/page</span>
              <span className='text-muted fs-8 ms-3'>
                Displaying {productSoldList.current_page} of {productSoldList.total_pages} pages
              </span>
            </div>
          </div>
          {productSoldList.total_pages <= 1 ? '' : <div className='col-md-6 d-flex justify-content-end'>
            <div>
              {listPages &&
                listPages.map((item, index) => (
                  <span
                    key={index}
                    onClick={(e: any) => {
                      onChangeHandler(e, item.page)
                    }}
                    className={
                      'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class
                    }
                  >
                    {item.label}
                  </span>
                ))}
            </div>
          </div>}
        </div>
      </div>
    ) : (
      <Loading />
    )
  }
  const displayProductSaleList = () => {
    const listPages = find_page_begin_end(list?.current_page, list?.total_pages)
    return list ? (
      <div className='col-xs-12'>
        <div className="table-responsive">
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bolder text-muted'>
                {TABLE_PRODUCT_SALE.map((item, index: number) => <td key={index} className={item.className}>{item.name}</td>)}
              </tr>
            </thead>
            <tbody>
              {list.product_sale_list.length ? (
                list.product_sale_list?.map((item: iProduct, index: number) => (
                  <tr key={index}>
                    <td className='text-left'>{item.product_id}</td>
                    <td style={{ width: '250px' }} className=' text-left '>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          <img
                            src={
                              item.product_img
                                ? item.product_img
                                : 'https://via.placeholder.com/75x75/f0f0f0'
                            }
                            alt={item.product_sale}
                          />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a style={{ fontSize: "13px !important" }} target="blank" href={item.preview ? item.preview : '#'} className='text-dark fw-bolder text-hover-primary fs-6 ' >
                            {item.product_sale}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className='text-center'>{item.type}</td>

                    <td className='text-center'>{item.sku ? item.sku : '-'}</td>
                    <td className='text-end'>
                      <p className={`  mb-0  ${item.type === 'Variable' ? 'fs-8' : ''}`} >
                        {item.type === 'Variable' && 'From'}
                      </p>
                      <p className='mb-1'>{formatMoney(item.sale_price)}</p>
                      <p className='mb-0 text-muted'>
                        <s>{formatMoney(item.regular_price)}</s>
                      </p>
                    </td>
                    <td className='text-center'>{getProductListStt(item.status)}</td>
                    <td className='text-end'>{item.date}</td>
                  </tr>
                ))
              ) : <tr>
                <td colSpan={7} className='text-center'>
                  No Item Found
                </td>
              </tr>
              }
              {/* Pagination */}
            </tbody>
          </table>
        </div>
        <div className='row justify-content-between align-items-center'>
          <div className='col-md-6'>
            <div className='d-flex align-items-center py-3'>
              <span className='text-muted me-3'>Showing</span>
              <select
                name='page_size'
                onChange={(e) => {
                  onChangeHandler(e)
                }}
                className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                value={formValue.page_size ? formValue.page_size : initFormValue.page_size}
              >
                {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
              </select>
              <span className='text-muted fs-8 ms-3'>item(s)/page</span>
              <span className='text-muted fs-8 ms-3'>
                Displaying {list.current_page} of {list.total_pages} pages
              </span>
            </div>
          </div>
          {list.total_pages <= 1 ? '' : <div className='col-md-6 d-flex justify-content-end'>
            <div>
              {listPages &&
                listPages.map((item, index) => (
                  <span
                    key={index}
                    onClick={(e: any) => {
                      onChangeHandler(e, item.page)
                    }}
                    className={
                      'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class
                    }
                  >
                    {item.label}
                  </span>
                ))}
            </div>
          </div>}
        </div>
      </div>
    ) : (
      <Loading />
    )
  }
  const displayProductOrderList = () => {
    const listPages = find_page_begin_end(productOrderList?.current_page, productOrderList?.total_pages)
    return productOrderList ? (<div className='col-xs-12'>
      <div className="table-responsive">
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
          <thead>
            <tr className="fw-bolder text-muted">
              {TABLE_PRODUCT_ORDER.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {productOrderList.order_list.length > 0 ? productOrderList.order_list?.map((item: iOrderList, index: number) => <tr key={index} >
              <td className="text-start">{item.order_id}</td>
              <td className="text-left text-dark">{item.customer_name ? item.customer_name : ''}
              </td>
              <td className='text-center'>{getStatus(item.status)}</td>
              <td className="text-end">{formatMoney(item.price)}</td>
              <td className="text-end">{item.date}</td>
            </tr>
            ) : <tr>
              <td colSpan={5} className="text-center">No Item Found</td>
            </tr>
            }
          </tbody>
          {/* Pagination */}
        </table>
      </div>
      <div className="row justify-content-between align-items-center">
        <div className="col-md-6">
          <div className='d-flex align-items-center py-3'>
            <span className='text-muted me-3'>Showing</span>
            <select
              name="page_size"
              onChange={(e) => { onChangeHandler(e) }}
              className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
              value={formProductOrderValue.page_size ? formProductOrderValue.page_size : initFormValue.page_size}

            >
              {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
            </select>
            <span className='text-muted fs-8 ms-3'>item(s)/page</span>
            <span className='text-muted fs-8 ms-3'>
              Displaying {productOrderList.current_page} of {productOrderList.total_pages} pages
            </span>
          </div>
        </div>
        {productOrderList.total_pages <= 1 ? '' : <div className="col-md-6 d-flex justify-content-end">
          {listPages &&
            listPages.map((item, index) => <span key={index} onClick={(e: any) => { onChangeHandler(e, item.page) }} className={'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class}>
              {item.label}
            </span>
            )}
        </div>}

      </div>
    </div>
    ) : (
      <Loading />
    )
  }
  const displayCustomerSaleList = () => {
    const listPages = find_page_begin_end(customerList?.current_page, customerList?.total_pages)
    return customerList ? (
      <div className='col-xs-12'>
        <div className="table-responsive">
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bolder text-muted'>
                {TABLE_CUSTOMER_SALE.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {customerList.customer_list.length > 0 ? (
                customerList.customer_list?.map((item: iCustomer, index: number) => (
                  <tr key={index}>
                    <td className=' text-start'>{index + 1}</td>
                    <td className=' text-start'>{item.full_name}</td>
                    <td className=' text-start'>{item.email ? item.email : '-'}</td>
                    <td className=' text-center'>{item.phone}</td>
                    <td className=' text-center'>{item.city ? item.city : '-'}</td>
                    <td className=' text-center'>{item.country ? item.country : '-'}</td>
                  </tr>
                ))
              ) : <tr>
                <td colSpan={6} className='text-center'>
                  No Item Found
                </td>
              </tr>
              }
            </tbody>
          </table>
          <div className='row justify-content-between align-items-center'>
            <div className='col-md-5'>
              <div className='d-flex align-items-center py-3'>
                <span className='text-muted me-3'>Showing</span>
                <select
                  name='page_size'
                  className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                  onChange={(e) => {
                    onChangeHandler(e)
                  }}
                  value={
                    formCustomerValue.page_size
                      ? formCustomerValue.page_size
                      : initFormValue.page_size
                  }
                >
                  {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
                </select>
                <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                <span className='text-muted fs-8 ms-2'>
                  Displaying {customerList.current_page} of {customerList.total_pages} pages
                </span>
              </div>
            </div>
            {customerList.total_pages <= 1 ? '' : <div className='col-md-6 d-flex justify-content-end'>
              {listPages &&
                listPages.map((item, index) => (
                  <span
                    key={index}
                    onClick={(e: any) => {
                      onChangeHandler(e, item.page)
                    }}
                    className={
                      'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class
                    }
                  >
                    {item.label}
                  </span>
                ))}
            </div>}

          </div>
        </div>
      </div>
    ) : (
      <Loading />
    )
  }
  const displayProductOrderRefundList = () => {
    const listPages = find_page_begin_end(refundList?.current_page, refundList?.total_pages)
    return refundList ? (<div className='table-responsive'>
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        <thead>
          <tr className="fw-bolder text-muted">
            {TABLE_PRODUCT_ORDER_REFUND.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {refundList.order_refund_list.length > 0 ? refundList?.order_refund_list.map((item: iRefuned, index: number) => <tr key={index} >
            <td className="text-start">{item.order_id}</td>
            <td style={{ width: '250px' }} className="text-left">
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-45px me-5'>
                  <img src={item.product_img ? item.product_img : 'https://via.placeholder.com/75x75/f0f0f0'} alt={item.title_product} />
                </div>
                <div style={{ fontSize: "13px !important" }} className='d-flex justify-content-start flex-column'>
                  <a target="blank" href={item.product_url ? item.product_url : '#'} className='text-dark fw-bolder text-hover-primary fs-6 ' >
                    {item.title_product}
                  </a>
                </div>
              </div>
            </td>
            <td className="text-center">{item.sku ? item.sku : '-'}</td>
            <td className="text-end">{formatMoney(item.price_refund)}</td>
            <td className="text-end">{item.date}</td>
          </tr>
          ) : <tr>
            <td colSpan={5} className="text-center">No Item Found</td>
          </tr>
          }
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
              value={formRefund.page_size ? formRefund.page_size : initFormValue.page_size}

            >
              {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
            </select>
            <span className='text-muted fs-8 ms-3'>item(s)/page</span>
            <span className='text-muted fs-8 ms-3'>
              Displaying {refundList.current_page} of {refundList.total_pages} pages
            </span>
          </div>
        </div>
        {refundList.total_pages <= 1 ? '' : <div className="col-md-6 d-flex justify-content-end">
          <div className="col-md-6 d-flex justify-content-end">
            {listPages &&
              listPages.map((item, index) => <span key={index} onClick={(e: any) => { onChangeHandler(e, item.page) }} className={'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class}>
                {item.label}
              </span>
              )}
          </div>
        </div>}
      </div>
    </div >) : <Loading />
  }
  const filterSection = (tab: string) => {
    if (tab === 'Promotion Products')
      return (
        <div className='row my-2'>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
              className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
              name='filter_by_month'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formValue.filter_by_month}
            >
              <option value=''>None</option>
              {MONTHS.map((item, index) => (
                <option key={index} value={index + 1}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Year</label>
            <select
              className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
              name='filter_by_year'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formValue.filter_by_year}
            >
              <option value=''>None</option>
              {YEARS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      )

    if (tab === 'Customers')
      return (
        <div className='row my-2'>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
              className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
              name='filter_by_month'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formCustomerValue.filter_by_month}
            >
              <option value=''>None</option>
              {MONTHS.map((item, index) => (
                <option key={index} value={index + 1}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Year</label>
            <select
              className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
              name='filter_by_year'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formCustomerValue.filter_by_year}
            >
              <option value=''>None</option>
              {YEARS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      )

    if (tab === 'Item Orders')
      return (
        <div className='row my-2'>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
              className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
              name='filter_by_month'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formProductOrderValue.filter_by_month}
            >
              <option value=''>None</option>
              {MONTHS.map((item, index) => (
                <option key={index} value={index + 1}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Year</label>
            <select
              className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
              name='filter_by_year'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formProductOrderValue.filter_by_year}
            >
              <option value=''>None</option>
              {YEARS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      )

    if (tab === 'Product Sold')
      return (
        <div className='row my-2'>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
              className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
              name='filter_by_month'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formProductSold.filter_by_month}
            >
              <option value=''>None</option>
              {MONTHS.map((item, index) => (
                <option key={index} value={index + 1}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Year</label>
            <select
              className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
              name='filter_by_year'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formProductSold.filter_by_year}
            >
              <option value=''>None</option>
              {YEARS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      )
    if (tab === 'Refunded')
      return (
        <div className='row my-2'>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
              className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
              name='filter_by_month'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formRefund.filter_by_month}
            >
              <option value=''>None</option>
              {MONTHS.map((item, index) => (
                <option key={index} value={index + 1}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Year</label>
            <select
              className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
              name='filter_by_year'
              onChange={(e) => {
                onChangeHandler(e)
              }}
              value={formRefund.filter_by_year}
            >
              <option value=''>None</option>
              {YEARS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      )
  }

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
        {isLoading ? <Loading /> : (
          <div className='card-wrapper'>
            <div className='row'>
              {/* Tabs */}
              <ul className="nav nav-tabs">
                {tabs.map((tab: string, index: number) => {
                  const checkOpen = isActiveIndex === index;
                  return <li key={index} onClick={() => { setTab(tab); setActiveIndex(index) }} className="nav-item cursor-pointer"><p className={`dropdown-item ${checkOpen ? 'active' : ''}`}  >{tab}</p></li>
                })}
              </ul>
              {filterSection(tab)}
              <div>
                {tab === 'Promotion Products' && displayProductSaleList()}
                {tab === 'Product Sold' && displayProductSoldList()}
                {tab === 'Customers' && displayCustomerSaleList()}
                {tab === 'Item Orders' && displayProductOrderList()}
                {tab === 'Refunded' && displayProductOrderRefundList()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
