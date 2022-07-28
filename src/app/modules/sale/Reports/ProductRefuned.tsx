import { useEffect, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { ITEMS_PER_PAGES, MONTHS, TABLE_PRODUCT_ORDER_REFUND, YEARS } from "../../../../constant"
import { formValue, iRefuned } from "../../../../models"
import { RootState } from "../../../../setup"
import { find_page_begin_end, formatMoney } from "../../../../_metronic/helpers"
import Loading from "../../../../_metronic/partials/content/Loading"
import { fetchRefundedList, getRefundListInput } from "../Redux/Actions"

interface Props {
    initFormValue: formValue
}
const ProductRefuned = (props: Props) => {
    const dispatch = useDispatch()
    const { initFormValue } = props
    const refundedList: any = useSelector<RootState>(({ reportReducers }) => reportReducers.refundedList, shallowEqual)
    const reduxFormValue: any = useSelector<RootState>(({ reportReducers }) => reportReducers.formRefund, shallowEqual)
    const isLoading: any = useSelector<RootState>(({ reportReducers }) => reportReducers.requestIsLoading, shallowEqual)

    const [formRefund, setFormRefund] = useState<formValue>(Object.keys(reduxFormValue).length ? reduxFormValue : initFormValue)

    const onChangeHandler = (e: any, current_page: number = 1) => {
        e.preventDefault()
        const { name, value } = e.target
        setFormRefund({ ...formRefund, [name]: parseInt(value), current_page })
        dispatch(getRefundListInput({ ...formRefund, [name]: parseInt(value), current_page }))
    }

    const showRefundList = (formRefund: formValue) => dispatch(fetchRefundedList(formRefund))

    useEffect(() => {
        showRefundList({ ...formRefund })
        const abortController = new AbortController() 
        return () => {
            abortController.abort() 
        }
    }, [formRefund])


    const filterSection = () => <div className='row my-2'>
        <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
                className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
                name='filter_by_month'
                onChange={(e) => {
                    onChangeHandler(e)
                }}
                value={formRefund.filter_by_month}
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
                value={formRefund.filter_by_year}
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

    const listPages = find_page_begin_end(refundedList?.current_page, refundedList?.total_pages)
    return <>
        {filterSection()}
        <div className='table-responsive'>
            {isLoading ? <Loading /> : <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                    <tr className="fw-bolder text-muted">
                        {TABLE_PRODUCT_ORDER_REFUND.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
                    </tr>
                </thead>
                {isEmptyObject(refundedList).length ? <tbody>
                    {refundedList.order_refund_list.length > 0 ? refundedList?.order_refund_list.map((item: iRefuned, index: number) => <tr key={index} >
                        <td className="text-start">{item.order_id}</td>
                        <td style={{ width: '250px' }} className="text-left">
                            <div className='d-flex align-items-center'>
                                <div className='symbol symbol-45px me-5'>
                                    <img src={item.product_img ? item.product_img : 'https://via.placeholder.com/75x75/f0f0f0'} alt={item.title_product} />
                                </div>
                                <div style={{ fontSize: "13px !important" }} className='d-flex justify-content-start flex-column'>
                                    <a target="blank" href={item.product_url ? item.product_url : '#'} className='text-dark fw-bolder text-hover-primary fs-6 ' >
                                        {item.title_product}
                                    </a>
                                </div>
                            </div>
                        </td>
                        <td className="text-center">{item.sku ? item.sku : '-'}</td>
                        <td className="text-end">{formatMoney(item.price_refund)}</td>
                        <td className="text-end">{item.date}</td>
                    </tr>
                    ) : <tr>
                        <td colSpan={TABLE_PRODUCT_ORDER_REFUND.length} className="text-center">No Item Found</td>
                    </tr>
                    }
                </tbody> : ''} 
            </table>
            }
            <div className="row justify-content-between align-items-center">
                <div className="col-md-6">
                    <div className='d-flex align-items-center py-3'>
                        <span className='text-muted me-3'>Showing</span>
                        <select
                            name="page_size"
                            onChange={(e) => { onChangeHandler(e) }}
                            className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                            value={formRefund.page_size ? formRefund.page_size : initFormValue.page_size}

                        >
                            {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
                        </select>
                        <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                        <span className='text-muted fs-8 ms-3'>
                            Displaying {refundedList.current_page} of {refundedList.total_pages} pages
                        </span>
                    </div>
                </div>
                {refundedList.total_pages <= 1 ? '' : <div className="col-md-6 d-flex justify-content-end">
                    <div className="col-md-6 d-flex justify-content-end">
                        {listPages &&
                            listPages.map((item, index) => <span key={index} onClick={(e: any) => { onChangeHandler(e, item.page) }} className={'btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 ' + item.class}>
                                {item.label}
                            </span>
                            )}
                    </div>
                </div>}
            </div>
        </div >
    </>

}

export default ProductRefuned