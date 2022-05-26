import { FC, useEffect, useState } from 'react'
import { iPayload, iOrderOptions, iOrderListResponse, iOrderList, iApiStatus, iOrderListDetailResponse, iOrderDetailItems, iUpdateData } from '../../../../models';
import { MONTHS, YEARS, CURRENT_DATE, FILTER_STATUS_OPTION, TABLE_STATUS, } from '../../../../constant'
import PopupComponent from '../../../../_metronic/partials/common/Popup';
import { getOrderDetailById, getOrderListPage, updateOrderStatus } from '../redux/ProductsList';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../setup';

const Loading: FC = () => {
    return (
        <div className='card card-xxl-stretch-50 mb-5 mb-xl-8'>
            <div className='card-body d-flex justify-content-center align-items-center'>
                <span className='indicator-progress text-center' style={{ display: 'block', width: '100px' }}>
                    Loading...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
            </div>
        </div>
    )
}

const LatestOrder: FC = () => {
    const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
    const currentUserId: number = user ? parseInt(user.ID) : 0

    const initFormValue: iPayload = {
        user_id: currentUserId,
        current_page: 1,
        page_size: 50,
        filter_by_month: 4,
        filter_by_status: 'wc-processing',
        search_by_order_id: ""
    }
    const initUpdateData: iUpdateData = {
        order_id: '',
        order_status: ''
    }
    // Declares useState
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false)
    const [isShowPopup, setIsShowPopup] = useState<boolean>(false)
    const [formFilterData, setFormFilterData] = useState<iPayload>(initFormValue)
    const [formUpdateData, setFormUpdateData] = useState<iUpdateData>(initUpdateData)
    const [data, setData] = useState<iOrderListResponse>()
    const [dataDetails, setDataDetails] = useState<iOrderListDetailResponse>()
    const [message, setMessage] = useState<string>()

    // Events
    const onChangeHandler = (e: any, current_page: number = 1) => {
        const { name, value } = e.target;
        setFormFilterData({ ...formFilterData, [name]: value, current_page })
    }
    const onTogglePopup = () => {
        setIsShowPopup(prevState => !prevState)
    }
    const onHandleEscapeKey = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
            setIsShowPopup(false)
        }
    }
    const onUpdateDetail = () => {
        updateOrderStatus(formUpdateData).then(res => {
            const { code, data, message } = res.data
            if (code === 200) {
                onTogglePopup();
            } else setMessage(message)
        }).catch(err => console.log(err))
    }
    const onChangeDetailsHandler = (e: any, order_id: string) => {
        const { name, value } = e.target;
        setFormUpdateData({ ...formUpdateData, [name]: value, order_id })
    }
    const afterGetData = () => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3500);
    }
    // API Calling  
    const getDataOrderList = (payload: iPayload) => {
        setIsLoading(true)
        getOrderListPage(payload).then(res => {
            const { code, data, message } = res.data
            if (code === 200) {
                setData(data)
                setIsLoading(false)
            } else setIsLoading(false)
        }).catch(err => console.log(err))
    }
    const getDataById = (id: number | string) => {
        setIsShowPopup(prev => !prev)
        setIsDetailLoading(true);
        getOrderDetailById(id).then(res => {
            const { code, data } = res.data
            if (code === 200) {
                setDataDetails(data)
                setIsDetailLoading(false);
            }
        }).catch()
    }

    useEffect(() => {
        getDataOrderList(formFilterData);
    }, [formFilterData.current_page, formFilterData.page_size])

    useEffect(() => {
        return () => {
            setDataDetails(undefined)
            setMessage('')
            setFormUpdateData({ order_id: '', order_status: '' })
        };
    }, [])
    useEffect(() => {
        document.addEventListener('keydown', onHandleEscapeKey)
        return () => document.removeEventListener('keydown', onHandleEscapeKey)
    }, [])

    // UI Rendering
    const find_page_begin_end = (currentPage: number = 1, maxPage: number = 1) => {
        const step = 5
        let beginBlock = 1
        let begin: number = 1
        let next_end = step * beginBlock

        while (currentPage > next_end) {
            beginBlock++ //next with 5 items
            next_end = step * beginBlock
        }

        begin = next_end - step + 1
        let end: number = next_end
        end = end > maxPage ? maxPage : end

        const listPages = []
        //fist
        listPages.push({ label: '«', page: 1, class: 'btn-light-primary' })
        //previous
        listPages.push({
            label: '‹',
            page: currentPage - 1 <= 0 ? 1 : currentPage - 1,
            class: 'btn-light-primary',
        })
        //list page with 5 items
        for (let index = begin; index <= end; index++) {
            listPages.push({ label: index, page: index, class: currentPage === index ? 'active' : '' })
        }
        //next
        listPages.push({
            label: '›',
            page: currentPage + 1 > maxPage ? maxPage : currentPage + 1,
            class: 'btn-light-primary',
        })
        //last
        listPages.push({ label: '»', page: maxPage, class: 'btn-light-primary' })

        return listPages
    }

    const renderFilterForm = () => {
        return <div className='card-toolbar align-items-end'>
            <div className='me-4 my-1'>
                <label htmlFor='before_custom_date'>Status:</label>
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
                    {YEARS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>
            <button className='btn btn-sm btn-primary' onClick={e => getDataOrderList(formFilterData)} > Filter Product </button>

        </div>
    }
    const getStatus = (status: string) => {
        const item = TABLE_STATUS.find((item: iApiStatus) => item.name.toLocaleLowerCase() === status);
        return item ? <span className={`badge badge-light-${item.btnStatus}`}>{item.name}</span>
            : <span className='badge badge-light-info'>Draft</span>
    }

    const renderTableData = (data?: any) => {
        return data ? data.map((item: iOrderList, index: number) => <tr key={index}>
            <td className='align-middle '>{item.order_id}</td>
            <td className='align-middle '>{item.title_product}</td>
            <td className="text-center">{getStatus(item.status)}</td>
            <td className='align-middle text-end'>{item.price}</td>
            <td className='align-middle text-end'>{item.customer_name}</td>
            <td className='align-middle text-end'>{item.date}</td>
            <td className='align-middle text-center'>
                <p className="badge bg-success mx-4 mb-0 cursor-pointer" onClick={() => getDataById(item.order_id)}> Details </p>
            </td>
        </tr>) : <tr><td colSpan={7} className="text-center">No Item Found</td></tr>
    }

    const renderTable = () => {
        const listPages = find_page_begin_end(data?.current_page, data?.total_pages)
        return <div className='card mb-5 mb-xl-8  bg-white rounded '>
            <div className='card-header border-0'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-3 mt-6'> Orders List </span>
                </h3>
                {renderFilterForm()}
            </div>
            <div className="card-body mt-2">
                {isLoading ? <Loading /> : <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                    <thead>
                        <tr className='fw-bolder text-muted'>
                            <th className='align-middle '>Order Id</th>
                            <th className='align-middle '>Product Title</th>
                            <th className='align-middle text-center'>Order Status</th>
                            <th className='align-middle text-end'>Price</th>
                            <th className='align-middle text-end'>Customer's Name</th>
                            <th className='align-middle text-end'>Date Created</th>
                            <th className='align-middle text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableData(data?.order_list)}
                    </tbody>
                </table>
                }
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
                                value={
                                    data ? data.page_size : initFormValue.page_size
                                }
                            >
                                <option value='10'>10</option>
                                <option value='20'>20</option>
                                <option value='50'>50</option>
                                <option value='30'>30</option>
                                <option value='100'>100</option>
                            </select>
                            <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                            <span className='text-muted fs-8 ms-3'>
                                Displaying {data ? data.current_page : initFormValue.current_page} of {data ? data.total_pages : initFormValue.current_page} pages
                            </span>
                        </div>
                    </div>
                    <div className='col-md-6 d-flex justify-content-end'>
                        <div>
                            {listPages &&
                                listPages.map((item, index) => (
                                    <span
                                        key={index}
                                        onClick={(e: any) => onChangeHandler(e, item.page)}
                                        className={`btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1   ${item.class}`}
                                    >
                                        {item.label}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    const renderPopup = () => {
        return <PopupComponent>
            <div className="card">
                <div className="card-header bg-primary align-items-center justify-content-between">
                    <p className="fs-2 text-white px-3 py-2 mb-0">Order Details</p>
                    <p className='text-white fw-bolder cursor-pointer text-end fs-1 mt-4' onClick={onTogglePopup} >&times;</p>
                </div>
                {isDetailLoading ? <Loading /> : <div className="card-body bg-white ">
                    <div className="d-flex justify-content-between align-items-center">
                        <p className='mb-2'>Name :<span className="fs-7 fw-bolder">{dataDetails?.customer_name}</span></p>
                        <p className='mb-2'>Email: :<span className="fs-7 fw-bolder">{dataDetails?.customer_email}</span></p>
                        <div className='my-1'>
                            <select
                                className='form-select form-select-solid form-select-sm me-3'
                                onChange={(e) => onChangeDetailsHandler(e, dataDetails?.order_id || '')}
                                name="order_status"
                                value={!formUpdateData.order_status ? dataDetails?.order_status : formUpdateData.order_status}
                            >
                                {TABLE_STATUS.map((item: iApiStatus, index: number) => <option key={index} value={item.key}>{item.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <table className='table table-responsive table-striped'>
                        <thead>
                            <tr className='fw-bolder text-muted'>
                                <th className='align-middle text-center'>Product ID</th>
                                <th className='align-middle '>Product Name</th>
                                <th className='align-middle text-center'>Quantity</th>
                                <th className='align-middle text-center'>SKU</th>
                                <th className='align-middle text-center'>Variation ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataDetails ? dataDetails.items.map((item: iOrderDetailItems, index: number) => <tr key={index}>
                                <td className='align-middle text-center'>{item.product_id}</td>
                                <td >
                                    <div className="d-flex align-items-center">
                                        <div className="symbol me-5">
                                            <img src={item.product_img} alt={item.name} />
                                        </div>
                                        <div className="d-flex justify-content-start flex-column">
                                            <a className='fs-6 ' href={item.product_url}>{item.name}</a>
                                        </div>
                                    </div>
                                </td>
                                <td className='align-middle text-center'>{item.quantity}</td>
                                <td className='align-middle text-center'>{item.sku ? item.sku : '-'}</td>
                                <td className='align-middle text-center'>{item.variation_id}</td>
                            </tr>
                            ) : <tr><td colSpan={5} className='text-center'>No Item Found</td></tr>}
                        </tbody>
                    </table>
                </div>}
                <div className="card-footer p-1 bg-white">
                    <div className="text-center">
                        <button className='btn btn-danger m-4 px-8 py-3 fs-7' onClick={onTogglePopup} >Cancel</button>
                        <button className='btn btn-success m-4 px-8 py-3 fs-7' onClick={onUpdateDetail}>Update</button>
                    </div>
                </div>
            </div>
        </PopupComponent >

    }

    return <>
        {!isShowPopup ? '' : renderPopup()}
        {renderTable()}
    </>

}

export default LatestOrder