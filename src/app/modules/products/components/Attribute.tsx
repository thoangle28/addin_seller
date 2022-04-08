import { Field, Formik } from 'formik'
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup'
import { RootState } from '../../../../setup';
import AlertMessage from '../../../../_metronic/partials/common/alert';
import { getAttributesById, updateAttr, createProductAttributeBrand, createTermsProductAttribute } from '../redux/ProductsList';


const Attribute: FC = () => {
    const [parentAttributeList, setParentAttributeList] = useState<string[]>([])
    const [parentAttribute, setParentAttribute] = useState<string>('')
    const [message, setMessage] = useState<string>()
    const [isActiveIndex, setActiveIndex] = useState<number>(0);
    const [hasErrors, setHasErrors] = useState<boolean>(true)
    const [isEdit, setIsEdit] = useState<boolean>(false)


    const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
    const currentUserId = user ? user.ID : 0

    const initialValues = {
        old_attribute_name: '',
        new_attribute_name: ''
    }
    const createInitValue = {
        name: '',
        parrent_attribute: ''
    }

    const validateSchema = Yup.object().shape({
        old_attribute_name: Yup.string().required('Old Attribute is required!'),
        new_attribute_name: Yup.string().required('New attribute is required!')
    })

    const createValidSchema = Yup.object().shape({
        name: Yup.string().required('Name is required!')
    })

    const fetchData = () => {
        getAttributesById(currentUserId).then((res: any) => {
            setParentAttributeList(res.data.data)
        }).catch(err => console.log(err));
    }
    const editMode = () => {
        setIsEdit(true)
    }

    const updateDataAttr = (old_attribute_name: string, new_attribute_name: string, resetForm: any) => {
        updateAttr(old_attribute_name, new_attribute_name).then(res => {
            const { code, message } = res.data
            setMessage('processing')
            if (code === 200) {
                setHasErrors(false)
                setMessage(message)
                resetForm()
                setTimeout(() => {
                    setMessage('')
                }, 3000);
            } else {
                setHasErrors(true)
                setMessage(message)
            }
        })
    }
    const createProductAttr = (label_name: string, resetForm: any) => {
        const payload = {
            user_id: currentUserId,
            label_name
        }
        createProductAttributeBrand(payload).then(res => {
            const { code, message } = res.data
            setMessage('processing')
            if (code === 200) {
                setMessage(message)
                setTimeout(() => {
                    setMessage('')
                    resetForm()
                }, 3500);
            }
        }).catch(err => console.log(err))
    }

    const createProductTermAttr = (term_name: string, taxonomy: string, resetForm: any) => {
        const payload = {
            term_name, taxonomy
        }
        createTermsProductAttribute(payload).then(res => {
            const { code, message } = res.data
            setMessage('processing')
            if (code === 200) {
                setMessage(message)
                setTimeout(() => {
                    setMessage('')
                    resetForm()
                }, 3500);
            }
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        fetchData();
    }, [])
    const toggleAttr = (index: number) => {
        setActiveIndex(isActiveIndex === index ? 0 : index);
    };

    const showData = () => !!parentAttributeList && parentAttributeList.map((attr: any) => <option value={attr.value} key={attr.id}>{attr.label}</option>)

    const showList = () => !!parentAttributeList && parentAttributeList.map((attr: any, index: number) => {
        const checkOpen = isActiveIndex === index;
        return <li key={index} className='list-group-item border-0 mb-2'>
            <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={() => toggleAttr(index)}>
                <span onClick={() => { editMode(); setParentAttribute(attr.label) }}>{attr.label}</span>
                <p className='badge bg-primary rounded-pill m-0'>{attr.options ? attr?.options.length : 0}</p>
            </div>
            {checkOpen && <div>
                {!!attr.options && attr?.options.map((i: any) => <p className='mx-8'>{i.label}</p>)}
            </div>}
        </li >
    }
    )

    const createForm = () => {
        return (
            <div className='card-body py-3'>
                {message && <AlertMessage hasErrors={hasErrors} message={message} />}
                <Formik
                    initialValues={createInitValue}
                    validationSchema={createValidSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        const { name, parrent_attribute } = values
                        parrent_attribute === '' ? createProductAttr(name, resetForm) : createProductTermAttr(name, parrent_attribute, resetForm)
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="col-xxs-12">
                                <label htmlFor="parrent_attribute">Select Parent Attributes</label>
                                <Field
                                    component="select"
                                    as="select"
                                    id="parrent_attribute"
                                    name="parrent_attribute"
                                    className="form-select"
                                >
                                    <option value="">None</option>
                                    {showData()}
                                </Field>
                            </div>
                            <div className="col-xxs-12 mt-4">
                                <label htmlFor="name">Parent Attributes</label>
                                <Field
                                    component="input"
                                    type='text'
                                    id="name"
                                    name="name"
                                    className="form-control"
                                />
                                {touched.name && errors.name && (
                                    <div className='text-danger mt-2'>{errors.name}</div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <button className='btn btn-success my-4 ' type="submit">Submit</button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>)
    }

    const updateForm = () => {
        return (
            <div className='card-body py-3'>
                {message && <AlertMessage hasErrors={hasErrors} message={message} />}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        console.log(values)
                        const { old_attribute_name, new_attribute_name } = values
                        updateDataAttr(old_attribute_name, new_attribute_name, resetForm)
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="old_attribute_name">Parent Attributes</label>
                            <Field
                                component="input"
                                type='text'
                                id="old_attribute_name"
                                name="old_attribute_name"
                                className="form-control"
                            />
                            {touched.new_attribute_name && errors.new_attribute_name && (
                                <div className='text-danger mt-2'>{errors.old_attribute_name}</div>
                            )}
                            <div className="form-group mt-4 row">
                                <div className='col-md-12 mb-5'>
                                    <label htmlFor='new_attribute_name' className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>New Attribute</span>
                                    </label>
                                    <Field
                                        component="input"
                                        type='text'
                                        id="new_attribute_name"
                                        className='form-control fs-7'
                                        name='new_attribute_name'
                                        placeholder=''
                                        data-bs-toggle='tooltip'
                                        data-bs-placement='top'
                                    />
                                    {touched.new_attribute_name && errors.new_attribute_name && (
                                        <div className='text-danger mt-2'>{errors.new_attribute_name}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <button disabled={isSubmitting} className='btn btn-success my-4 ' type="submit">Submit</button>
                                {isEdit && (
                                    <button onClick={() => setIsEdit(false)} className='btn btn-danger my-4 mx-4' type="submit">cancel</button>
                                )}
                            </div>
                        </form>
                    )}
                </Formik>
            </div>)
    }

    return (
        <div className='row mt-0 g-xl-8 bg-white'>
            <div className="col-xxl-7">
                <div className="card card-products">
                    <div className='card-header border-0 pt-5'>
                        <h3 className='card-title align-items-start flex-column'>
                            <span className='card-label fw-bolder fs-3 mb-1'>{isEdit ? 'Edit Attributes : ' + parentAttribute : 'Add New Attribute'}</span>
                        </h3>
                    </div>
                    {isEdit ? updateForm() : createForm()}
                </div>
            </div>
            <div style={{ height: 600 }} className="col-xxl-5 overflow-scroll">
                <ul className='list-group'>
                    {showList()}
                </ul>
            </div>
        </div >
    )
}

export default Attribute