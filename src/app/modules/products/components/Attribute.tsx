import { Field, Form, Formik, FormikHelpers } from 'formik'
import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup'
import AlertMessage from '../../../../_metronic/partials/common/alert';
import { getAttributes, updateAttr } from '../redux/ProductsList';

interface Values {
    attribute: string;
    old_attribute_name: string;
    new_attribute_name: string;

}
const Attribute: FC = () => {
    const [parentAttribute, setParentAttribute] = useState<string[]>([])
    const [message, setMessage] = useState<string>()
    const [hasErrors, setHasErrors] = useState<boolean>(true)

    const initialValues = {
        attribute: '',
        old_attribute_name: '',
        new_attribute_name: ''
    }

    const validateSchema = Yup.object().shape({
        old_attribute_name: Yup.string().required('Old Attribute Must Be Required!').oneOf([Yup.ref('attribute'), null], 'Attribute have to match'),
        new_attribute_name: Yup.string().required('New Attribute Must Be Required!')
    })

    const fetchData = () => {
        getAttributes().then((res: any) => {
            setParentAttribute(res.data.data)
        }).catch(err => console.log(err));
    }

    const updateDataAttr = (old_attribute_name: string, new_attribute_name: string) => {
        updateAttr(old_attribute_name, new_attribute_name).then(res => {
            const { code, message } = res.data
            setMessage('processing')
            if (code === 200) {
                setHasErrors(false)
                setMessage(message)
                setTimeout(() => {
                    setMessage('')
                }, 3000);
            } else {
                setHasErrors(true)
                setMessage(message)
            }
        })
    }

    useEffect(() => {
        fetchData();
    }, [parentAttribute])


    const showData = () => !!parentAttribute && parentAttribute.map((attr: any) => <option key={attr.id}>{attr.label}</option>)

    const showEditForm = (touched: any, errors: any) => {

        return (
            <div className="form-group mt-4 row">
                <div className='col-md-6 mb-5'>
                    <label htmlFor='old_attribute_name' className='d-flex align-items-center fs-7 fw-bold mb-2'>
                        <span>Old Attribute</span>
                    </label>
                    <Field
                        component="input"
                        id="old_attribute_name"
                        type='text'
                        className='form-control fs-7'
                        name='old_attribute_name'
                        data-bs-toggle='tooltip'
                        data-bs-placement='top'
                    />
                    {touched.old_attribute_name && errors.old_attribute_name && (
                        <div className='text-danger mt-2'>{errors.old_attribute_name}</div>
                    )}
                </div>
                <div className='col-md-6 mb-5'>
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
        )
    }

    return (
        <div className="card card-products">
            <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-3 mb-1'>Edit Attributes</span>
                </h3>
            </div>
            <div className='card-body py-3'>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
                        console.log(values)
                        const { old_attribute_name, new_attribute_name } = values
                        updateDataAttr(old_attribute_name, new_attribute_name)
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>

                            {message && <AlertMessage hasErrors={hasErrors} message={message} />}
                            <label htmlFor="attribute">Select Parent Attributes</label>
                            <Field
                                component="select"
                                as="select"
                                id="attribute"
                                name="attribute"
                                className="form-select"
                            >
                                <option value="">None</option>
                                {showData()}
                            </Field>
                            {showEditForm(touched, errors)}
                            <div className="col-md-6">
                                <button className='btn btn-success my-4' type="submit">Submit</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default Attribute