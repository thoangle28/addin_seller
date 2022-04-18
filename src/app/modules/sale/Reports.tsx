import React, { useEffect, useState } from 'react'

const Reports = () => {
  return (
    <div className={`card card-reports`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Sale Reports</span>         
        </h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        <div>
          <h5>Generate Reports</h5>
        </div>
        <hr />
        <div>
          <h5>Detail Reports</h5>
        </div>
      </div>
    </div>
  )
}

export default Reports