import { Field, Formik } from 'formik'
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup'
import { RootState } from '../../../../setup';
import { AddinLoading } from '../../../../_metronic/partials';
import AlertMessage from '../../../../_metronic/partials/common/alert';
import { getAttributesById, updateAttr, createProductAttributeBrand, createTermsProductAttribute, updateAttributeTerms } from '../redux/ProductsList';

import { iListItem, iOption, iUpdateAttribute, iCreateValue, iCreateProductAttrPayload, iUpdateAttributeTerm, iCreateTermAttrPayload, iUpdateDataAttr } from './../../../../models'
import { accessToken } from '../../../../_metronic/helpers';

const Attribute: FC = () => {
    // Declare States
    const [parentAttributeList, setParentAttributeList] = useState<any[]>([])
    const [parentAttribute, setParentAttribute] = useState<string>('')
    const [message, setMessage] = useState<string>()
    const [childAttrTaxonomy, setChildAttrTaxonomy] = useState<string>('')
    const [childAttr, setchildAttr] = useState<string>('')
    const [childId, setChildId] = useState<number>(0)
    const [attrId, setAttrId] = useState<number>(0)
    const [isActiveIndex, setActiveIndex] = useState<number>();
    const [hasErrors, setHasErrors] = useState<boolean>(true)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isUpdateChild, setIsUpdateChild] = useState<boolean>(false)
    const [isUpdateChildWithAttr, setIsUpdateChildWithAttr] = useState<boolean>(false)
    const [isChildOpen, setIsChildOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Declare Variables
    const access_token = accessToken;
    const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
    const currentUserId = user ? user.ID : 0

    const createInitValue: iCreateValue = {
        name: '',
        parrent_attribute: '',
        parent_id: attrId
    }
    const updateChildAttrInitValue: iUpdateAttribute = {
        parent_id: attrId,
        new_attribute_term_name: childAttr,
        taxonomy: childAttrTaxonomy,
    }

    const createValidSchema = Yup.object().shape({
        name: Yup.string().required('Name is required!')
    })

    const initialValues = {
        new_attribute_name: parentAttribute
    }
    const validateSchema = Yup.object().shape({
        new_attribute_name: Yup.string().required('Name is required!')
    })


    const childUpdateValidateSchema = Yup.object().shape({
        new_attribute_term_name: Yup.string().required('Name is required!'),
    })


    const fetchData = () => {
        getAttributesById(currentUserId , access_token).then((res: any) => {
            const { code, data } = res.data
            if (code === 200) {
                setIsLoading(true)
                setParentAttributeList(data)
            }
        }).catch(err => console.log(err));
    }

    const editMode = () => {
        setIsEdit(true)
    }

    const afterSubmit = (isReset: boolean = true, resetForm: any, setSubmitting?: any) => {
        setSubmitting(false)
        if (isReset)
            resetForm()
        setTimeout(() => {
            setMessage('')
        }, 3500);
    }
    const updateUIAttr = (attrId: number = 0, label: any, taxonomy: string) => {
        const updatedList = parentAttributeList.map((item: any) => {
            if (attrId === item.id)
                return { ...item, id: attrId, label, value: taxonomy, name: taxonomy }
            return item
        })
        setParentAttributeList(updatedList)
    }

    const updateDataAttr = (old_attribute_name: string, new_attribute_name: string, resetForm: any, setSubmitting: any) => {
        const payload: iUpdateDataAttr = {
            old_attribute_name, new_attribute_name, access_token
        }
        updateAttr(payload).then(res => {
            const { code, message } = res.data
            setHasErrors(false)
            setMessage("Processing")
            if (code === 200) {
                setIsEdit(false)
                setIsUpdateChild(false)
                setMessage(message)
                updateUIAttr(attrId, new_attribute_name, childAttrTaxonomy)
                setAttrId(0)
                afterSubmit(false, resetForm, setSubmitting)
            }
            else {
                setHasErrors(true)
                setMessage(message)
                afterSubmit(true, resetForm, setSubmitting)
            }
        })
    }
    const updateUITermAttr = (attrID: number = 0, childID: number, label: string, taxonomy: string) => {
        if (!isUpdateChildWithAttr) {
            const list = [...parentAttributeList]
            const parentItem = list.find((item: any) => item.id === attrID)
            const options = parentItem?.options.map((item: any) => {
                if (childID === item.id)
                    return {
                        id: childID, label,
                        value: label,
                        attr: taxonomy
                    }
                return item
            })
            const result = { ...parentItem, options }
            // List without ParentItem
            const currentList = list.filter(item => item.id !== attrID)
            const newItems = [result, ...currentList]
            const newList = list.map(obj => newItems.find(o => o.id === obj.id) || obj);

            setParentAttributeList(newList)
        } else {
            const list = [...parentAttributeList]
            const parentItem = list.find((item: any) => item.label === parentAttribute)
            const options = parentItem.options.filter((item: any) => item.id !== childID)
            const oldParentResult = {
                ...parentItem, options
            }

            const newParentItem = list.find((item: any) => parseInt(item.id) === attrID)
            const result = {
                ...newParentItem, options: [...newParentItem?.options, {
                    id: childID,
                    label,
                    value: taxonomy,
                    attr: taxonomy
                }]
            }
            const newItems = [oldParentResult, result]
            const newList = list.map(obj => newItems.find(o => o.id === obj.id) || obj);
            setParentAttributeList(newList)
        }
    }

    const updateAttributeTerm = (new_attribute_term_name: string, resetForm: any, setSubmitting: any) => {
        const payload: iUpdateAttributeTerm = {
            id_term: childId,
            parent_id: attrId,
            new_attribute_term_name,
            access_token
        };

        updateAttributeTerms(payload).then(res => {
            const { code, message, data } = res.data
            setHasErrors(false)
            setMessage('Processing')
            setIsUpdateChildWithAttr(false);
            if (code === 200) {
                setIsEdit(false)
                setIsUpdateChild(false)
                setAttrId(0)
                setMessage(message)
                updateUITermAttr(attrId, childId, data.label, data.attr)
                afterSubmit(true, resetForm, setSubmitting)
            }
            else {
                setHasErrors(true)
                setMessage(message)
                afterSubmit(false, resetForm, setSubmitting)
            }
        })
    }

    const createUIAttr = (label: string, id: number, value: string, name: string) => {
        setParentAttributeList(prevData => [{ id, value, label, name, options: [] }, ...prevData])
    }

    const createProductAttr = (label_name: string, resetForm: any, setSubmitting: any) => {
        const payload: iCreateProductAttrPayload = {
            user_id: currentUserId,
            label_name, access_token
        }

        createProductAttributeBrand(payload).then(res => {
            const { code, message, data } = res.data
            setHasErrors(false)
            setMessage('Processing')
            if (code === 200) {
                setIsEdit(false)
                setMessage(message)
                setActiveIndex(undefined)
                createUIAttr(data.label, data.id, data.value, data.name)
                setIsUpdateChild(false)
                afterSubmit(true, resetForm, setSubmitting)
                setAttrId(0)
            }
            else {
                setHasErrors(true)
                setMessage(message)
                setSubmitting(false);
                afterSubmit(false, resetForm, setSubmitting)
            }
        }).catch(err => console.log(err))
    }

    const createUITermAttr = (id: number, label: string, value: string, attr: string) => {
        const parentItem = parentAttributeList.find((item: any) => item.name === attr)
        const options = parentItem.options && parentItem.options?.map((item: any) => item);
        const result = {
            ...parentItem, options: [...options, { id, label, value, attr }]
        }
        const filteredData = parentAttributeList.filter((item: any) => item.name !== attr)
        setParentAttributeList([result, ...filteredData])
    }

    const createProductTermAttr = (parent_id: string | number, term_name: string, resetForm: any, setSubmitting: any) => {
        const payload: iCreateTermAttrPayload = {
            term_name, parent_id, access_token
        }
        createTermsProductAttribute(payload).then(res => {
            const { code, message, data } = res.data
            setHasErrors(false)
            setMessage('processing')
            if (code === 200) {
                setMessage(message)
                createUITermAttr(data.id, data.label, data.value, data.attr)
                setIsEdit(false)
                setIsUpdateChild(false)
                setAttrId(0)
                afterSubmit(true, resetForm, setSubmitting)
            } else {
                setHasErrors(true)
                setMessage(message)
                setSubmitting(false)
                afterSubmit(false, resetForm, setSubmitting)
            }
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        fetchData();
    }, [])
    const toggleAttr = (index: number) => {
        setActiveIndex(isActiveIndex === index ? undefined : index);
    };

    const showData = () => parentAttributeList && parentAttributeList.map((attr: iListItem, index: number) => <option value={attr.id} key={index}>{attr.label}</option>)
    const showList = () => parentAttributeList ? parentAttributeList.map((attr: iListItem, index: number) => {
        const checkOpen = isActiveIndex === index;
        return <li key={index} className='list-group-item border border-bottom-1 p-2 mb-2 bg-body rounded'>
            <div className="d-flex justify-content-between align-items-center ms-4" >
                <div className='cursor-pointer' onClick={() => { toggleAttr(index) }}>
                    <span>{attr.label} </span>
                    <p className='badge bg-primary rounded-pill mx-2 mb-0 '>{attr.options ? attr?.options.length : 0}</p>
                </div>
                <button style={isChildOpen ? { pointerEvents: 'none' } : {}} className='btn-btn-success border-0 bg-transparent' aria-disabled="true" >
                    <p onClick={() => { editMode(); setParentAttribute(attr.label); setIsUpdateChild(false); setAttrId(attr.id); scrollToTop() }} className='badge bg-success mx-4 mb-0 cursor-pointer'>Edit</p>
                </button>
            </div>
            {
                checkOpen && <>
                    {!!attr.options && attr.options.map((i: iOption, index: number) =>
                        <div key={index + Math.random()} className="d-flex justify-content-between mt-4 align-items-center">
                            <p className='my-2 ms-8'>{i.label} </p>
                            <span onClick={() => { setIsUpdateChild(true); setChildId(i.id); setAttrId(attr.id); setChildAttrTaxonomy(i.attr); setchildAttr(i.label); setParentAttribute(attr.label); scrollToTop() }
                            } className='text-success cursor-pointer fs-6 me-8'>Edit</span>
                        </div>
                    )}
                </>
            }
        </li >
    }) : noItemFound()

    const cancelEvent = (resetForm: any) => {
        setIsEdit(false); setIsUpdateChild(false); resetForm(); setIsChildOpen(false)
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0)
    }
    // Create UI FORM   
    const createForm = () => {
        return (
            <div className='card-body py-0 ps-4 pe-0'>
                <Formik
                    initialValues={{ ...createInitValue }}
                    validationSchema={createValidSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        const { name } = values
                        attrId === 0 ? createProductAttr(name, resetForm, setSubmitting) : createProductTermAttr(attrId, name, resetForm, setSubmitting)
                    }}
                >
                    {({ values, errors, touched, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="col-xxs-12">
                                <label className="form-label mb-2" htmlFor="parrent_attribute">{attrId === 0 ? '' : 'Parent'} Attribute</label>
                                <Field
                                    component="select"
                                    as="select"
                                    id="parrent_attribute"
                                    name="parrent_attribute"
                                    className="form-select"
                                    value={attrId}
                                    onChange={(e: any) => { setAttrId(parseInt(e.target.value)) }}
                                >
                                    <option value="0">None</option>
                                    {showData()}
                                </Field>
                            </div>
                            <div className="col-xxs-12 mt-3">
                                <label className="form-label mb-2" htmlFor="name">{attrId === 0 ? 'Parent' : 'Child'} Attribute Name</label>
                                <Field
                                    component="input"
                                    type='text'
                                    id="name"
                                    name="name"
                                    value={values.name || ''}
                                    className="form-control fs-7"
                                />
                                {touched.name && errors.name && (
                                    <div className='text-danger mt-2'>{errors.name}</div>
                                )}
                            </div>
                            <div className="col-md-12">
                                <button disabled={isSubmitting} className='btn btn-success my-4' type="submit">Add New</button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div >)
    }
    // Update FORM 
    const updateForm = () => {
        return (
            <div className='card-body py-0 ps-4 pe-0'>
                {isUpdateChild ?
                    <Formik
                        initialValues={{ ...updateChildAttrInitValue }}
                        validationSchema={childUpdateValidateSchema} enableReinitialize={true}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            updateAttributeTerm(values.new_attribute_term_name, resetForm, setSubmitting)
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm }) => (

                            <form onSubmit={handleSubmit}>
                                <div className="col-xxs-12">
                                    <label className="form-label mb-2" htmlFor="parrent_attribute">Parent Attribute</label>
                                    <Field
                                        component="select"
                                        as="select"
                                        id="parrent_attribute"
                                        name="parrent_attribute"
                                        className="form-select"
                                        value={values.parent_id || 0}
                                        onChange={(e: any) => { setAttrId(parseInt(e.target.value)); setIsUpdateChildWithAttr(true) }}
                                    >
                                        {showData()}
                                    </Field>
                                </div>
                                <div className="col-xxs-12 mt-4">
                                    <label className="form-label mb-2" htmlFor="new_attribute_term_name">Child Attribute Name</label>
                                    <input
                                        type='text'
                                        id="new_attribute_term_name"
                                        name="new_attribute_term_name"
                                        className="form-control fs-7"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.new_attribute_term_name || ''}

                                    />
                                    {touched.new_attribute_term_name && errors.new_attribute_term_name && (
                                        <div className='text-danger mt-2'>{errors.new_attribute_term_name}</div>
                                    )}
                                </div>
                                <div className="col-md-12 ">
                                    <button disabled={isSubmitting} className='btn btn-success my-4' type="submit">Update</button>
                                    <button onClick={() => { cancelEvent(resetForm); }} className='btn btn-danger my-4 mx-4' type="submit">Cancel</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                    : (
                        <Formik
                            initialValues={{ ...initialValues }}
                            validationSchema={validateSchema} enableReinitialize={true}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                updateDataAttr(parentAttribute, values.new_attribute_name, resetForm, setSubmitting)
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <div className='col-md-12 mt-1'>
                                            <label htmlFor='new_attribute_name' className=' form-label mb-2 d-flex align-items-center fs-7 fw-bold mb-2'>
                                                <span>Name</span>
                                            </label>
                                            <input
                                                type='text'
                                                id="new_attribute_name"
                                                className='form-control fs-7 fs-7'
                                                name='new_attribute_name'
                                                value={values.new_attribute_name || ''}
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
                                        <button onClick={() => { cancelEvent(resetForm); }} className='btn btn-danger my-4 mx-4' type="submit">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    )
                }

            </div >)
    }

    const noItemFound = () => {
        return <div className="col-xxl-12 mt-0 pe-4 pb-8">
            <div style={{ height: "50vh" }}  >
                <p className='text-center fs-6'>No Item Found</p>
            </div>
        </div>
    }
    return (
        <>
            {isLoading ? (
                <div className='row mt-0 g-xl-8 bg-white rounded'>
                    <div className='card-header border-0'>
                        <h3 className='card-title align-items-start flex-column'>
                            <p className='card-label fw-bolder fs-6 mb-1 mx-4'>{isEdit || isUpdateChild ? 'Edit Attributes' : 'Add New Attribute'}</p>
                        </h3>
                    </div>
                    <div className="card-body mt-2">
                        <div className="row">
                            <div className="col-xxl-6 mt-0 col-md-6">
                                <div className="card card-products">
                                    {isEdit || isUpdateChild ? updateForm() : createForm()}
                                    <div className='ms-3'>
                                        {message && <AlertMessage hasErrors={hasErrors} message={message} />}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-6 mt-0 col-md-6 pe-4 pb-8">
                                <div className="border border-1 rounded p-6 "  >
                                    {parentAttributeList.length > 0 ? (
                                        <div style={{ height: "100vh" }} className="overflow-scroll">
                                            <ul className='ps-0 me-5 list-groupborder'>
                                                {showList()}
                                            </ul>
                                        </div>
                                    ) : noItemFound()
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            ) : <div className='card mb-5 mb-xl-8 loading-wrapper'>
                <div className='card-body py-3 loading-body'>
                    <AddinLoading />
                </div>
            </div>
            }
        </>
    )
}

export default Attribute 
