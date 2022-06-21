import { useEffect, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { ITEMS_PER_PAGES, MONTHS, TABLE_PRODUCT_SOLD, YEARS } from "../../../../constant"
import { formValue, iProductSold } from "../../../../models"
import { RootState } from "../../../../setup"
import { find_page_begin_end, formatMoney } from "../../../../_metronic/helpers"
import Loading from "../../../../_metronic/partials/content/Loading"
import { actions } from "../Redux/Actions"
import { getProductSoldList } from "../saleReport"

interface Props {
    initFormValue: formValue
}

const ProductSold = (props: Props) => {
    const { initFormValue } = props
    const dispatch = useDispatch()
    const soldProducts: any = useSelector<RootState>(({ reportReducers }) => reportReducers.soldProducts, shallowEqual)
    const reduxFormValue: any = useSelector<RootState>(({ reportReducers }) => reportReducers.formProductSold, shallowEqual)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formProductSold, setFormProductSold] = useState<formValue>(Object.keys(reduxFormValue).length ? reduxFormValue : initFormValue)

    const onChangeHandler = (e: any, current_page: number = 1) => {
        const { name, value } = e.target
        setFormProductSold({ ...formProductSold, [name]: parseInt(value), current_page })
        dispatch(actions.getProductSoldListInput({ ...formProductSold, [name]: parseInt(value), current_page }))
    }

    const showProductSoldList = (formProductSold: formValue) => {
        setIsLoading(true)
        getProductSoldList(formProductSold).then(res => {
            const { code, data } = res.data
            if (code === 200) {
                setIsLoading(false)
                dispatch(actions.getProductSoldList(data))
            }
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        showProductSoldList(formProductSold)
    }, [formProductSold])


    const filterSection = () => <div className='row my-2'>
        <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
            <label className='form-label me-3 mb-0'>Month</label>
            <select
                className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
                name='filter_by_month'
                onChange={(e) => {
                    onChangeHandler(e)
                }}
                value={formProductSold.filter_by_month}
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
                value={formProductSold.filter_by_year}
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

    const listPages = find_page_begin_end(soldProducts?.current_page, soldProducts?.total_pages)
    return soldProducts ? (
        <>
            {filterSection()}
            <div className='col-xs-12'>
                {isLoading ? <Loading /> : <div className="table-responsive">
                    <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                        <thead>
                            <tr className='fw-bolder text-muted'>
                                {TABLE_PRODUCT_SOLD.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {soldProducts.product_list ? (
                                soldProducts.product_list?.map((item: iProductSold, index: number) => (
                                    <tr key={index}>
                                        <td className='text-start'>{item.order_id}</td>
                                        <td style={{ width: '250px' }} className='text-left'>
                                            <div className='d-flex align-items-center'>
                                                <div className='symbol symbol-45px me-5'>
                                                    <img
                                                        src={
                                                            item.product_img
                                                                ? item.product_img
                                                                : 'https://via.placeholder.com/75x75/f0f0f0'
                                                        }
                                                        alt={item.title_product}
                                                    />
                                                </div>
                                                <div className='d-flex justify-content-start flex-column'>
                                                    <a style={{ fontSize: "13px !important" }} target="blank" href={item.product_url ? item.product_url : '#'} className='text-dark fw-bolder text-hover-primary fs-6 '>
                                                        {item.title_product}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center '>{item.sku ? item.sku : '-'}</td>
                                        <td className='text-center '>{item.quantity}</td>
                                        <td className='text-end '>{formatMoney(item.price)}</td>
                                        <td className='text-end'>{item.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center'>
                                        No Item Found
                                    </td>
                                </tr>
                            )}
                            {/* Pagination */}
                        </tbody>
                    </table>
                </div>
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
                                    soldProducts.page_size ? soldProducts.page_size : initFormValue.page_size
                                }
                            >
                                {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
                            </select>
                            <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                            <span className='text-muted fs-8 ms-3'>
                                Displaying {soldProducts.current_page} of {soldProducts.total_pages} pages
                            </span>
                        </div>
                    </div>
                    {soldProducts.total_pages <= 1 ? '' : <div className='col-md-6 d-flex justify-content-end'>
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
    ) : (
        <Loading />
    )
}

export default ProductSold
