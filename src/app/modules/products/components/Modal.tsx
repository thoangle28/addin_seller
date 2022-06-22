import { Modal } from 'react-bootstrap-v5'
import { KTSVG } from '../../../../_metronic/helpers'
import { Formik } from 'formik'
import { createProductAttributeBrand, createTermsProductAttribute } from '../redux/ProductsList'
import { useState } from 'react'
import { access_token } from '../../../../_metronic/helpers'

const ModalAttr = (Props: any) => {
  const [formMessage, setFormMessage] = useState<string>('')
  const { showModal, onCloseModal, isAddAttr, user_id, taxonomy } = Props
  const [newAttr, setNewAttr] = useState<any>(null)
 
  const initialFormValues: any = {
    taxonomy: taxonomy,
    term_name: ''
  }
  const initialFormAttr: any = {
    taxonomy: taxonomy,
    term_name: ''
  }
  const handleHideModal = (newAttr: any) => {
    setFormMessage('')
    onCloseModal(newAttr)
  }
  const productAttributesBrand = (values: any) => {
    const payload = {
      user_id,
      label_name: values.term_name, access_token
    }
    createProductAttributeBrand(payload).then(res => {
      const { code, message, data } = res.data
      setFormMessage(message)
      if (code === 200) {
        const newAttr = { ...data }
        handleHideModal(newAttr)
      }
    }).catch(err => console.log(err))
  }

  const productAttributeValue = (values: any) => {
    const payload = {
      parent_id: Props.parentId,
      term_name: values.term_name, access_token
    }
    createTermsProductAttribute(payload).then(res => {
      const { code, message, data } = res.data
      setFormMessage(message)
      if (code === 200) {
        const newAttr = { ...data }
        handleHideModal(newAttr)
      }
    }).catch(err => console.log(err))
  }

  return (
    <Modal
      id='kt_modal_attributes'
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog-centered mw-350px h-auto'
      show={showModal}
    >
      <div className='container-xxl px-10 py-10'>
        <div className='modal-header d-flex border-0 p-0'>
          <h4>{isAddAttr ? 'Create New/Update Attribute' : 'Create New/Update Value'}</h4>
          <div
            className='btn btn-icon btn-sm btn-light-primary'
            onClick={handleHideModal}
          >
            <KTSVG className='svg-icon-2' path='/media/icons/duotune/arrows/arr061.svg' />
          </div>
        </div>

        <div className='modal-body px-0 py-0 pt-5'>
          <div className='modal-header d-flex border-0 p-0'>
            <p className='text-center text-danger'>{formMessage}</p>
          </div>
          <div
            className='stepper stepper-1 d-flex flex-column flex-xl-row flex-row-fluid'
            id='kt_modal_body'
          >
            <div className='w-100' style={{ overflow: "hidden", height: "auto" }}>
              <Formik
                initialValues={isAddAttr ? initialFormAttr : initialFormValues}
                /* validationSchema={ValidationSchema} */
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true)
                  isAddAttr ? productAttributesBrand(values) : productAttributeValue(values);
                  setSubmitting(false)
                }}
              >
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form
                    onSubmit={handleSubmit}
                    className='form'
                    noValidate
                    id='kt_modal_create_app_form'
                  >
                    <div className="form-group row">
                      <div className='col-md-12 mb-5'>
                        <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                          <span>{isAddAttr ? 'Attribute Name' : 'Value Name'}</span>
                        </label>
                        <input
                          type='text'
                          className='form-control fs-7'
                          name='term_name'
                          onChange={handleChange}
                          value={values.term_name}
                          placeholder=''
                          data-bs-toggle='tooltip'
                          data-bs-placement='top'
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className='col-xs-12 text-center'>
                        <button
                          type='submit'
                          className='btn btn-sm btn-primary me-1'
                          name='add-more-attr'
                          disabled={isSubmitting}
                        >
                          Create
                        </button>
                        <button
                          type='button'
                          onClick={handleHideModal}
                          className='btn btn-sm btn-danger ms-1'
                          name='add-more-close'
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>)}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalAttr