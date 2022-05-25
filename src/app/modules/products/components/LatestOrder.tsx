import { FC, useEffect, useState } from 'react'
import { initialFormValue, iOrderOptions } from '../../../../models';
import { AddinLoading } from '../../../../_metronic/partials';
import { CURRENT_MONTH, CURRENT_YEAR, MONTHS, YEARS, CURRENT_DATE, LASTEST_ORDER_STATUS, FILTER_STATUS_OPTION } from '../../../../constant'
import PopupComponent from '../../../../_metronic/partials/common/Popup';

const initFormValue: initialFormValue = {
    user_id: 1,
    current_page: 1,
    page_size: 10,
    last_seven_date: true,
    this_month: true,
    filter_by_month: CURRENT_MONTH,
    filter_by_year: CURRENT_YEAR,
    filter_by_status: '',
    search_by_order_id: '',
    before_custom_date: '',
    after_custom_date: ''
}


const LatestOrder: FC = () => {
    // Declares useState
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isShowPopup, setIsShowPopup] = useState<boolean>(false)
    const [formFilterData, setFormFilterData] = useState<initialFormValue>(initFormValue)

    const onChangeHandler = (e: any) => {
        const { name, value } = e.target;
        setFormFilterData({ ...formFilterData, [name]: value })
    }
    const onTogglePopup = () => {
        setIsShowPopup(prevState => !prevState)
    }
    const onHandleEscapeKey = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
            setIsShowPopup(false)
        }
    }
    useEffect(() => {
        document.addEventListener('keydown', onHandleEscapeKey)
        return () => document.removeEventListener('keydown', onHandleEscapeKey)
    }, [])
    // UI Rendering
    const renderFilterForm = () => {
        return <div className='card-toolbar align-items-end'>
            <div className='me-4 my-1'>
                <input
                    type='text'
                    name='searchTerm'
                    className='form-control px-2 py-2 me-3'
                    placeholder='Search'
                    onChange={(e) => onChangeHandler(e)}
                />
            </div>
            <div className='me-4 my-1'>
                <select
                    className='form-select form-select-solid form-select-sm me-3'
                    onChange={(e) => onChangeHandler(e)}
                    name="status"
                >
                    {FILTER_STATUS_OPTION.map((item: iOrderOptions, index: number) => <option key={index} value={item.value}>{item.name}</option>)}
                </select>
            </div>
            <div className='me-4 my-1'>
                <label htmlFor='before_custom_date'>Start Date:</label>
                <input className='form-control px-2 py-2 me-3' defaultValue={CURRENT_DATE} id="before_custom_date" placeholder='Date Time' onChange={e => onChangeHandler(e)} type="date" name="before_custom_date" />
            </div>
            <div className='me-4 my-1'>
                <label htmlFor='after_custom_date'>End Date:</label>
                <input className='form-control px-2 py-2 me-3' defaultValue={CURRENT_DATE} id="after_custom_date" placeholder='Date Time' onChange={e => onChangeHandler(e)} type="date" name="before_custom_date" />
            </div>
            <div className="me-4 my-1">
                <select
                    className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
                    name='filter_by_month'
                    onChange={(e) => { onChangeHandler(e) }}
                // value={formValue.filter_by_month}
                >
                    <option value=''>Month</option>
                    {MONTHS.map((item, index) => <option key={index} value={index + 1}> {item}</option>)}
                </select>
            </div>
            <div className="me-4 my-1">
                <select
                    className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
                    name='filter_by_year'
                    onChange={(e) => onChangeHandler(e)}
                // value={formValue.filter_by_year}
                >
                    <option value=''>Year</option>
                    {YEARS.map((item) => <option key={item} value={item}></option>)}
                </select>
            </div>
            <button className='btn btn-sm btn-light-primary' onClick={onTogglePopup}> Filter Product </button>

        </div>
    }
    const renderTableData = (data?: any) => {
        return data && data.map((item: any) => <tr className='fw-bolder text-muted'>
            <th className='text-center'>#ID</th>
            <th className='w-50'>Product Name</th>
            <th className='w-25 text-center'>Type</th>
            <th className='w-25 text-center'>SKU</th>
            <th className='text-end'>Price</th>
            <th className='w-25 text-end'>Date</th>
            <th className='text-center'>Status</th>
            <th className='text-end'>Actions</th>
        </tr>)
    }

    const renderTable = () => {
        return <div className='card mb-5 mb-xl-8  bg-white rounded '>
            <div className='card-header border-0'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-3 mb-1'> Orders List </span>
                </h3>
                {renderFilterForm()}
            </div>
            <div className="card-body mt-2">
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                    <thead>
                        <tr className='fw-bolder text-muted'>
                            <th className='text-center'>#ID</th>
                            <th className='w-50'>Product Name</th>
                            <th className='w-25 text-center'>Type</th>
                            <th className='w-25 text-center'>SKU</th>
                            <th className='text-end'>Price</th>
                            <th className='w-25 text-end'>Date</th>
                            <th className='text-center'>Status</th>
                            <th className='text-end'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableData()}
                    </tbody>
                </table>
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
                            // value={
                            //   productSoldList.page_size ? productSoldList.page_size : initFormValue.page_size
                            // }
                            >
                                <option value='10'>10</option>
                                <option value='20'>20</option>
                                <option value='50'>50</option>
                                <option value='30'>30</option>
                                <option value='100'>100</option>
                            </select>
                            <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                            <span className='text-muted fs-8 ms-3'>
                                {/* Displaying {productSoldList.current_page} of {productSoldList.total_pages} pages */}
                            </span>
                        </div>
                    </div>
                    <div className='col-md-6 d-flex justify-content-end'>
                        <div>
                            {/* {listPages &&
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
                ))} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    const renderLoading = () => {
        return <div className='row mt-0 g-xl-8 loading-wrapper'>
            <div className='card-body py-3 loading-body'>
                <AddinLoading />
            </div>
        </div>
    }
    const renderPopup = () => {
        return <PopupComponent>
            <div className="card">
                <div className="card-header bg-primary align-items-center">
                    <p className="fs-2 text-white px-3 py-2 mb-0">Order Details</p>
                </div>
                <div className="card-body bg-white ">
                    <table className='table table-responsive table-striped'>
                        <thead>
                            <tr className='fw-bolder text-muted'>
                                <th className='text-center'>#ID</th>
                                <th className='w-25'>Product Name</th>
                                <th className='w-25 text-center'>Type</th>
                                <th className='text-center'>SKU</th>
                                <th className='text-end'>Price</th>
                                <th className='text-end'>Date</th>
                                <th className='text-center'>Status</th>
                                <th className='text-end'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableData()}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer p-1 bg-white">
                    <div className="text-center">
                        <button className='btn btn-danger m-4 px-8 py-3 fs-7' onClick={onTogglePopup} >Cancel</button>
                        <button className='btn btn-success m-4 px-8 py-3 fs-7'>Confirm</button>
                    </div>
                </div>
            </div>
        </PopupComponent>

    }

    return <>
        {!isShowPopup ? '' : renderPopup()}
        {!isLoading ? renderTable() : renderLoading()}
    </>

}

export default LatestOrder