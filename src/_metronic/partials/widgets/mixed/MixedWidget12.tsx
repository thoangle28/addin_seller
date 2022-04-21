/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { KTSVG } from '../../../helpers'
import { getCSSVariableValue } from '../../../assets/ts/_utils'

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
      {/* begin::Body */}
      <div className='card-body p-0'>
        {/* begin::Stats */}
        <div className='card position-relative'>
          {/* begin::Row */}
          <div className="row">
            <div className='col-sm-6 g-0'>
              {/* begin::Col */}
              <div className='col bg-light-warning px-4 py-8 rounded-2 me-3 mb-4'>
                <div className='d-flex align-items-end justify-content-between'>
                  <div >
                    <KTSVG
                      path='/media/icons/duotune/general/gen032.svg'
                      className='svg-icon-3x svg-icon-warning d-block my-2'
                    />
                    <a href='#' className='text-warning fw-bold fs-4'>
                      Weekly Sales
                    </a>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className='ps-3 text-warning fs-1 fw-bolder text-800 mt-1'>
                      {weeklySales}
                    </span>
                    <br />
                    <small className='fs-7 text-warning'>products</small>
                  </div>
                </div>
              </div>
              {/* end::Col */}
              {/* begin::Col */}
              <div className='col bg-light-primary px-4 py-8 rounded-2 me-3 mb-4'>
                <div className='d-flex align-items-end justify-content-between'>
                  <div >
                    <KTSVG
                      path='/media/icons/duotune/arrows/arr075.svg'
                      className='svg-icon-3x svg-icon-primary d-block my-2'
                    />
                    <a href='#' className='text-primary fw-bold fs-4'>
                      New Users
                    </a>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className='ps-3 text-primary fs-1 fw-bolder text-800 mt-1'>
                      {newUsers}
                    </span>
                    <br />
                    <small className='fs-7 text-primary'>in month</small>
                  </div>
                </div>
              </div>
              {/* end::Col */}
            </div>
            {/* end::Row */}
            {/* begin::Row */}
            <div className='col-sm-6 g-0'>
              {/* begin::Col */}
              <div className='col bg-light-danger px-4 py-8 rounded-2 me-3 mb-4'>
                <div className='d-flex align-items-end justify-content-between'>
                  <div >
                    <KTSVG
                      path='/media/icons/duotune/abstract/abs027.svg'
                      className='svg-icon-3x svg-icon-danger d-block my-2'
                    />
                    <a href='#' className='text-danger fw-bold fs-4 mt-2'>
                      Item Orders
                    </a>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className='ps-3 text-danger fs-1 fw-bolder text-800 mt-1'>{itemOrders}{/* <sub><small className='fs-8'>/m</small></sub> */}</span>
                    <br />
                    <small className='fs-7 text-danger'>in month</small>
                  </div>
                </div>
              </div>
              {/* end::Col */}
              {/* begin::Col */}
              <div className='col bg-light-success px-4 py-8 me-3 rounded-2 mb-4'>
                <div className='d-flex align-items-end justify-content-between'>
                  <div >
                    <KTSVG
                      path='/media/icons/duotune/communication/com010.svg'
                      className='svg-icon-3x svg-icon-success d-block my-2'
                    />
                    <a href='#' className='text-success fw-bold fs-4 mt-2'>
                      Tickets Report
                    </a>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className='ps-3 text-success fs-1 fw-bolder text-800 mt-1'>{bugReports}{/* <sub><small className='fs-8'>/m</small></sub> */}</span>
                    <br />
                    <small className='fs-7 text-success'>in month</small>
                  </div>
                </div>
              </div>
              {/* end::Col */}
            </div>
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

export { MixedWidget12 }
