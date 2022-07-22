import { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { ITEMS_PER_PAGES, MONTHS, TABLE_PRODUCT_SALE, TABLE_PRODUCT_SALE_STATUS, TABLE_PRODUCT_STATUS, YEARS } from '../../../../constant'
import { formValue, iProduct } from '../../../../models'
import { RootState } from '../../../../setup'
import { find_page_begin_end, formatMoney } from '../../../../_metronic/helpers'
import Loading from '../../../../_metronic/partials/content/Loading'
import { fetchPromotionList, getPromotionProductInput } from '../Redux/Actions'

interface Props {
    initFormValue: formValue
}

const PromotionProducts = (props: Props) => {
    const dispatch = useDispatch()
    const { initFormValue } = props
    const promotionProducts: any = useSelector<RootState>(({ reportReducers }) => reportReducers.promotionProducts, shallowEqual)
    const reduxFormValue: any = useSelector<RootState>(({ reportReducers }) => reportReducers.formValue, shallowEqual)
    const isLoading: any = useSelector<RootState>(({ reportReducers }) => reportReducers.requestIsLoading, shallowEqual)

    const getProductListStt = (stt: string) => {
        const item = TABLE_PRODUCT_SALE_STATUS.find((item: any) => item.name.toLocaleLowerCase() === stt);
        return item ? <span className={`badge badge-light-${item.btnStatus} text-capitalize`}>{item.name === 'publish' ? 'approved' : item.name}</span>
            : <span className='badge badge-light-info text-capitalize'>Draft</span>
    }

    const [formValue, setFormValue] = useState<formValue>(Object.keys(reduxFormValue).length ? reduxFormValue : initFormValue)

    const onChangeHandler = (e: any, current_page: number = 1) => {
        const { name, value } = e.target
        setFormValue({ ...formValue, [name]: parseInt(value), current_page })
        dispatch(getPromotionProductInput({ ...formValue, [name]: parseInt(value), current_page }))
    }

    const getPromotionProducts = (formValue: formValue) => {
        dispatch(fetchPromotionList(formValue))
    }

    useEffect(() => {
        getPromotionProducts(formValue)
        const abortController = new AbortController() 
        return () => {
            abortController.abort() 
        }
    }, [formValue])

    const filterSection = () => <div className='row my-2'>
        <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
                className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
                name='filter_by_month'
                onChange={(e) => {
                    onChangeHandler(e)
                }}
                value={formValue.filter_by_month}
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
                value={formValue.filter_by_year}
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

    const listPages = find_page_begin_end(promotionProducts.current_page, promotionProducts.total_pages)
    return <>
        {filterSection()}
        <div className='col-xs-12'>
            <div className="table-responsive">
                {isLoading ? <Loading /> : <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                    <thead>
                        <tr className='fw-bolder text-muted'>{TABLE_PRODUCT_SALE.map((item, index: number) => <td key={index} className={item.className}>{item.name}</td>)}</tr>
                    </thead>
                    {isEmptyObject(promotionProducts).length ? <tbody>
                        {promotionProducts.product_sale_list.length > 0 ? (
                            promotionProducts.product_sale_list.map((item: iProduct, index: number) => (
                                <tr key={index}>
                                    <td className='text-left'>{item.product_id}</td>
                                    <td style={{ width: '250px' }} className=' text-left '>
                                        <div className='d-flex align-items-center'>
                                            <div className='symbol symbol-45px me-5'>
                                                <img
                                                    src={
                                                        item.product_img
                                                            ? item.product_img
                                                            : 'https://via.placeholder.com/75x75/f0f0f0'
                                                    }
                                                    alt={item.product_sale}
                                                />
                                            </div>
                                            <div className='d-flex justify-content-start flex-column'>
                                                <a style={{ fontSize: "13px !important" }} target="blank" href={item.preview ? item.preview : '#'} className='text-dark fw-bolder text-hover-primary fs-6 ' >
                                                    {item.product_sale}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='text-center'>{item.type}</td>

                                    <td className='text-center'>{item.sku ? item.sku : '-'}</td>
                                    <td className='text-end'>
                                        <p className={`  mb-0  ${item.type === 'Variable' ? 'fs-8' : ''}`} >
                                            {item.type === 'Variable' && 'From'}
                                        </p>
                                        <p className='mb-1'>{formatMoney(item.sale_price)}</p>
                                        <p className='mb-0 text-muted'>
                                            <s>{formatMoney(item.regular_price)}</s>
                                        </p>
                                    </td>
                                    <td className='text-center'>{getProductListStt(item.status)}</td>
                                    <td className='text-end'>{item.date}</td>
                                </tr>
                            ))
                        ) : <tr>
                            <td colSpan={TABLE_PRODUCT_SALE.length} className='text-center'>
                                No Item Found
                            </td>
                        </tr>
                        }
                        {/* Pagination */}
                    </tbody> : ''}
                </table>
                }
            </div>
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
                            value={formValue.page_size ? formValue.page_size : initFormValue.page_size}
                        >
                            {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
                        </select>
                        <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                        <span className='text-muted fs-8 ms-3'>
                            Displaying {promotionProducts.current_page} of {promotionProducts.total_pages} pages
                        </span>
                    </div>
                </div>
                {promotionProducts.total_pages <= 1 ? '' : <div className='col-md-6 d-flex justify-content-end'>
                    <div>
                        {listPages &&
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
                            ))}
                    </div>
                </div>}
            </div>

        </div>
    </>
}
export default PromotionProducts