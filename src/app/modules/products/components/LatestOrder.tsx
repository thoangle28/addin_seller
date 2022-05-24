import { FC, useEffect, useState } from 'react'
import { AddinLoading } from '../../../../_metronic/partials';

import { KTSVG } from './../../../../_metronic/helpers'
const initialFormValue = {
    options: '', searchTerm: ''
}
const LatestOrder = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isShowPopup, setIsShowPopup] = useState<boolean>(true)
    const [formData, setFormData] = useState(initialFormValue)

    const onChangeHandler = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }
    // UI Rendering
    const renderFilterForm = () => {
        return <div className='card-toolbar'>
            <div className='me-4 my-1'>
                <input
                    type='text'
                    name='searchTerm'
                    className='form-control px-2 py-2 me-3'
                    id='searchTerm'
                    placeholder='Search'
                    onChange={(e) => onChangeHandler(e)}
                />
            </div>
            <div className='me-4 my-1'>
                <select
                    className='form-select form-select-solid form-select-sm me-3'
                    onChange={(e) => onChangeHandler(e)}
                    name="options"
                >
                    <option value=''>All</option>
                    <option value='draft'>Draft</option>
                    <option value='pending'>Pending</option>
                    <option value='publish'>Publish</option>
                </select>
            </div>
            <button className='btn btn-sm btn-light-primary'>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                New Product
            </button>
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
                    <span className='card-label fw-bolder fs-3 mb-1'>Laster Order</span>
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

    return <> {!isLoading ? renderLoading() : renderTable()} </>

}

export default LatestOrder