import { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { ITEMS_PER_PAGES, MONTHS, TABLE_CUSTOMER_SALE, YEARS } from '../../../../constant'
import { formValue, iCustomer } from '../../../../models'
import { RootState } from '../../../../setup'
import { find_page_begin_end } from '../../../../_metronic/helpers'
import Loading from '../../../../_metronic/partials/content/Loading'
import { actions } from '../Redux/Actions'
import { getCustomerList } from '../saleReport'

interface Props { initFormValue: formValue }

const Customers = (props: Props) => {
    const dispatch = useDispatch()
    const { initFormValue } = props
    const customerList: any = useSelector<RootState>(({ reportReducers }) => reportReducers.customerList, shallowEqual)
    const reduxFormValue: any = useSelector<RootState>(({ reportReducers }) => reportReducers.formCustomerValue, shallowEqual)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formCustomerValue, setFormCustomerValue] = useState<formValue>(Object.keys(reduxFormValue).length ? reduxFormValue : initFormValue)

    const onChangeHandler = (e: any, current_page: number = 1) => {
        const { name, value } = e.target
        setFormCustomerValue({ ...formCustomerValue, [name]: parseInt(value), current_page })
        dispatch(actions.getCustomerListInput({ ...formCustomerValue, [name]: parseInt(value), current_page }))
    }

    const showCustomerList = (formCustomerValue: formValue) => {
        setIsLoading(true)
        getCustomerList(formCustomerValue)
            .then((res) => {
                const { code, data } = res.data
                if (code === 200) {
                    setIsLoading(false)
                    dispatch(actions.getCustomerList(data))
                }
            })
            .catch((err) => console.log(err))
    }
    useEffect(() => {
        showCustomerList({ ...formCustomerValue })
    }, [formCustomerValue])

    const filterSection = () => {
        return (
            <div className='row my-2'>
                <div className='col-md-4 me-4 my-1 d-flex justify-content-center align-items-center'>
                    <label className='form-label me-3 mb-0'>Month</label>
                    <select
                        className='form-select ms-3 text-primary form-select-solid bg-light-primary form-select-sm me-3'
                        name='filter_by_month'
                        onChange={(e) => {
                            onChangeHandler(e)
                        }}
                        value={formCustomerValue.filter_by_month}
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
                        value={formCustomerValue.filter_by_year}
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
        )
    }

    const listPages = find_page_begin_end(customerList?.current_page, customerList?.total_pages)
    return customerList ? (
        <>
            {filterSection()}
            <div className='col-xs-12'>
                <div className="table-responsive">
                    {isLoading ? <Loading /> : <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                        <thead>
                            <tr className='fw-bolder text-muted'>
                                {TABLE_CUSTOMER_SALE.map((item, index: number) => <th key={index} className={item.className}>{item.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {customerList.customer_list.length ? (
                                customerList.customer_list?.map((item: iCustomer, index: number) => (
                                    <tr key={index}>
                                        <td className=' text-start'>{index + 1}</td>
                                        <td className=' text-start'>{item.full_name}</td>
                                        <td className=' text-start'>{item.email ? item.email : '-'}</td>
                                        <td className=' text-center'>{item.phone}</td>
                                        <td className=' text-center'>{item.city ? item.city : '-'}</td>
                                        <td className=' text-center'>{item.country ? item.country : '-'}</td>
                                    </tr>
                                ))
                            ) : <tr>
                                <td colSpan={6} className='text-center'>
                                    No Item Found
                                </td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    }
                    <div className='row justify-content-between align-items-center'>
                        <div className='col-md-5'>
                            <div className='d-flex align-items-center py-3'>
                                <span className='text-muted me-3'>Showing</span>
                                <select
                                    name='page_size'
                                    className='form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary select-down'
                                    onChange={(e) => {
                                        onChangeHandler(e)
                                    }}
                                    value={
                                        formCustomerValue.page_size
                                            ? formCustomerValue.page_size
                                            : initFormValue.page_size
                                    }
                                >
                                    {ITEMS_PER_PAGES.map((item, index: number) => <option key={index} value={item}>{item}</option>)}
                                </select>
                                <span className='text-muted fs-8 ms-3'>item(s)/page</span>
                                <span className='text-muted fs-8 ms-2'>
                                    Displaying {customerList.current_page} of {customerList.total_pages} pages
                                </span>
                            </div>
                        </div>
                        {customerList.total_pages <= 1 ? '' : <div className='col-md-6 d-flex justify-content-end'>
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
                        </div>}

                    </div>
                </div>
            </div>
        </>
    ) : (
        <Loading />
    )
}
export default Customers