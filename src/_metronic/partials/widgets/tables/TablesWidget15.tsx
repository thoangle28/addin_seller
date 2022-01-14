/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG} from '../../../helpers'
import {Link} from 'react-router-dom'

type Props = {
  className: string
  dataList: any | []
}

const TablesWidget15: React.FC<Props> = ({className, dataList}) => {
  
  const {productsList} = dataList

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Products Listing</span>
          <span className='text-muted mt-1 fw-bold fs-7'>
            Over {!!productsList ? productsList.length : 0} product(s)
          </span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a product'
        >
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
                <th className='w-75'>Product Name</th>
                <th className='w-5 text-center'>SKU</th>
                <th className='w-5 text-end'>Price</th>
                <th className='w-25 text-end'>Date</th>
                <th className='w-5 text-center'>Status</th>
                <th className='w-5 text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {productsList ? (
                productsList.map((ele: any, index: number) => {
                  //const real_price = (ele.regular_price > 0) ? ele.regular_price : ele.price

                  return (
                    <tr key={index}>
                      <td className='text-center'>{ele.product_id}</td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px me-5'>
                            <img src={ele.thumbnail} alt='' />
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
                      <td className='text-center'>{ele.sku}</td>
                      <td className='text-end'>
                        { (ele.sale_price > 0 && ele.sale_price < ele.price)  ? (
                          <>
                            <span>${ele.sale_price}</span><br />
                            <small className='me-2' style={{color: '#999', textDecoration: 'line-through'}}>
                              ${ele.price}
                            </small>                            
                          </>
                        ) : (
                          <span>${ele.price}</span>
                        )}
                      </td>
                      <td className='text-end'>{ele.posted_date}</td>
                      <td className='text-center'>
                        {ele.status === 'publish' ? (
                          <span className='badge badge-light-success'>Approved</span>
                        ) : (
                          <span className='badge badge-light-warning'>Pending</span>
                        )}
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          <a
                            href={'#edit-' + ele.product_id}
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/art/art005.svg'
                              className='svg-icon-3'
                            />
                          </a>
                          <a
                            href={'#del-' + ele.product_id} onClick={( id ) => { alert(id) }}
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                          >
                            <KTSVG
                              path='/media/icons/duotune/general/gen027.svg'
                              className='svg-icon-3'
                            />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td className='text-center' colSpan={8}>
                    No products here!
                  </td>
                </tr>
              )}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {TablesWidget15}
