/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from 'react-router-dom'
import { KTSVG } from '../../../helpers'

type Props = {
  className: string
  chartColor: string
  strokeColor: string
  chartHeight: string
  weeklySales?: number
  newUsers?: number
  itemOrders?: number
  bugReports?: number,
  statistics?: any,
  loading?: boolean | false
}
const MixedWidget12: React.FC<Props> = ({
  className,
  weeklySales,
  newUsers,
  itemOrders,
  bugReports,
}) => {

  return (
    <div className={`card ${className}`}>
      <div className="row">
        <div className='col-md-3'>
          <div className='d-flex align-items-end justify-content-between bg-light-warning px-4 py-8 rounded-2'>
            <div >
              <KTSVG
                path='/media/icons/duotune/general/gen032.svg'
                className='svg-icon-3x svg-icon-warning d-block my-2'
              />
              <span className='text-warning fw-bold fs-4'>
                Product Sales
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                className='ps-3 text-warning fs-1 fw-bolder text-800 mt-1'>
                {weeklySales}
              </span>
              <br />
              <small className='fs-8 text-warning'>products</small>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='d-flex align-items-end justify-content-between  bg-light-primary px-4 py-8 rounded-2'>
            <div >
              <KTSVG
                path='/media/icons/duotune/arrows/arr075.svg'
                className='svg-icon-3x svg-icon-primary d-block my-2'
              />
              <span className='text-primary fw-bold fs-4'>
                Customers
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                className='ps-3 text-primary fs-1 fw-bolder text-800 mt-1'>
                {newUsers}
              </span>
              <br />
              <small className='fs-8 text-primary'>in month</small>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='d-flex align-items-end justify-content-between  bg-light-danger px-4 py-8 rounded-2'>
            <div >
              <KTSVG
                path='/media/icons/duotune/abstract/abs027.svg'
                className='svg-icon-3x svg-icon-danger d-block my-2'
              />
              <span className='text-danger fw-bold fs-4 mt-2'>
                Item Orders
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className='ps-3 text-danger fs-1 fw-bolder text-800 mt-1'>{itemOrders}{/* <sub><small className='fs-8'>/m</small></sub> */}</span>
              <br />
              <small className='fs-8 text-danger'>in month</small>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='d-flex align-items-end justify-content-between  bg-light-success px-4 py-8  rounded-2'>
            <div >
              <KTSVG
                path='/media/icons/duotune/communication/com010.svg'
                className='svg-icon-3x svg-icon-success d-block my-2'
              />
              <Link to="/support/ticket/listing" className='text-success fw-bold fs-4 mt-2'>
                Tickets Report
              </Link>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className='ps-3 text-success fs-1 fw-bolder text-800 mt-1'>{bugReports}{/* <sub><small className='fs-8'>/m</small></sub> */}</span>
              <br />
              <small className='fs-8 text-success'>in month</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export { MixedWidget12 }
