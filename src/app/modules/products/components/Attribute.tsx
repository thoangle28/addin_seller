import { Field, Formik } from 'formik'
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup'
import { RootState } from '../../../../setup';
import { AddinLoading } from '../../../../_metronic/partials';
import AlertMessage from '../../../../_metronic/partials/common/alert';
import { getAttributesById, updateAttr, createProductAttributeBrand, createTermsProductAttribute, updateAttributeTerms } from '../redux/ProductsList';

const Attribute: FC = () => {
    const [parentAttributeList, setParentAttributeList] = useState<any[]>([])
    const [parentAttribute, setParentAttribute] = useState<string>('')
    const [message, setMessage] = useState<string>()
    const [childId, setChildId] = useState<string | number>()
    const [childAttrTaxonomy, setChildAttrTaxonomy] = useState<string>('')
    const [childAttr, setchildAttr] = useState<string>('')
    const [isActiveIndex, setActiveIndex] = useState<number>();
    const [hasErrors, setHasErrors] = useState<boolean>(true)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isUpdateChild, setIsUpdateChild] = useState<boolean>(false)
    const [isChildOpen, setIsChildOpen] = useState(false)

    const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
    const currentUserId = user ? user.ID : 0

    const createInitValue = {
        name: '',
        parrent_attribute: ''
    }
    const createValidSchema = Yup.object().shape({
        name: Yup.string().required('Name is required!')
    })

    const initialValues = {
        new_attribute_name: parentAttribute
    }
    const validateSchema = Yup.object().shape({
        new_attribute_name: Yup.string().required('New attribute is required!')
    })

    const updateChildAttrInitValue = {
        new_attribute_term_name: childAttr,
        taxonomy: childAttrTaxonomy
    }

    const childUpdateValidateSchema = Yup.object().shape({
        new_attribute_term_name: Yup.string().required('New Attribute Term is required!'),
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
            setHasErrors(false)
            if (code === 200)
                window.location.reload();
            else {
                setHasErrors(true)
                setMessage(message)
                afterSubmit(resetForm)
            }
        })
    }

    const updateAttributeTerm = (new_attribute_term_name: string, resetForm: any) => {
        const payload: any = {
            ...updateChildAttrInitValue,
            id_term: childId,
            taxonomy: childAttrTaxonomy,
            new_attribute_term_name,
            label_term: childAttr

        };
        updateAttributeTerms(payload).then(res => {
            const { code, message } = res.data
            setHasErrors(false)
            setMessage('processing')
            if (code === 200) window.location.reload();
            else {
                setHasErrors(true)
                setMessage(message)
                afterSubmit(resetForm)
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
            setHasErrors(false)
            setMessage('processing')
            if (code === 200)
                window.location.reload();
            else {
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
        setActiveIndex(isActiveIndex === index ? undefined : index);
    };

    const showData = () => !!parentAttributeList && parentAttributeList.map((attr: any) => <option value={attr.value} key={attr.id}>{attr.label}</option>)

    const showList = () => !!parentAttributeList && parentAttributeList.map((attr: any, index: number) => {
        const checkOpen = isActiveIndex === index;
        return <li key={index} className='list-group-item shadow-sm p-2 mb-2 bg-body rounded'>
            <div className="d-flex justify-content-between align-items-center ms-4" >
                <div className='cursor-pointer' onClick={() => {
                    toggleAttr(index)
                }}>
                    <span>{attr.label} </span>
                    <p className='badge bg-primary rounded-pill mx-2 mb-0 '>{attr.options ? attr?.options.length : 0}</p>
                </div>
                <button style={isChildOpen ? { pointerEvents: 'none' } : {}} className='btn-btn-success border-0 bg-transparent' aria-disabled="true" >
                    <p onClick={() => { editMode(); setParentAttribute(attr.label); setIsUpdateChild(false) }} className='badge bg-success mx-4 mb-0 cursor-pointer'>Edit</p>
                </button>
            </div>
            {
                checkOpen && <>
                    {!!attr.options && attr?.options.map((i: any, index: number) =>
                        <div key={index + Math.random()} className="d-flex justify-content-between mt-2 border-bottom border-1 mt-4">
                            <p className='my-3 ms-8'>{i.label} </p>
                            <span onClick={() => { setIsUpdateChild(true); setChildId(i.id); setChildAttrTaxonomy(i.attr); setchildAttr(i.label); setParentAttribute(attr.label); }} className='text-success cursor-pointer fs-6 me-8'>Edit</span>
                        </div>)}
                </>
            }
        </li >
    }
    )

    const cancelEvent = (resetForm: any) => {
        setIsEdit(false); setIsUpdateChild(false); resetForm(); setIsChildOpen(false)
    }

    // Create UI FORM
    const createForm = () => {
        return (
            <div className='card-body py-0 ps-4 pe-0'>
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
                                <label className="form-label mb-3" htmlFor="parrent_attribute">Parent Attributes</label>
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
                            <div className="col-xxs-12 mt-3">
                                <label className="form-label mb-3" htmlFor="name">Name</label>
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
                                <button className='btn btn-success my-4 ' type="submit">Add New</button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>)
    }

    // Update FORM
    const updateForm = () => {
        return (
            <div className='card-body py-0 ps-4 pe-0'>
                {message && <AlertMessage hasErrors={hasErrors} message={message} />}
                {isUpdateChild ?
                    <Formik
                        initialValues={{ ...updateChildAttrInitValue }}
                        validationSchema={childUpdateValidateSchema} enableReinitialize={true}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            updateAttributeTerm(values.new_attribute_term_name, resetForm)
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="col-xxs-12">
                                    <label className="form-label mb-3" htmlFor="parrent_attribute">Parent Attributes</label>
                                    <Field
                                        component="select"
                                        as="select"
                                        id="parrent_attribute"
                                        name="parrent_attribute"
                                        className="form-select"
                                        value={values.taxonomy}
                                        onChange={(e: any) => setChildAttrTaxonomy(e.target.value)}
                                    >
                                        {showData()}
                                    </Field>
                                </div>
                                <div className="col-xxs-12 mt-4">
                                    <label className="form-label mb-3" htmlFor="new_attribute_term_name">Name</label>
                                    <input
                                        type='text'
                                        id="new_attribute_term_name"
                                        name="new_attribute_term_name"
                                        className="form-control"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.new_attribute_term_name}

                                    />
                                    {touched.new_attribute_term_name && errors.new_attribute_term_name && (
                                        <div className='text-danger mt-2'>{errors.new_attribute_term_name}</div>
                                    )}
                                </div>
                                <div className="col-md-12 ">
                                    <button className='btn btn-success my-4' type="submit">Update</button>
                                    <button onClick={() => cancelEvent(resetForm)} className='btn btn-danger my-4 mx-4' type="submit">Cancel</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                    : (
                        <Formik
                            initialValues={{ ...initialValues }}
                            validationSchema={validateSchema} enableReinitialize={true}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                updateDataAttr(parentAttribute, values.new_attribute_name, resetForm)
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <div className='col-md-12 mt-1'>
                                            <label htmlFor='new_attribute_name' className=' form-label mb-3 d-flex align-items-center fs-7 fw-bold mb-2'>
                                                <span>Name</span>
                                            </label>
                                            <input
                                                type='text'
                                                id="new_attribute_name"
                                                className='form-control fs-7'
                                                name='new_attribute_name'
                                                value={values.new_attribute_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.new_attribute_name && errors.new_attribute_name && (
                                                <div className='text-danger mt-2'>{errors.new_attribute_name}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <button disabled={isSubmitting} className='btn btn-success my-4' type="submit">Update</button>
                                        <button onClick={() => cancelEvent(resetForm)} className='btn btn-danger my-4 mx-4' type="submit">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    )
                }

            </div >)
    }

    return (
        <div className='row mt-0 g-xl-8 bg-white rounded'>
            {parentAttributeList.length > 0 ? (
                <>
                    <div className='card-header border-0'>
                        <h3 className='card-title align-items-start flex-column'>
                            <p className='card-label fw-bolder fs-6 mb-1 mx-4'>{isEdit || isUpdateChild ? 'Edit Attributes' : 'Add New Attribute'}</p>
                        </h3>
                    </div>
                    <div className="col-xxl-6 mt-0 ">
                        <div className="card card-products">
                            {isEdit || isUpdateChild ? updateForm() : createForm()}
                        </div>
                    </div>
                    <div className="col-xxl-6 mt-0 pe-4 pb-8">
                        <div className="overflow-scroll me-7 py-0">
                            <ul style={{ maxHeight: "100vh" }} className='list-group pe-3 '>
                                {showList()}
                            </ul>
                        </div>
                    </div>
                </>) : (
                <div className='card mb-5 mb-xl-8 loading-wrapper'>
                    <div className='card-body py-3 loading-body'>
                        <AddinLoading />
                    </div>
                </div>)
            }
        </div >
    )
}

export default Attribute