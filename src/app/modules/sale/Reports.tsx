import React, { useEffect, useState } from 'react'

const Reports = () => {
  return (
    <div className="card card-reports pb-5">
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Sale Reports</span>         
        </h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        <div className='header'>
          <h5>Generate Reports</h5>
        </div>
        <div className='card-wrapper'>
          <div className="row">
            <div className='col-xs-12 col-md-4'>1</div>
            <div className='col-xs-12 col-md-4'>2</div>
            <div className='col-xs-12 col-md-4'>3</div>
          </div>
        </div>
        <hr />
        <div className='tabs'>          
          <div className='header'>
            <h5>Detail Reports</h5>
          </div>
          <div className='card-wrapper'>
            tabs - 5tabs
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports