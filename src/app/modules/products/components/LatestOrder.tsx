import { FC, useEffect, useRef, useState } from 'react'
import { initialFormValue, iStatus } from '../../../../models';
import { AddinLoading } from '../../../../_metronic/partials';
import PopupComponent from '../../../../_metronic/partials/common/Popup';

const initFormValue: initialFormValue = {
    status: '',
    searchTerm: '',
    date: '',
}

const options: iStatus[] = [
    { name: 'All', value: '' },
    { name: 'Draft', value: 'draft' },
    { name: 'Pending', value: 'pending' },
    { name: 'Publish', value: 'publishs' }
]

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
        return <div className='card-toolbar'>
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
                    {options.map((item: iStatus, index: number) => <option key={index} value={item.value}>{item.name}</option>)}
                </select>
            </div>
            <div className='me-4 my-1'>
                <input className='form-control px-2 py-2 me-3' onChange={e => onChangeHandler(e)} type="date" name="date" />
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
                    <span className='card-label fw-bolder fs-3 mb-1'>Latest Order</span>
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
    const renderPopup = () => {
        return <PopupComponent>
            <div className="card">
                <div className="card-header bg-primary align-items-center">
                    <p className="fs-2 text-white px-3 py-2 mb-0">Latest Order Details</p>
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