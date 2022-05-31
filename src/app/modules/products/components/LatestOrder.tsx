import { FC, useEffect, useRef, useState } from 'react'
import { iPayload, iOrderListResponse, iApiStatus, iOrderListDetailResponse, iUpdateData } from '../../../../models';
import { MONTHS, YEARS, CURRENT_DATE, TABLE_STATUS, ORDER_LIST_TABLE, ITEMS_PER_PAGES, ORDER_LIST_POPUP_TABLE, FILTER_STATUS } from '../../../../constant'
import PopupComponent from '../../../../_metronic/partials/common/Popup';
import { getOrderDetailById, getOrderListPage, updateOrderStatus } from '../redux/ProductsList';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../setup';
import Loading from '../../../../_metronic/partials/content/Loading'
import { find_page_begin_end, formatMoney } from '../../../../_metronic/helpers';
import { useOnClickOutside } from '../../../Hooks';

const LatestOrder: FC = () => {
    const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
    const currentUserId: number = user ? parseInt(user.ID) : 0
    const ref = useRef<HTMLDivElement>(null);

    const initFormValue: iPayload = {
        user_id: currentUserId,
        current_page: 1,
        page_size: 20,
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

    useOnClickOutside(ref, () => setIsShowPopup(false));

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
        setIsDetailLoading(true);
        updateOrderStatus(formUpdateData).then(res => {
            const { code, message } = res.data
            if (code === 200) {
                onTogglePopup();
                setIsDetailLoading(false)
            } else {
                setIsLoading(false)
                setIsDetailLoading(message)
            }
        }).catch(err => console.log(err))
    }
    const onChangeDetailsHandler = (e: any, order_id: string) => {
        const { name, value } = e.target;
        setFormUpdateData({ ...formUpdateData, [name]: value, order_id })
    }

    // API Calling  
    const getDataOrderList = (payload: iPayload) => {
        setIsLoading(true)
        getOrderListPage(payload).then(res => {
            const { code, data, message } = res.data
            if (code === 200) {
                setIsLoading(false)
                setData(data)
                setMessage(message)
            } else {
                setIsLoading(false)
                setMessage(message)
            }
        }).catch(err => console.log(err))
    }
    const getDataById = (id: number | string) => {
        setIsShowPopup(prev => !prev)
        setIsDetailLoading(true);
        getOrderDetailById(id, currentUserId.toString()).then(res => {
            const { code, data } = res.data
            if (code === 200) {
                setDataDetails(data)
                setIsDetailLoading(false);
                setMessage(message)
            } else {
                setIsLoading(false)
                setMessage(message)
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

    // UI Rendering  s
    const renderFilterForm = () => {
        return <div className='card-toolbar align-items-end'>
            <div className='me-4 my-1'>
                <label htmlFor='Status'>Status:</label>
                <select
                    className='form-select form-select-solid form-select-sm me-0'
                    onChange={(e) => onChangeHandler(e)}
                    name="status"
                >
                    {TABLE_STATUS.map((item, index: number) => <option key={index} value={item.key}>{item.name}</option>)}
                </select>
            </div>
            <div className='me-4 my-1'>
                <label htmlFor='before_custom_date'>Start Date:</label>
                <input className='form-control px-2 py-2 me-3' defaultValue={CURRENT_DATE} id="before_custom_date" placeholder='Date Time' onChange={e => onChangeHandler(e)} type="date" name="before_custom_date" />
            </div>
            <div className='me-4 my-1'>
                <label htmlFor='after_custom_date'>End Date:</label>
                <input className='form-control px-2 py-2 me-3' defaultValue={CURRENT_DATE} id="after_custom_date" placeholder='Date Time' onChange={e => onChangeHandler(e)} type="date" name="after_custom_date" />
            </div>
            <div className="me-4 my-1">
                <label className='form-label ms-3 mb-0'>Month</label>
                <select
                    className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
                    name='filter_by_month'
                    onChange={(e) => { onChangeHandler(e) }}
                >
                    <option value=''>None</option>
                    {MONTHS.map((item, index: number) => <option key={index} value={index + 1}> {item}</option>)}
                </select>
            </div>
            <div className="me-4 my-1">
                <label className='form-label ms-3 mb-0'>Year</label>
                <select
                    className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
                    name='filter_by_year'
                    onChange={(e) => onChangeHandler(e)}
                >
                    <option value=''>None</option>
                    {YEARS.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
                </select>
            </div>
            <button className='btn btn-sm btn-primary mb-1' onClick={e => getDataOrderList(formFilterData)} >Search</button>
        </div>
    }
    const getStatus = (status: string) => {
        const item = TABLE_STATUS.find((item: iApiStatus) => item.name.toLocaleLowerCase() === status);
        return item ? <span className={`badge badge-light-${item.btnStatus}`}>{item.name}</span>
            : <span className='badge badge-light-info'>Draft</span>
    }

    const renderTable = () => {
        const listPages = find_page_begin_end(data?.current_page, data?.total_pages)
        return <div className='card mb-5 mb-xl-8  bg-white rounded '>
            <div className='card-header border-0'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-3 mt-6'> Orders Listing </span>
                </h3>
                {renderFilterForm()}
            </div>
            <div className="card-body mt-2">
                {isLoading ? <Loading /> : <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                    <thead>
                        <tr className='fw-bolder text-muted'>{ORDER_LIST_TABLE.map((item, index: number) => <td key={index} className={item.className}>{item.name}</td>)}</tr>
                    </thead>
                    <tbody>
                        {data?.order_list.length ? data.order_list.map((item, index: number) => <tr key={index}>
                            <td className='align-middle'>{item.order_id}</td>
                            <td className='align-middle text-start'>{item.customer_name}</td>
                            <td className="text-center">{getStatus(item.status)}</td>
                            <td className='align-middle text-end'>{formatMoney(item.price)}</td>
                            <td className='align-middle text-end'>{item.date}</td>
                            <td className='align-middle text-center'>
                                <p className="badge bg-success mx-4 mb-0 cursor-pointer" onClick={() => getDataById(item.order_id)}> Details </p>
                            </td>
                        </tr>) : <tr><td colSpan={7} className="text-center">{message}</td></tr>}
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
                                {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
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
                                listPages.map((item, index: number) => (
                                    <span
                                        key={index}
                                        onClick={(e: any) => onChangeHandler(e, item.page)}
                                        className={`btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ${item.class}`}
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
        return <PopupComponent >
            <div ref={ref} className="card" >
                <div className="card-header bg-primary align-items-center justify-content-between">
                    <p className="fs-2 text-white px-3 py-2 mb-0">Order Details</p>
                    <p className='text-white fw-bolder cursor-pointer text-end fs-1 mt-4' onClick={onTogglePopup} >&times;</p>
                </div>
                {isDetailLoading ? <Loading /> : <div className="card-body bg-white ">
                    <p className='mb-2 text-danger'>{message}</p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className='mb-2'><span className="fs-7 fw-bolder">{dataDetails?.customer_name}</span></p>
                        <p className='mb-2'><span className="fs-7 fw-bolder">{dataDetails?.order_date}</span></p>
                        <p className='mb-2'><span className="fs-7 fw-bolder">{dataDetails?.customer_email}</span></p>
                        <div className='my-1'>
                            <select
                                className='form-select form-select-solid form-select-sm me-0'
                                onChange={(e) => onChangeDetailsHandler(e, dataDetails?.order_id || '')}
                                name="order_status"
                                value={!formUpdateData.order_status ? dataDetails?.order_status : formUpdateData.order_status}
                            >
                                {FILTER_STATUS.map((item, index: number) => <option key={index} value={item.status}>{item.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <table className='table table-responsive table-striped'>
                        <thead>
                            <tr className='fw-bolder text-muted'>
                                {ORDER_LIST_POPUP_TABLE.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {dataDetails?.items.length ? dataDetails.items.map((item, index: number) => <tr key={index}>
                                <td className='align-middle text-center'>{item.product_id}</td>
                                <td >
                                    <div className="d-flex align-items-center">
                                        <div className="symbol me-5">
                                            <img src={item.product_img} alt={item.name} />
                                        </div>
                                        <div className="d-flex justify-content-start flex-column">
                                            <a className='fs-6' target={'_blank'} href={item.product_url}>{item.name}</a>
                                        </div>
                                    </div>
                                </td>
                                <td className='align-middle text-center'>{item.quantity}</td>
                                <td className='align-middle text-center'>{item.sku ? item.sku : '-'}</td>
                                <td className='align-middle text-center'>{item.variation_id}</td>
                            </tr>
                            ) : <tr><td colSpan={5} className='text-center'>{message}</td></tr>}
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
        {isShowPopup ? renderPopup() : ''}
        {renderTable()}
    </>

}

export default LatestOrder