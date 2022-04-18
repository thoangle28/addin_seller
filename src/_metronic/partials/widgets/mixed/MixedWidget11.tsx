/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../assets/ts/_utils'

type Props = {
  className: string
  chartColor: string
  chartHeight: string,
  productSale12M?: any
}

const MixedWidget11: React.FC<Props> = ({className, chartColor, chartHeight, productSale12M}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartData = productSale12M.list ? productSale12M.list : []

  useEffect(() => {
    /* if (!chartRef.current) {
      return
    } */
    
    const chart = new ApexCharts(chartRef.current, chartOptions(chartColor, chartHeight, chartData))
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData])

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body p-0 d-flex justify-content-between flex-column overflow-hidden'>
        {/* begin::Hidden */}
        <div className='d-flex flex-stack flex-wrap flex-grow-1 px-9 pt-9 pb-3'>
          <div className='me-2'>
            <span className='fw-bolder text-gray-800 d-block fs-3'>Products Sold</span>
            <span className='text-gray-400 fw-bold'>{productSale12M.time}</span>
          </div>

          <div className={`fw-bolder fs-3 text-${chartColor}`}>{/* $15,300 */}</div>
        </div>
        {/* end::Hidden */}

        {/* begin::Chart */}
        <div ref={chartRef} className='mixed-widget-10-chart'></div>
        {/* end::Chart */}
      </div>
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string, chartData: any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const secondaryColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)

  const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May',  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dataList: Array<number> = []
  const dataListM: Array<string> = []
  chartData && chartData.map((item: any) => {
    dataList.push( item.total ? item.total : 0 )
    dataListM.push( monthName[item.month -1] )
  })
  
  return {
    series: [
      {
        name: 'Total',//'Net Profit',
        data: dataList,
      }/* ,
      {
        name: 'Revenue',
        data: [50, 60, 70, 80, 60, 50, 70, 60],
      }, */
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: dataListM,//['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'solid',
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
          return val + ' product(s)'
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}

export {MixedWidget11}
