/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { KTSVG } from '../../../helpers'
import { getCSSVariableValue } from '../../../assets/ts/_utils'
import { Dropdown1 } from '../../content/dropdown/Dropdown1'
import { Link } from 'react-router-dom'

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

const MixedWidget2: React.FC<Props> = ({
  className,
  chartColor,
  chartHeight,
  strokeColor,
  weeklySales,
  newUsers,
  itemOrders,
  bugReports,
  statistics,
  loading
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    /* if (!chartRef.current) {
      return
    }
    */
    const chart = new ApexCharts(
      chartRef.current,
      chartOptions(chartHeight, chartColor, strokeColor, statistics)
    )
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className={`card-header border-0 py-5 bg-${chartColor}`}>
        <h3 className='card-title fw-bolder text-white'>Sales Statistics</h3>
        <div className='text-white fs-7 fw-bold w-100'>{statistics && statistics.time}</div>
        <div className='card-toolbar d-none'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-white btn-active-white btn-active-color- border-0 me-n3'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          {/* <Dropdown1 /> */}
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body p-0'>
        {/* begin::Chart */}
        <div
          ref={chartRef}
          className={`pb-20 mixed-widget-2-chart card-rounded-bottom bg-${chartColor}`}
        ></div>
        {/* end::Chart */}
        {/* begin::Stats */}
        <div className='card-p mt-n20 position-relative'>
          {/* begin::Row */}
          <div className='row g-0'>
            {/* begin::Col */}
            <div className='col bg-light-warning px-6 py-8 rounded-2 me-7 mb-7'>
              <div className='d-flex align-items-end'>
                <div style={{ flex: '1 0' }}>
                  <KTSVG
                    path='/media/icons/duotune/general/gen032.svg'
                    className='svg-icon-3x svg-icon-warning d-block my-2'
                  />
                  <span className='text-warning fw-bold fs-6'>
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
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col bg-light-primary px-6 py-8 rounded-2 mb-7'>
              <div className='d-flex align-items-end'>
                <div style={{ flex: '1 0' }}>
                  <KTSVG
                    path='/media/icons/duotune/arrows/arr075.svg'
                    className='svg-icon-3x svg-icon-primary d-block my-2'
                  />
                  <span className='text-primary fw-bold fs-6'>
                    New Users
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
            {/* end::Col */}
          </div>
          {/* end::Row */}
          {/* begin::Row */}
          <div className='row g-0'>
            {/* begin::Col */}
            <div className='col bg-light-danger px-6 py-8 rounded-2 me-7'>
              <div className='d-flex align-items-end'>
                <div style={{ flex: '1 0' }}>
                  <KTSVG
                    path='/media/icons/duotune/abstract/abs027.svg'
                    className='svg-icon-3x svg-icon-danger d-block my-2'
                  />
                  <span className='text-danger fw-bold fs-6 mt-2'>
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
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col bg-light-success px-6 py-8 rounded-2'>
              <div className='d-flex align-items-end'>
                <div style={{ flex: '1 0' }}>
                  <KTSVG
                    path='/media/icons/duotune/communication/com010.svg'
                    className='svg-icon-3x svg-icon-success d-block my-2'
                  />
                  <Link to='/support/ticket/listing' className='text-success fw-bold fs-6 mt-2'>
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
            {/* end::Col */}
          </div>
          {/* end::Row */}
        </div>
        {/* end::Stats */}
      </div>
      {/* end::Body */}
    </div>
  )
}

const chartOptions = (
  chartHeight: string,
  chartColor: string,
  strokeColor: string,
  statistics: any
): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const color = getCSSVariableValue('--bs-' + chartColor)

  const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dataList: Array<number> = []
  const dataListM: Array<string> = []

  const chartData = statistics.list ? statistics.list : []

  !!chartData && chartData.map((item: any) => {
    dataList.push(item.total ? parseFloat(item.total) : 0)
    dataListM.push(monthName[item.month - 1] + ' ' + item.year)
  })

  const maxValue = Math.max(...dataList) > 0 ? Math.max(...dataList) + 200 : 0;

  return {
    series: [
      {
        name: 'Net Profit',
        data: dataList,//[30, 45, 32, 70, 40, 40, 40],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 0,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: dataListM,//['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: maxValue,
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      opposite: true
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          const currenyFormat = (val).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })

          return currenyFormat
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ['transparent'],
    markers: {
      colors: [color],
      strokeColors: [strokeColor],
      strokeWidth: 3,
    },
  }
}

export { MixedWidget2 }
