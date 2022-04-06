import { Field, Form, Formik, FormikHelpers } from 'formik'
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup'
import { RootState } from '../../../../setup';
import AlertMessage from '../../../../_metronic/partials/common/alert';
import { getAttributesById, updateAttr } from '../redux/ProductsList';

interface Values {
    old_attribute_name: string;
    new_attribute_name: string;

}
const Attribute: FC = () => {
    const [parentAttribute, setParentAttribute] = useState<string[]>([])
    const [message, setMessage] = useState<string>()
    const [hasErrors, setHasErrors] = useState<boolean>(true)

    const user: any = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)
    const currentUserId = user ? user.ID : 0

    const initialValues = {
        old_attribute_name: '',
        new_attribute_name: ''
    }

    const validateSchema = Yup.object().shape({
        old_attribute_name: Yup.string().required('Old Attribute is Required!'),
        new_attribute_name: Yup.string().required('New Attribute is Required!')
    })

    const fetchData = () => {
        getAttributesById(currentUserId).then((res: any) => {
            setParentAttribute(res.data.data)
        }).catch(err => console.log(err));
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

    useEffect(() => {
        fetchData();
    }, [])


    const showData = () => !!parentAttribute && parentAttribute.map((attr: any) => <option key={attr.id}>{attr.label}</option>)

    const showEditForm = (touched: any, errors: any) => {

        return (
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
                    onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>,) => {
                        const { old_attribute_name, new_attribute_name } = values
                        updateDataAttr(old_attribute_name, new_attribute_name, resetForm)
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>

                            {message && <AlertMessage hasErrors={hasErrors} message={message} />}
                            <label htmlFor="old_attribute_name">Select Parent Attributes</label>
                            <Field
                                component="select"
                                as="select"
                                id="old_attribute_name"
                                name="old_attribute_name"
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