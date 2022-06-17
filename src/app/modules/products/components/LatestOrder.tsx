import { FC, useEffect, useRef, useState } from 'react'
import { iPayload, iOrderListResponse, iApiStatus, iOrderListDetailResponse, iUpdateData } from '../../../../models';
import { TABLE_STATUS, ORDER_LIST_TABLE, ITEMS_PER_PAGES, ORDER_LIST_POPUP_TABLE, FILTER_STATUS, CURRENT_DATE } from '../../../../constant'
import PopupComponent from '../../../../_metronic/partials/common/Popup';
import { getOrderDetailById, getOrderListPage, updateOrderStatus } from '../redux/ProductsList';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../setup';
import Loading from '../../../../_metronic/partials/content/Loading'
import { find_page_begin_end, formatMoney } from '../../../../_metronic/helpers';
import { useOnClickOutside } from '../../../Hooks';
import { accessToken } from '../../../../_metronic/helpers';

const LatestOrder: FC = () => {
    const access_token = accessToken;
    const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
    const currentUserId: number = user ? parseInt(user.ID) : 0
    const ref = useRef<HTMLDivElement>(null);

    const initFormValue: iPayload = {
        user_id: currentUserId,
        current_page: 1,
        page_size: 20,
        access_token
    }
    const initUpdateData: iUpdateData = {
        order_id: '',
        order_status: '',
        access_token
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

    useOnClickOutside(ref, () => {
        setIsShowPopup(false);
        setFormUpdateData({ ...formUpdateData, order_id: '', order_status: '' })
    });

    // Events
    const onChangeHandler = (e: any, current_page: number = 1) => {
        const { name, value } = e.target;
        setFormFilterData({ ...formFilterData, [name]: value, current_page })

    }
    const onTogglePopup = () => {
        setFormUpdateData({ ...formUpdateData, order_id: '', order_status: '' })
        setIsShowPopup(prevState => !prevState)
    }
    const onHandleEscapeKey = (e: KeyboardEvent) => {
        if (e.code === 'Escape') setIsShowPopup(false)
    }

    const clearMessage = () => {
        setTimeout(() => {
            setMessage('')
        }, 3000);
    }
    const onUpdateDetail = () => {
        setIsDetailLoading(true);
        updateOrderStatus(formUpdateData).then(res => {
            const { code, message } = res.data
            if (code === 200) {
                getDataOrderList(formFilterData)
                onTogglePopup();
                setIsDetailLoading(false)
            } else {
                setIsDetailLoading(false)
                setMessage(message)
                clearMessage()
            }
        }).catch(err => console.log(err))
    }
    const onChangeDetailsHandler = (e: any, order_id: string) => {
        const { name, value } = e.target;
        setFormUpdateData({ ...formUpdateData, [name]: value, order_id })
    }

    // API Calling  
    const getDataOrderList = (formFilterData: iPayload) => {
        setIsLoading(true)
        getOrderListPage(formFilterData).then(res => {
            const { code, data, message } = res.data
            if (code === 200) {
                setIsLoading(false)
                setData(data)
                setMessage(message)
            } else {
                setIsLoading(false)
                setMessage(message)
                clearMessage()
            }
        }).catch(err => console.log(err))
    }
    const getDataById = (id: number | string) => {
        setIsShowPopup(prev => !prev)
        setIsDetailLoading(true);
        getOrderDetailById(id, currentUserId.toString(), accessToken).then(res => {
            const { code, data } = res.data
            if (code === 200) {
                setDataDetails(data)
                setIsDetailLoading(false);
                setMessage(message)
            } else {
                setIsLoading(false)
                setMessage(message)
                clearMessage()
            }
        }).catch()
    }

    // API Running 
    useEffect(() => {
        getDataOrderList(formFilterData);
    }, [formFilterData.page_size, formFilterData.current_page])

    // UI Clean Up Effects
    useEffect(() => {
        return () => {
            setDataDetails(undefined)
            setMessage('')
        };
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', onHandleEscapeKey)
        return () => {
            document.removeEventListener('keydown', onHandleEscapeKey)
        }
    }, [])

    // UI Renderings 
    const renderFilterForm = () => {
        return <div className='card-toolbar align-items-end' style={{ flex: "0 0 100%" }}>
            <div className="d-flex align-items-end flex-row" style={{ flex: "0 0 100%" }}>
                <div className='me-4 my-1 w-100'>
                    <label htmlFor='Status'>Status:</label>
                    <select
                        className='form-select form-select-solid fs-7 py-3 form-select-sm me-0'
                        onChange={(e) => onChangeHandler(e)}
                        name="filter_by_status"
                    >
                        {TABLE_STATUS.map((item, index: number) => <option key={index} value={item.key}>{item.name}</option>)}
                    </select>
                </div>
                <div className='me-4 my-1 w-100'>
                    <label htmlFor='before_custom_date'>Start Date:</label>
                    <input className='form-control px-2 py-3 me-3 fs-7' id="before_custom_date" placeholder='Date Time' onChange={e => onChangeHandler(e)} type="date" name="before_custom_date" />
                </div>
                <div className='me-4 my-1 w-100'>
                    <label htmlFor='after_custom_date'>End Date:</label>
                    <input className='form-control px-2 py-3 me-3 fs-7' defaultValue={CURRENT_DATE} id="after_custom_date" placeholder='Date Time' onChange={e => onChangeHandler(e)} type="date" name="after_custom_date" />
                </div>
                <div className='me-4 my-1 w-100'>
                    <input
                        className='form-control fs-7 py-3 me-0 p-2'
                        onChange={(e) => onChangeHandler(e)}
                        name="search_by_order_id"
                        placeholder='Search'
                    />
                </div>
                <div className='me-4 my-1 w-100'>
                    <button className='w-100 btn btn-sm btn-primary' onClick={() => getDataOrderList(formFilterData)}>Apply</button>
                </div>
            </div>
        </div>
    }

    const getStatus = (status: string) => {
        const item = TABLE_STATUS.find((item: iApiStatus) => item.key === status);
        return item ? <span className={`badge badge-light-${item.btnStatus}`}>{item.name}</span>
            : <span className='badge badge-secondary'>Draft</span>
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
                                onChange={(e) => onChangeHandler(e)}
                                className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                                value={data ? data.page_size : initFormValue.page_size}
                            >
                                {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
                            </select>
                            <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                            <span className='text-muted fs-8 ms-3'>
                                Displaying {data ? data.current_page : initFormValue.current_page} of {data ? data.total_pages : initFormValue.current_page} pages
                            </span>
                        </div>
                    </div>
                    {data && data?.total_pages <= 1 ? '' : <div className='col-md-6 d-flex justify-content-end'>
                        <div>
                            {listPages &&
                                listPages.map((item, index) => <span key={index} onClick={(e: any) => { onChangeHandler(e, item.page) }} className={'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class}>
                                    {item.label}
                                </span>
                                )}
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    }
    const renderPopup = () => {
        return <PopupComponent >
            <div ref={ref} className="card" >
                {isDetailLoading ? <Loading /> :
                    <>
                        <div className="card-header bg-primary align-items-center justify-content-between">
                            <p className="fs-2 text-white px-3 py-2 mb-0">Order Details : #{dataDetails?.order_id}</p>
                            <p className='text-white fw-bolder cursor-pointer text-end fs-1 mt-4' onClick={onTogglePopup} >&times;</p>
                        </div>
                        <div style={{ height: '500px' }} className="card-body bg-white overflow-scroll">
                            <p className='fs-7 mb-4 text-danger'>{message}</p>
                            <div className="row align-items-center mb-3">
                                <div className='col-sm-4 col-lg-4 col-md-4 mb-2'>
                                    <p className="fs-7 mb-3 fw-bolder">Customer Name</p>
                                    <span>{dataDetails?.customer_name}</span>
                                </div>
                                <div className='col-sm-4 col-lg-4 col-md-4 mb-2'>
                                    <p className="fs-7 mb-3 fw-bolder">Date Created</p>
                                    <span>{dataDetails?.order_date}</span>
                                </div>
                                <div className='col-sm-4 col-lg-4 col-md-4 d-flex align-items-end'>
                                    <div className='me-2'>
                                        <label className="fs-7 mb-1 fw-bolder" htmlFor="">Status</label>
                                        <select
                                            className='form-select form-select-solid form-select-sm me-0'
                                            onChange={(e) => onChangeDetailsHandler(e, dataDetails?.order_id || '')}
                                            name="order_status"
                                            value={!formUpdateData.order_status ? dataDetails?.order_status : formUpdateData.order_status}

                                        >
                                            {FILTER_STATUS.map((item, index: number) => <option key={index} value={item.status}>{item.name}</option>)}
                                        </select>
                                    </div>
                                    <button className='badge badge-primary border-0 p-4' onClick={() => {
                                        onUpdateDetail()
                                    }}>Apply</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm-4 col-lg-4 col-md-4'>
                                    <p className="fs-7 mb-1 fw-bolder">Order Billing</p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_billing.order_billing_first_name} {dataDetails?.order_billing.order_billing_last_name}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_billing.order_billing_address_1}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_billing.order_billing_address_2}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_billing.order_billing_city}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_billing.order_billing_company}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_billing.order_billing_country}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_billing.order_billing_postcode}</span></p>
                                </div>
                                <div className='col-sm-4 col-lg-4 col-md-4'>
                                    <p className="fs-7 mb-1 fw-bolder">Order shipping</p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_shipping.order_shipping_first_name} {dataDetails?.order_shipping.order_shipping_last_name}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_shipping.order_shipping_address_1}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_shipping.order_shipping_address_2}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_shipping.order_shipping_city}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_shipping.order_shipping_company}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_shipping.order_shipping_country}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_shipping.order_shipping_phone}</span></p>
                                    <p className='mb-1'><span className="fs-7">{dataDetails?.order_shipping.order_shipping_postcode}</span></p>
                                </div>
                            </div>
                            <div className='w-100 my-4'>
                                <p><span className="fs-7 mt-3">Phone: {dataDetails?.order_billing.order_billing_phone}</span></p>
                                <span className="fs-7">Email : {dataDetails?.customer_email}</span>
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
                                        <td className='align-middle text-center'>{item.sku ? item.sku : '-'}</td>
                                        <td className='align-middle text-center'>{formatMoney(item.price)}</td>
                                        <td className='align-middle text-center'>{item.quantity}</td>
                                        <td className='align-middle text-center'>{formatMoney(item.price * item.quantity)}</td>
                                    </tr>
                                    ) : <tr><td colSpan={5} className='text-center'>{message}</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            </div>
        </PopupComponent >

    }

    return <>
        {isShowPopup ? renderPopup() : ''}
        {renderTable()}
    </>

}

export default LatestOrder