import { useEffect, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { ITEMS_PER_PAGES, MONTHS, TABLE_PRODUCT_ORDER, TABLE_PRODUCT_STATUS, YEARS } from "../../../../constant"
import { formValue, iOrderList } from "../../../../models"
import { RootState } from "../../../../setup"
import { find_page_begin_end, formatMoney } from "../../../../_metronic/helpers"
import Loading from "../../../../_metronic/partials/content/Loading"
import { fetchProductOrder, getProductOrderListInput } from "../Redux/Actions"

interface Props {
    initFormValue: formValue
}

const ProductOrder = (props: Props) => {
    const dispatch = useDispatch()

    const orderProducts: any = useSelector<RootState>(({ reportReducers }) => reportReducers.orderProducts, shallowEqual)
    const reduxFormValue: any = useSelector<RootState>(({ reportReducers }) => reportReducers.formProductOrderValue, shallowEqual)
    const isLoading: any = useSelector<RootState>(({ reportReducers }) => reportReducers.requestIsLoading, shallowEqual)

    const { initFormValue } = props
    const [formProductOrderValue, setFormProductOrderValue] = useState<formValue>(Object.keys(reduxFormValue).length ? reduxFormValue : initFormValue)

    const onChangeHandler = (e: any, current_page: number = 1) => {
        const { name, value } = e.target
        setFormProductOrderValue({ ...formProductOrderValue, [name]: parseInt(value), current_page })
        dispatch(getProductOrderListInput({ ...formProductOrderValue, [name]: parseInt(value), current_page }))
    }

    useEffect(() => {
        showProductOrderList({ ...formProductOrderValue })
        const abortController = new AbortController() 
        return () => {
            abortController.abort() 
        }
    }, [formProductOrderValue])


    const showProductOrderList = (formProductOrderValue: formValue) => dispatch(fetchProductOrder(formProductOrderValue))


    // UI components
    const getStatus = (status: string) => {
        const item = TABLE_PRODUCT_STATUS.find((item: any) => item.key.toLocaleLowerCase() === status);
        return item ? <span className={`badge badge-light-${item.btnStatus} text-capitalize`}>{item.key === 'publish' ? 'approved' : item.name}</span>
            : <span className='badge badge-light-info text-capitalize'>Draft</span>
    }

    const filterSection = () => <div className='row my-2'>
        <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
                className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
                name='filter_by_month'
                onChange={(e) => {
                    onChangeHandler(e)
                }}
                value={formProductOrderValue.filter_by_month}
            >
                <option value=''>None</option>
                {MONTHS.map((item, index) => (
                    <option key={index} value={index + 1}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
        <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Year</label>
            <select
                className='form-select text-primary bg-light-primary form-select-solid form-select-sm me-3'
                name='filter_by_year'
                onChange={(e) => {
                    onChangeHandler(e)
                }}
                value={formProductOrderValue.filter_by_year}
            >
                <option value=''>None</option>
                {YEARS.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    </div>
    
    const isEmptyObject = (obj: any) => Object.keys(obj)

    const listPages = find_page_begin_end(orderProducts?.current_page, orderProducts?.total_pages)
    return <>
        {filterSection()}
        <div className='col-xs-12'>
            <div className="table-responsive">
                {isLoading ? <Loading /> : <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                    <thead>
                        <tr className="fw-bolder text-muted">
                            {TABLE_PRODUCT_ORDER.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
                        </tr>
                    </thead>
                    {isEmptyObject(orderProducts).length ? <tbody>
                        {orderProducts.order_list.length > 0 ? orderProducts.order_list?.map((item: iOrderList, index: number) => <tr key={index} >
                            <td className="text-start">{item.order_id}</td>
                            <td className="text-left text-dark">{item.customer_name ? item.customer_name : ''}
                            </td>
                            <td className='text-center'>{getStatus(item.status)}</td>
                            <td className="text-end">{formatMoney(item.price)}</td>
                            <td className="text-end">{item.date}</td>
                        </tr>
                        ) : <tr>
                            <td colSpan={TABLE_PRODUCT_ORDER.length} className="text-center">No Item Found</td>
                        </tr>
                        }
                    </tbody> : ''}  
                </table>
                }
            </div>
            <div className="row justify-content-between align-items-center">
                <div className="col-md-6">
                    <div className='d-flex align-items-center py-3'>
                        <span className='text-muted me-3'>Showing</span>
                        <select
                            name="page_size"
                            onChange={(e) => { onChangeHandler(e) }}
                            className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                            value={formProductOrderValue.page_size ? formProductOrderValue.page_size : initFormValue.page_size}

                        >
                            {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
                        </select>
                        <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                        <span className='text-muted fs-8 ms-3'>
                            Displaying {orderProducts.current_page} of {orderProducts.total_pages} pages
                        </span>
                    </div>
                </div>
                {orderProducts.total_pages <= 1 ? '' : <div className="col-md-6 d-flex justify-content-end">
                    {listPages &&
                        listPages.map((item, index) => <span key={index} onClick={(e: any) => { onChangeHandler(e, item.page) }} className={'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class}>
                            {item.label}
                        </span>
                        )}
                </div>}

            </div>
        </div>
    </>
}

export default ProductOrder
