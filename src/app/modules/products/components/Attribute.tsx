import { Field, Formik } from 'formik'
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup'
import { RootState } from '../../../../setup';
import { AddinLoading } from '../../../../_metronic/partials';
import AlertMessage from '../../../../_metronic/partials/common/alert';
import { getAttributesById, updateAttr, createProductAttributeBrand, createTermsProductAttribute, updateAttributeTerms } from '../redux/ProductsList';

// AddinLoading
const Attribute: FC = () => {
    const [parentAttributeList, setParentAttributeList] = useState<any[]>([])
    const [parentAttribute, setParentAttribute] = useState<string>('')
    const [message, setMessage] = useState<string>()
    const [childId, setChildId] = useState<string | number>()
    const [childAttrTaxonomy, setChildAttrTaxonomy] = useState<string>('')
    const [childAttr, setchildAttr] = useState<string>()
    const [isActiveIndex, setActiveIndex] = useState<number>(0);
    const [hasErrors, setHasErrors] = useState<boolean>(true)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isUpdateChild, setIsUpdateChild] = useState<boolean>(false)


    const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
    const currentUserId = user ? user.ID : 0

    const newList = [...parentAttributeList]


    const initialValues = {
        new_attribute_name: ''
    }
    const createInitValue = {
        name: '',
        parrent_attribute: ''
    }

    const updateChildAttrInitValue = {
        new_attribute_term_name: ''
    }

    const validateSchema = Yup.object().shape({
        new_attribute_name: Yup.string().required('New attribute is required!')
    })

    const childUpdateValidateSchema = Yup.object().shape({
        new_attribute_term_name: Yup.string().required('New Attribute Term is required!'),
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

    const afterSubmit = (resetForm: any) => {
        setTimeout(() => {
            setMessage('')
            resetForm()
        }, 3500);
    }
    const updateDataAttr = (old_attribute_name: string, new_attribute_name: string, resetForm: any) => {
        updateAttr(old_attribute_name, new_attribute_name).then(res => {
            const { code, message } = res.data
            setMessage('processing')
            setHasErrors(false)
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

    const updateAttributeTerm = (new_attribute_term_name: string, resetForm: any) => {
        const payload: any = {
            ...updateChildAttrInitValue,
            id_term: childId,
            taxonomy: childAttrTaxonomy,
            new_attribute_term_name,
        };
        updateAttributeTerms(payload).then(res => {
            const { code, message } = res.data
            setHasErrors(false)
            setMessage('processing')
            if (code === 200) {
                setHasErrors(false)
                setMessage(message)
                afterSubmit(resetForm)

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
            console.log(label_name)
            const { code, message } = res.data
            setHasErrors(false)
            setMessage('processing')
            if (code === 200) {
                setMessage(message)
                afterSubmit(resetForm)
            } else {
                setHasErrors(true)
                setMessage(message)
                afterSubmit(resetForm)
            }
        }).catch(err => console.log(err))
    }

    const createProductTermAttr = (term_name: string, taxonomy: string, resetForm: any) => {
        const payload = {
            term_name, taxonomy
        }
        createTermsProductAttribute(payload).then(res => {
            const { code, message } = res.data
            setHasErrors(false)
            setMessage('processing')
            if (code === 200) {
                setMessage(message)
                afterSubmit(resetForm)
            } else {
                setHasErrors(true)
                setMessage(message)
                afterSubmit(resetForm)
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

    const showList = () => !!parentAttributeList && newList.map((attr: any, index: number) => {
        const checkOpen = isActiveIndex === index;
        return <li key={index} className='list-group-item mt-2 shadow-sm p-4 mb-2 bg-body rounded'>
            <div className="d-flex justify-content-between align-items-center" >
                <span>{attr.label}</span>
                <div>
                    <p onClick={() => { editMode(); setParentAttribute(attr.label) }} className='badge bg-warning rounded-pill my-0 mx-4 cursor-pointer'>Edit</p>
                    <p onClick={() => toggleAttr(index)} className='badge bg-success rounded-pill m-0 cursor-pointer'>{attr.options ? attr?.options.length : 0}</p>
                </div>
            </div>
            {checkOpen && <>
                {!!attr.options && attr?.options.map((i: any, index: number) =>
                    <div key={index + Math.random()} className="d-flex justify-content-between mt-2 border-bottom border-2">
                        <p className='m-2'>{i.label} </p>
                        <span onClick={() => { setIsUpdateChild(true); setChildId(i.id); setChildAttrTaxonomy(i.attr); setchildAttr(i.label); setParentAttribute(attr.label) }} className='text-success cursor-pointer'>Edit</span>
                    </div>)}
            </>
            }
        </li >
    }
    )

    // Create UI FORM
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
                            <div className="col-md-12">
                                <button className='btn btn-success my-4 ' type="submit">Submit</button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>)
    }

    // Update UI FROM
    const updateForm = () => {
        return (
            <div className='card-body py-3'>
                {message && <AlertMessage hasErrors={hasErrors} message={message} />}
                {isUpdateChild ?
                    <Formik
                        initialValues={updateChildAttrInitValue}
                        validationSchema={childUpdateValidateSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            updateAttributeTerm(values.new_attribute_term_name, resetForm)
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="col-xxs-12 mt-3">
                                    <label htmlFor="parrent_attribute">Current Parent Attributes</label>
                                    <Field
                                        component="input"
                                        id="parrent_attribute"
                                        name="parrent_attribute"
                                        className="form-control my-4"
                                        value={parentAttribute}
                                        disabled
                                    />
                                </div>
                                <div className="col-xxs-12 mt-3">
                                    <label htmlFor="parrent_attribute">Current Child Attributes</label>
                                    <Field
                                        component="input"
                                        id="parrent_attribute"
                                        name="parrent_attribute"
                                        className="form-control my-4"
                                        value={childAttr}
                                        disabled
                                    />
                                </div>
                                <div className="col-xxs-12 mt-3">
                                    <label htmlFor="new_attribute_term_name">New Child Attributes</label>
                                    <Field
                                        component="input"
                                        type='text'
                                        id="new_attribute_term_name"
                                        name="new_attribute_term_name"
                                        className="form-control my-4"
                                    />
                                    {touched.new_attribute_term_name && errors.new_attribute_term_name && (
                                        <div className='text-danger mt-2'>{errors.new_attribute_term_name}</div>
                                    )}
                                </div>
                                <div className="col-md-12 ">
                                    <button className='btn btn-success my-4' type="submit">Submit</button>
                                    <button onClick={() => { setIsEdit(false); setIsUpdateChild(false) }} className='btn btn-danger my-4 mx-4' type="submit">cancel</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                    : (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validateSchema}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                updateDataAttr(parentAttribute, values.new_attribute_name, resetForm)
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mt-4 row">

                                        <label htmlFor="old_attribute_name">Current Attributes</label>
                                        <Field
                                            component="input"
                                            type='text'
                                            id="old_attribute_name"
                                            className="form-control"
                                            value={parentAttribute}
                                            disabled
                                        />
                                    </div>
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
                                    <div className="col-md-12">
                                        <button disabled={isSubmitting} className='btn btn-success my-4' type="submit">Submit</button>
                                        <button onClick={() => { setIsEdit(false); setIsUpdateChild(false) }} className='btn btn-danger my-4 mx-4' type="submit">cancel</button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    )}

            </div >)
    }
    return (
        <div className='row mt-0 g-xl-8 bg-white rounded'>
            {parentAttributeList.length > 0 ? (
                <>
                    <div className="col-xxl-6 mt-0 ">
                        <div className="card card-products">
                            <div className='card-header border-0 pt-5'>
                                <h3 className='card-title align-items-start flex-column'>
                                    <span className='card-label fw-bolder fs-3 mb-1'>{isEdit || isUpdateChild ? 'Edit Attributes' : 'Add New Attribute'}</span>
                                </h3>
                            </div>
                            {isEdit || isUpdateChild ? updateForm() : createForm()}
                        </div>
                    </div>
                    <div style={{ height: 600 }} className="col-xxl-6 overflow-scroll">
                        <ul className='list-group'>
                            {showList()}
                        </ul>
                    </div>
                </>) : (
                <div className='card mb-5 mb-xl-8 loading-wrapper'>
                    <div className='card-body py-3 loading-body'>
                        <AddinLoading />
                    </div>
                </div>)}
        </div >
    )
}

export default Attribute