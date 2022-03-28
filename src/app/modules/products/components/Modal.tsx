import {Modal} from 'react-bootstrap-v5'
import { KTSVG } from '../../../../_metronic/helpers'
import {Formik} from 'formik'

const ModalAttr = (Props: any) => {
  const { showModal, onCloseModal } = Props

  const initialFormValues: any = []

  const handleHideModal = () => {
    onCloseModal(false)
  }

  return(
    <Modal
      id='kt_modal_attributes'
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog-centered mw-350px h-auto'
      show={showModal}
      >
      <div className='container-xxl px-10 py-10'>
        <div className='modal-header d-flex border-0 p-0'>
            <h3>Creat New/Update Attriute</h3>
            <div 
              className='btn btn-icon btn-sm btn-light-primary'
              onClick={handleHideModal}
            >
              <KTSVG className='svg-icon-2' path='/media/icons/duotune/arrows/arr061.svg' />
            </div>
        </div>

        <div className='modal-body px-0 py-0 pt-5'>
            <div
            className='stepper stepper-1 d-flex flex-column flex-xl-row flex-row-fluid'
            id='kt_modal_body'
            >
            <div className='w-100' style={{ overflow: "hidden", height: "auto"}}>  
              <Formik
                initialValues={initialFormValues}
                /* validationSchema={ValidationSchema} */
                enableReinitialize={true}
                onSubmit={(values, {setSubmitting}) => {
                }}
              >
                {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                resetForm,
                setFieldValue,
                /* and other goodies */
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
                      <span>Attrite Name</span>
                    </label>
                    <input
                      type='text'
                      className='form-control fs-7'
                      name='name'
                      onChange={handleChange}
                      value={values.name}
                      placeholder=''
                      data-bs-toggle='tooltip'
                      data-bs-placement='top'
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className='col-xs-12 text-center'>
                    <button
                      onClick={(event) => {
                      /*   handleAddMoreAttributes(values)
                        handleChange(event) */
                      }}
                      type='button'
                      className='btn btn-sm btn-primary me-1'
                      name='add-more-attr'
                    >
                      Create
                    </button>
                    <button
                      onClick={(event) => {
                      /*   handleAddMoreAttributes(values)
                        handleChange(event) */
                      }}
                      type='button'
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