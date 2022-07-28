/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { KTSVG } from '../../../helpers'
import { Link } from 'react-router-dom'
import { formatMoney } from './../../../helpers'

type Props = {
  className: string
  dataList: any | []
  isHome: boolean | false
  isPageLoading?: boolean | true
  FallbackView?: any
  onChange?: (p: any, s: any, terms?: string, filterOption?: string) => void
}

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

const formatToCurrency = (amount: number) => {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return amount > 0 ? formatter.format(amount) : ''
}

const TablesWidget14 = ({
  className,
  dataList,
  isHome,
  isPageLoading,
  FallbackView,
  onChange = () => undefined,
}: Props) => {
  const { productsList, currentPage, totalPages, totalProducts } = dataList

  const listPages = find_page_begin_end(currentPage, totalPages)
  const [newPageSize, setPageSize] = useState<number>(10)
  const [isPaginate, setPaginate] = useState<boolean>(false)
  const [searchTerms, setSearchTerms] = useState<string>('')
  const [filterOption, setFilterOption] = useState<string>('')

  const onChangePageSize = (s: any, key?: string, status?: string) => {
    setPageSize(s)
    onChange(-1, s, key, status)
    setPaginate(true)
  }

  useEffect(() => {
    let timer = setTimeout(() => setPaginate(false), 2000)
    return () => {
      clearTimeout(timer)
    }
  }, [currentPage, dataList])

  const searchEvent = (e: any, key: string, status: string) => {
    e.preventDefault()
    setPaginate(true)
    onChangePageSize(newPageSize, key, status)
  }

  const onEnterKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      searchEvent(event, searchTerms, filterOption)
    }
  }

  return (
    <div className={`card card-products ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Products Listing</span>
          <span className='text-muted mt-1 fw-bold fs-7'>
            {(totalProducts && <>Over {totalProducts} product(s)</>) || ''}
          </span>
        </h3>

        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
        /*  title='Click to add a product' */
        >
          {isPaginate && (
            <span className='me-2 ms-5 indicator-progress' style={{ display: 'block' }}>
              Loading...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
          {!isHome && (
            <>
              <div className='me-4 my-1'>
                <input
                  value={searchTerms}
                  type='text'
                  name='searchTerm'
                  className='form-control px-2 py-2 me-3'
                  id='searchTerm'
                  placeholder='Search'
                  onChange={(e) => {
                    setSearchTerms(e.target.value)
                  }}
                  onKeyDown={(e) => { onEnterKeyDown(e) }}
                />
              </div>
              <div className='me-4 my-1'>
                <select
                  className='form-select form-select-solid form-select-sm me-3'
                  value={filterOption}
                  onChange={(e) => {
                    setFilterOption(e.target.value)
                    searchEvent(e, searchTerms, e.target.value)
                  }}
                >
                  <option value=''>All</option>
                  <option value='draft'>Draft</option>
                  <option value='pending'>Pending</option>
                  <option value='publish'>Approved</option>
                </select>
              </div>
            </>
          )}
          {/* <div className='my-1'>
            <button className='btn btn-primary me-2 py-2' onClick={searchEvent}>
              Apply
            </button>
          </div>*/}
          <Link to='/product/create' className='btn btn-sm btn-light-primary'>
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
            New Product
          </Link>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted'>
                <th className='w-5 text-center'>#ID</th>
                <th className='w-50'>Product Name</th>
                <th className='w-25 text-center'>Type</th>
                <th className='w-25 text-center'>SKU</th>
                <th className='w-5 text-end'>Price</th>
                <th className='w-25 text-end'>Date</th>
                <th className='w-5 text-center'>Status</th>
                <th className='w-5 text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {!!productsList && productsList.length > 0 ? (
                productsList.map((ele: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className='text-center'>{ele.product_id}</td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px me-5'>
                            <img
                              src={
                                ele.thumbnail
                                  ? ele.thumbnail
                                  : 'https://via.placeholder.com/75x75/f0f0f0'
                              }
                              alt=''
                            />
                          </div>
                          <div className='d-flex justify-content-start flex-column'>
                            <a
                              target='blank'
                              href={ele.preview}
                              className='text-dark fw-bolder text-hover-primary fs-6'
                            >
                              {ele.product_name}
                            </a>
                            <span className='text-muted d-block fs-7'>{ele.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className='text-center'>{ele.type}</td>
                      <td className='text-center'>{ele.sku ? ele.sku : '-'}</td>
                      <td className='text-end'>
                        {ele.sale_price > 0 && ele.sale_price < ele.price ? (
                          <>
                            <p className={`  mb-0  ${ele.type === 'Variable' ? 'fs-8' : ''}`} >
                              {ele.type === 'Variable' && 'From'}
                            </p>
                            <span>{ele.sale_price ? formatMoney(ele.sale_price) : '-'}</span>
                            <br />
                            <small
                              style={{ color: '#999', textDecoration: 'line-through' }}
                            >
                              {formatMoney(ele.price)}
                            </small>
                          </>
                        ) : (
                          <>
                            <p className={` mb-0  ${ele.type === 'Variable' ? 'fs-8' : ''}`} >
                              {ele.type === 'Variable' && 'From'}
                            </p>
                            <span>{formatMoney(ele.price)}</span>
                          </>
                        )}
                      </td>
                      <td className='text-end'>{ele.posted_date}</td>
                      <td className='text-center'>
                        {ele.status === 'publish' ? (
                          <span className='badge badge-light-success'>Approved</span>
                        ) : (
                          <span className={`badge badge-light-${ele.status === 'pending' ? 'warning' : 'info'}`}>
                            {ele.status === 'pending' ? 'Pending' : 'Draft'}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          <Link
                            to={{
                              hash: '#' + ele.product_id,
                              pathname: '/product/update/' + ele.product_id /*/product/create*/,
                              state: { productId: ele.product_id },
                            }}
                            className='btn btn-icon btn-bg-light btn-hover-primary btn-sm me-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/art/art005.svg'
                              className='svg-icon-3'
                            />
                          </Link>
                          {/* <Link
                            to={{hash: '#del-' + ele.product_id}}
                            onClick={(id) => {
                              alert(id)
                            }}
                            className='btn btn-icon btn-bg-light btn-hover-primary btn-sm'
                          >
                            <KTSVG
                              path='/media/icons/duotune/general/gen027.svg'
                              className='svg-icon-3'
                            />
                          </Link> */}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td className='text-center' colSpan={8}>
                    {typeof productsList === 'undefined' ? (
                      <div className='card mb-0 mb-xl-8 loading-wrapper'>
                        <div className='card-body py-3 loading-body'>
                          <FallbackView />
                        </div>
                      </div>
                    ) : (
                      <>No products here</>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
          {totalPages > 1 &&
            (!isHome ? (
              <>
                <hr />
                <div className='d-flex justify-content-between align-items-center flex-wrap panigation'>
                  <div className='d-flex align-items-center py-3'>
                    <span className='text-muted me-3'>Showing</span>
                    <select
                      onChange={(e) => {
                        onChangePageSize(e.target.value)
                      }}
                      value={newPageSize}
                      className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                    >
                      <option value='10'>10</option>
                      <option value='20'>20</option>
                      <option value='30'>30</option>
                      <option value='50'>50</option>
                      <option value='100'>100</option>
                    </select>
                    <span className='text-muted ms-3'>item(s)/page</span>
                    <span className='text-muted ms-5'>
                      Displaying {currentPage} of {totalPages} pages
                    </span>
                    {isPaginate && (
                      <span className='ms-5 indicator-progress' style={{ display: 'block' }}>
                        Loading...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </div>
                  <div className='d-flex flex-wrap py-2 mr-3'>
                    {listPages &&
                      listPages.map((item, index) => {
                        return (
                          <a
                            key={index}
                            href={'#' + item.page}
                            onClick={() => {
                              setPaginate(true)
                              onChange(item.page, -1, searchTerms, filterOption)
                            }}
                            className={
                              'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' +
                              item.class
                            }
                          >
                            {item.label}
                          </a>
                        )
                      })}
                  </div>
                </div>
              </>
            ) : (
              <div className='text-center mt-5 mb-5'>
                <Link className='btn btn-md btn-primary' to='/product/listing'>
                  View More Products
                </Link>
              </div>
            ))}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export { TablesWidget14 }
