import React, {FC, useEffect, useRef, useState} from 'react'
import {useFormik} from 'formik' //Formik, Form, FormikValues, ErrorMessage, 
import {shallowEqual, useSelector, connect, useDispatch, ConnectedProps} from 'react-redux'
import * as Yup from 'yup'
import Dropzone from 'react-dropzone'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import {useLocation} from 'react-router'
import * as detail from '../redux/CreateProductRedux'
import {RootState} from '../../../../setup'
import Select from 'react-select'
import {
  initialForm, styles, SubAttribues, TaxClass,
  ShippingClass, Categoies, Attribues, ProductsList,
  StockStatus, handleFileUpload
} from './formOptions'

const mapState = (state: RootState) => ({productDetail: state.productDetail})
const connector = connect(mapState, detail.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const ProductCreate: FC<PropsFromRedux> = (props) => {
  const dispatch = useDispatch()
  //get product id or create new
  const userLocation: any = useLocation()
  //console.log(userLocation)
  const {productId} = userLocation.state 

  const user: any = useSelector<RootState>(({auth}) => auth.user, shallowEqual)
  const currentUserId = user ? user.ID : 0
  const handleEditorChange = (content: any) => {
    console.log(content)
  }

  //useState
  const [shippingClass, setShippingClass] = useState([])
  const [productCategories, setProductCategory] = useState([])
  const [attribuesList, setAttribues] = useState([])
  const [productsList, setProductsList] = useState([])
  
  const [newPhotoGalleries, setNewPhotoGalleries] = useState([])
  const [newPhotos, setNewPhotoUpdated] = useState([])

  let product: any = []

  useEffect(() => {
    if (productId > 0) {
      dispatch(detail.actions.getProductDetail(currentUserId, productId))
    }

    setShippingClass(ShippingClass())
    setProductCategory(Categoies())
    setAttribues(Attribues())
    setProductsList(ProductsList(currentUserId))
  }, [])

  useEffect(() => {
    console.log(newPhotos)
    setNewPhotoGalleries(newPhotos)
    console.log(newPhotoGalleries)
  }, [newPhotos, newPhotoGalleries])

  const tabDefault: any = useRef(null)
  //get product info
  product = useSelector<RootState>(
    ({productDetail}) => productDetail.product,
    shallowEqual
  )

  if (product) {
    initialForm.name = product.name
    initialForm.content = product.product_content
    initialForm.is_variable = product.is_variable
    initialForm.type_product = product.type_product
    initialForm.inventory_sku = product.inventory_sku
    initialForm.attributes = product.attributes
    initialForm.variations = product.variations
    initialForm.photo_galleries = product.photo_galleries
    initialForm.new_photo_galleries = []
    initialForm.general_price = product.general_price
    initialForm.general_tax_status = product.general_tax_status
    initialForm.general_tax_class = product.general_tax_class
    initialForm.categories = product.categories
    initialForm.shipping_class_id = product.shipping_class_id
    initialForm.selectedAttr = ''
    initialForm.linked_products_upsell = product.linked_products_upsell
    initialForm.linked_products_cross_sell = product.linked_products_cross_sell
    initialForm.general_wallet_credit = product.general_wallet_credit
    initialForm.general_wallet_cashback = product.general_wallet_cashback
    initialForm.general_commission = product.general_commission
    //initialForm.inventory_stock_status = product.inventory_stock_status
  }

  //console.log(product)
  const is_simple = initialForm.is_variable ? 'variable' : 'simple'
  const [productType, setProductType] = useState(is_simple)
  const onChangeProducType = (event: any) => {
    const value = event.target.value
    setProductType(value)
  }

  const [selectedOption, setSelectedOption] = useState(null)
  const onChange = (option: any) => {
    setSelectedOption(option)
  }

  const [selectedAttr, setSelectedAttr] = useState('')
  const onChangeAttr = (option: any) => {
    setSelectedAttr(option)
  }

  const formik = useFormik({
    initialValues: initialForm,
    validationSchema: Yup.object({
      name: Yup.string().max(250, 'Must be 250 characters or less').required('Required'),
      content: Yup.string().required('Required'),
      /*email: Yup.string().email('Invalid email address').required('Required'),*/
    }),
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2))
      console.log(values)
    },
  })

  return (
    <>
      <div className='card mb-5 mb-xl-8'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Create Product</span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <form
            onSubmit={formik.handleSubmit}
            className='form'
            noValidate
            id='kt_modal_create_app_form'
          >
            <div className='current' data-kt-stepper-element='content'>
              <div className='w-100'>
                <div className='fv-row mb-5'>
                  <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                    <span className='required'>Product Title</span>
                  </label>
                  <input
                    name='name'
                    type='text'
                    className='form-control'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className='text-danger'>{formik.errors.name}</div>
                  ) : null}
                </div>
              </div>

              <div className='w-100'>
                <div className='fv-row mb-5'>
                  <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                    <span className='required'>Product Content</span>
                  </label>
                  <SunEditor
                    name='content'
                    onChange={handleEditorChange}
                    defaultValue={formik.values.content}
                    width='100%'
                    height='500px'
                    setDefaultStyle='font-family: Poppins, Helvetica, "sans-serif"; font-size: 14px;'
                    setOptions={{
                      buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['paragraphStyle', 'blockquote'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor', 'textStyle'],
                        ['removeFormat', 'outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                        ['table', 'link', 'image'], //[, 'video', 'audio']
                        ['codeView'],
                        //['fullScreen', 'showBlocks', 'preview', 'print', 'save', 'template'],
                      ],
                    }}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className='text-danger'>{formik.errors.name}</div>
                  ) : null}
                </div>
              </div>
              <div className='w-100'>
                <div className='row'>
                  <div className='col-md-9'>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                        <span className='required'>Photo Gallery</span>
                      </label>
                      <div className='row'>
                        <div className='col-md-5'>
                          <div className='form-group'>
                            <input
                              id="file"
                              name="new_photo_galleries"
                              type="file"
                              onChange={(event) => {
                                const files = event.currentTarget.files
                                if( files ) {
                                  const fileList = handleFileUpload(files)
                                  setNewPhotoUpdated(fileList)   
                                  formik.setFieldValue("new_photo_galleries", fileList)    
                                }                           
                                //formik.handleChange(event)
                              }}
                              multiple
                            />
                            <div>
                              { newPhotoGalleries.length }
                              { newPhotoGalleries && newPhotoGalleries.map((src: string, i:number) => {      
                                return (
                                  <div
                                    className='form-group image-input image-input-outline'
                                    key={'image_' + i}
                                  >
                                    <div className='image-input-wrapper w-75px h-75px overflow-hidden'>
                                      <img className='h-100' src={src} />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            {/* <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
                              {({getRootProps, getInputProps}) => (
                                <section className='notice d-flex bg-light-primary rounded border-primary border border-dashed py-5 px-2 dropzone dz-clickable'>
                                  <div {...getRootProps()}>
                                    <input {...getInputProps()} name='photo_galleries'/>
                                    <div className='dropzone-msg dz-message needsclick d-flex'>
                                      <i className='bi bi-file-earmark-arrow-up text-primary fs-3x'></i>
                                      <div className='ms-4'>
                                        <h3 className='fs-8 fw-bolder text-gray-900 mb-1'>
                                          Drop files here or click to upload.
                                        </h3>
                                        <span className='fs-8 fw-bold text-gray-400'>
                                          Set the product media gallery, upload up to 10 files.
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              )}
                            </Dropzone> */}
                          </div>
                        </div>
                        <div className='col-md-7'>
                          <div className='old-photo-galleries'>
                          {(formik.values.photo_galleries &&
                            formik.values.photo_galleries.map((image: any) => {
                              return (
                                <div
                                  className='form-group image-input image-input-outline'
                                  key={image.image_id}
                                >
                                  <div className='image-input-wrapper w-75px h-75px overflow-hidden'>
                                    <img className='h-100' src={image.src} />
                                  </div>
                                </div>
                              )
                            })) ||
                            null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                        <span className='required'>Thumbnail</span>
                      </label>
                      <div className='form-group image-input image-input-outline'>
                        {(product && product.thumbnail && (
                          <div className='image-input-wrapper w-75px h-75px overflow-hidden'>
                            <img className='h-100' id='product_thumbnail' src={product.thumbnail} />
                          </div>
                        )) ||
                          null}
                        <div className='form-text fs-8'>Allowed file types: png, jpg, jpeg.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='rounded border p-5'>
                <div className='w-100'>
                  <div className='fv-row mb-10'>
                    <div className='row d-flex align-items-center'>
                      <div className='col-md-3'>
                        <label className='fs-6 fw-bold'>
                          <span className='required'>Product Type</span>
                        </label>
                      </div>
                      <div className='col-md-5'>
                        <select
                          name='type_product'
                          className='form-select'
                          value={formik.values.type_product}
                          onChange={(e) => {
                              onChangeProducType(e)
                              formik.handleChange(e)
                            }
                          }
                        >
                          <option value='simple'>Simple product</option>
                          <option value='variable'>Variable product</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='w-100'>
                  <div className='fv-row mb-5'>
                    <div className='row d-flex'>
                      <div className='col-md-4 col-lg-3'>
                        <ul className='nav nav-tabs nav-pills flex-row border-0 flex-md-column me-5 mb-3 mb-md-0 fs-6'>
                          <li className='nav-item me-0'>
                            <a
                              className='nav-link active btn btn-flex btn-active-secondary w-100'
                              data-bs-toggle='tab'
                              id='tab_general'
                              href='#general_pane'
                              ref={tabDefault}
                            >
                              <span className='d-flex flex-column align-items-start'>
                                <span>General</span>
                              </span>
                            </a>
                          </li>
                          <li className='nav-item me-0'>
                            <a
                              className='nav-link btn btn-flex btn-active-secondary w-100'
                              data-bs-toggle='tab'
                              href='#category_pane'
                            >
                              <span className='d-flex flex-column align-items-start'>
                                <span>Cagatories</span>
                              </span>
                            </a>
                          </li>
                          <li className='nav-item me-0'>
                            <a
                              className='nav-link btn btn-flex btn-active-secondary w-100'
                              data-bs-toggle='tab'
                              href='#kt_vtab_pane_5'
                            >
                              <span className='d-flex flex-column align-items-start'>
                                <span>Inventory</span>
                              </span>
                            </a>
                          </li>
                          <li className='nav-item me-0'>
                            <a
                              className='nav-link btn btn-flex btn-active-secondary w-100'
                              data-bs-toggle='tab'
                              href='#kt_vtab_pane_6'
                            >
                              <span className='d-flex flex-column align-items-start'>
                                <span>Shipping</span>
                              </span>
                            </a>
                          </li>
                          <li className='nav-item me-0'>
                            <a
                              className='nav-link btn btn-flex btn-active-secondary w-100'
                              data-bs-toggle='tab'
                              href='#linked_products_pane'
                            >
                              <span className='d-flex flex-column align-items-start'>
                                <span>Linked Products</span>
                              </span>
                            </a>
                          </li>
                          <li className='nav-item me-0'>
                            <a
                              className='nav-link btn btn-flex btn-active-secondary w-100'
                              data-bs-toggle='tab'
                              href='#kt_vtab_pane_7'
                            >
                              <span className='d-flex flex-column align-items-start'>
                                <span>Attributes</span>
                              </span>
                            </a>
                          </li>
                          {productType === 'variable' ? (
                            <li className='nav-item me-0'>
                              <a
                                className='nav-link btn btn-flex btn-active-secondary w-100'
                                data-bs-toggle='tab'
                                href='#kt_vtab_pane_8'
                              >
                                <span className='d-flex flex-column align-items-start'>
                                  <span>Variations</span>
                                </span>
                              </a>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                      <div className='col-md-8 col-lg-9'>
                        <div className='tab-content rounded border p-5  h-100'>
                          {/* General */}
                          <div className='tab-pane fade active show' id='general_pane'>
                            {productType !== 'variable' ? (
                              <div className='form-group row'>
                                <div className='col-md-6 mb-5'>
                                  <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                    <span>Regular Rrice</span>
                                  </label>
                                  <div className='input-group'>
                                    <span className='input-group-text'>$</span>
                                    <input
                                      type='number'
                                      className='form-control'
                                      name='general_price'
                                      step='0.1'
                                      placeholder=''
                                      value={formik.values.general_price}
                                      onChange={formik.handleChange}
                                    />
                                  </div>
                                </div>
                                <div className='col-md-6 mb-5'>
                                  <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                    <span>Sale Price</span>
                                  </label>
                                  <div className='input-group'>
                                    <span className='input-group-text'>$</span>
                                    <input
                                      type='number'
                                      className='form-control'
                                      name='salePrice'
                                      step='0.1'
                                      placeholder=''
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            <div className='form-group row'>
                              <div className='col-md-6 mb-5'>
                                <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                  <span>Tax status</span>
                                </label>
                                <select
                                  name='general_tax_status'
                                  className='form-select'
                                  value={formik.values.general_tax_status}
                                  onChange={formik.handleChange}
                                >
                                  <option value='taxable'>Taxable</option>
                                  <option value='shipping'>Shipping only</option>
                                  <option value='none'>None</option>
                                </select>
                              </div>
                              <div className='col-md-6 mb-5'>
                                <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                  <span>Tax class</span>
                                </label>
                                <select
                                  name='general_tax_class'
                                  className='form-select me-2'
                                  value={formik.values.general_tax_class}
                                  onChange={formik.handleChange}
                                >
                                  {TaxClass && TaxClass.map((item: any, i: number) => {
                                      return(
                                        <option key={item.value} value={item.value}>{item.label}</option>
                                      )
                                    })
                                  }
                                </select>                                
                              </div>
                            </div>
                            <div className='form-group row'>
                              <div className='col-md-4 mb-5'>
                                <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                  <span>Wallet Credit</span>
                                </label>
                                <input
                                  type='text'
                                  className='form-control'
                                  name='general_wallet_credit'
                                  value={formik.values.general_wallet_credit}
                                  onChange={formik.handleChange}
                                />
                              </div>
                              <div className='col-md-4 mb-5'>
                                <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                  <span>Wallet Cashback</span>
                                </label>
                                <input
                                  type='text'
                                  className='form-control'
                                  name='general_wallet_cashback'
                                  value={formik.values.general_wallet_cashback}
                                  onChange={formik.handleChange}
                                />
                              </div>
                              <div className='col-md-4 mb-5'>
                                <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                  <span>Commission (Fixed):</span>
                                </label>
                                <input
                                  type='number'
                                  className='form-control'
                                  name='general_commission'
                                  value={formik.values.general_commission}
                                  onChange={formik.handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          {/* Invetory */}
                          <div className='tab-pane fade' id='kt_vtab_pane_5'>
                            <div className='form-group row'>
                              <div className='col-md-12 mb-5'>
                                <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                  <span>SKU</span>
                                </label>
                                <input
                                  type='text'
                                  className='form-control'
                                  name='inventory_sku'
                                  onChange={formik.handleChange}
                                  value={formik.values.inventory_sku}
                                  placeholder=''
                                  data-bs-toggle='tooltip'
                                  data-bs-placement='top'
                                />
                                <div className='text-muted fs-7 mt-3'>
                                  SKU refers to a Stock-keeping unit, a unique identifier for each
                                  distinct product and service that can be purchased.
                                </div>
                              </div>
                            </div>
                            {productType !== 'variable' ? (
                              <div className='form-group row'>
                                <div className='col-md-12 mb-5'>
                                  <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                    <span>Stock Status</span>
                                  </label>
                                  <select
                                    name='inventory_stock_status'
                                    className='form-select'
                                    value={formik.values.inventory_stock_status}
                                    onChange={formik.handleChange}
                                  >
                                    {StockStatus &&
                                      StockStatus.map((item: any) => {
                                        return (
                                          <option key={item.value} value={item.value}>
                                            {item.label}
                                          </option>
                                        )
                                      })}
                                  </select>                                 
                                  <div className='text-muted fs-7 mt-3'>
                                    Controls whether or not the product is listed as "in stock" or
                                    "out of stock" on the frontend.
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          {/* Shipping Class */}
                          <div className='tab-pane fade' id='kt_vtab_pane_6'>
                            <div className='form-group row'>
                              <div className='col-md-12 mb-5'>
                                <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                  <span>Shipping Class</span>
                                </label>
                                <select
                                  name='shipping_class_id'
                                  className='form-select'
                                  value={formik.values.shipping_class_id}
                                  onChange={formik.handleChange}
                                >
                                  <option value='-1'>No shipping class</option>
                                  {shippingClass &&
                                    shippingClass.map((item: any) => {
                                      return (
                                        <option key={item.value} value={item.value}>
                                          {item.label}
                                        </option>
                                      )
                                    })}
                                </select>
                                <div className='text-muted fs-7 mt-3'>
                                  Shipping classes are used by certain shipping methods to group
                                  similar products.
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Attribues */}
                          <div className='tab-pane fade' id='kt_vtab_pane_7'>
                            <div className='form-group row'>
                              <div className='col-md-12 mb-5'>
                                <div className='d-flex align-items-center'>
                                  <label className='d-flex align-items-center fs-6 fw-bold'>
                                    <span>Custom Product Attribute</span>
                                  </label>
                                </div>
                              </div>
                              <div className='col-md-9 mb-5'>
                                <div className='d-flex align-items-center'>
                                  <Select
                                    styles={styles}
                                    closeMenuOnSelect={true}
                                    isMulti={false}
                                    isSearchable
                                    defaultValue={selectedAttr}
                                    onChange={onChangeAttr}
                                    options={attribuesList}
                                    name='attributes'
                                    className='w-100'
                                  />                                 
                                </div>
                              </div>
                              <div className='col-md-3 mb-5'>
                                <button
                                  /* onClick={prevStep} */
                                  type='button'
                                  className='btn btn-sm btn-primary'
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                            {/** */}
                            <div className='accordion' id='product_attribute'>
                              {(formik.values.attributes 
                                && formik.values.attributes.map((attr: any, i: number) => {
                                const subAttribues = SubAttribues(attr.name)
                                return(
                                   <div className='accordion-item' key={attr.name || attr.id}>
                                    <h2 className='accordion-header' id={'product_attribute_header_' + attr.id}>
                                      <button
                                        className='accordion-button fs-6 fw-bold p-3 collapsed'
                                        type='button'
                                        data-bs-toggle='collapse'
                                        data-bs-target={'#product_attribute_body_' + attr.id}
                                        aria-expanded='false'
                                        aria-controls={'product_attribute_body_' + attr.id}
                                      >
                                        {attr.title}
                                      </button>
                                    </h2>
                                    <div
                                      id={'product_attribute_body_' + attr.id}
                                      className='accordion-collapse collapse'
                                      aria-labelledby={'product_attribute_header_' + attr.id}
                                      data-bs-parent='#product_attribute'
                                    >
                                      <div className='accordion-body p-3'>
                                        <div className='row'>
                                          <div className='col-md-6'>
                                            <label>Name</label>
                                            <div className='fw-bold fs-6'>{attr.title}</div>
                                            <div className='mt-5'>
                                              <div className='form-check form-check-custom form-check-solid mb-3'>
                                                <label className='form-check-label ms-0 d-flex align-items-center'>
                                                  <input
                                                    type='checkbox'
                                                    name={`attributes[${i}].visible`}
                                                    className='form-check-input me-2'                                                    
                                                    checked={attr.visible}    
                                                    value={attr.visible}                                          
                                                    onChange={formik.handleChange}
                                                  />
                                                  Visible on the product page
                                                </label>
                                              </div>
                                              <div className='form-check form-check-custom form-check-solid'>
                                                <label className='form-check-label ms-0 d-flex align-items-center'>
                                                  <input
                                                    type='checkbox'
                                                    name={`attributes[${i}].variation`}
                                                    className='form-check-input me-2'                                                   
                                                    checked={attr.variation}
                                                    value={attr.variation}  
                                                    onChange={formik.handleChange}                   
                                                  />
                                                  Used for variations
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className='col-md-6'>
                                            <label>Value(s)</label>
                                            <Select
                                              styles={styles}
                                              closeMenuOnSelect={false}
                                              isMulti
                                              isSearchable
                                              defaultValue={attr.options}
                                              onChange={(selectedOption) => {
                                                let event = { target: { name: `attributes[${i}].options`, value: selectedOption }}
                                                formik.handleChange(event)
                                              }}
                                              options={subAttribues}
                                              name={`attributes[${i}].options`}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })) || null } 
                            </div>
                            {/** */}
                          </div>
                          {/* End Attribues */}
                          {/* Variants */}
                          {productType === 'variable' ? (
                            <div className='tab-pane fade' id='kt_vtab_pane_8'>
                              <div className='variants form-group'>
                                {/** begin variant */}
                                {formik.values.variations &&
                                  formik.values.variations.map((variation: any, i: number) => {
                            
                                    const {sku, regular_price, sale_price, wallet_cashback,
                                      shipping_class_id, tax_class, enabled } = formik.values.variations[i]
                                    return (
                                      <div className='row' key={variation.id}>
                                        <div className='accordion' id={'variation_' + variation.id}>
                                          <div className='accordion-item border-0'>
                                            <div
                                              className='accordion-header'
                                              id={'variation_' + variation.id + '_header'}
                                            >
                                              <div className='col-md-12 d-flex align-items-center'>
                                                <div className='me-2'>
                                                  <label className='fw-bold'>#{variation.id}</label>
                                                </div>
                                                <select
                                                  name='StockStatus'
                                                  className='form-select me-2'
                                                >
                                                  <option value={1}>Text 1</option>
                                                  <option value={2}>Text 2</option>
                                                  <option value={3}>Text 1</option>
                                                </select>
                                                <select
                                                  name='StockStatus1'
                                                  className='form-select me-2'
                                                >
                                                  <option value={1}>Text 1</option>
                                                  <option value={2}>Text 2</option>
                                                  <option value={3}>Text 1</option>
                                                </select>
                                                <a
                                                  href='#'
                                                  className='accordion-button fs-6 fw-bold collapsed w-250px bg-white'
                                                  data-bs-toggle='collapse'
                                                  data-bs-target={
                                                    '#variation_' + variation.id + '_body'
                                                  }
                                                  aria-expanded='false'
                                                  aria-controls={
                                                    'variation_' + variation.id + '_body'
                                                  }
                                                >
                                                  Edit
                                                </a>
                                              </div>
                                            </div>
                                            <div
                                              id={'variation_' + variation.id + '_body'}
                                              className='accordion-collapse collapse'
                                              aria-labelledby={
                                                'variation_' + variation.id + '_header'
                                              }
                                              data-bs-parent={'#variation_' + variation.id}
                                            >
                                              <div className='accordion-body'>
                                                <div className='row mb-4'>
                                                  <div className='col-md-4'>
                                                    <div className='form-group image-input image-input-outline'>
                                                      {(variation && variation.thumbnail && (
                                                        <div className='image-input-wrapper w-75px h-75px overflow-hidden'>
                                                          <img
                                                            className='h-100 variation_thumbnail'
                                                            src={variation.thumbnail}
                                                          />
                                                        </div>
                                                      )) ||
                                                        null}
                                                    </div>
                                                  </div>
                                                  {/*upload image */}
                                                  <div className='col-md-8'>
                                                    <div className='form-group mb-4'>
                                                      <Dropzone
                                                        onDrop={(acceptedFiles) =>
                                                          console.log(acceptedFiles)
                                                        }
                                                      >
                                                        {({getRootProps, getInputProps}) => (
                                                          <section className='notice d-flex bg-light-primary rounded border-primary border border-dashed p-6 dropzone dz-clickable'>
                                                            <div {...getRootProps()}>
                                                              <input {...getInputProps()} />
                                                              <div className='dropzone-msg dz-message needsclick d-flex'>
                                                                <i className='bi bi-file-earmark-arrow-up text-primary fs-3x'></i>
                                                                <div className='ms-4'>
                                                                  <h3 className='fs-7 fw-bolder text-gray-900 mb-1'>
                                                                    Drop files here or click to
                                                                    upload.
                                                                  </h3>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </section>
                                                        )}
                                                      </Dropzone>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className='row'>
                                                  <div className='form-group mb-4 col-md-4'>
                                                    <div className='form-check form-check-custom form-check-solid mb-4'>
                                                      <label className='form-check-label ms-0 d-flex align-items-center'>
                                                        <input
                                                          type='checkbox'
                                                          name={`variations[${i}].enabled`}
                                                          className='form-check-input me-2'                                                    
                                                          checked={enabled ? true : false}    
                                                          value={enabled}                                          
                                                          onChange={formik.handleChange}
                                                        />
                                                        Enabled
                                                      </label>
                                                    </div>
                                                  </div>
                                                  <div className='form-group mb-4 col-md-8'>
                                                    <label className='fs-6 fw-bold mb-2'>
                                                      SKU
                                                    </label>
                                                    <input
                                                      type='text'
                                                      className='form-control'
                                                      name={`variations[${i}].sku`}
                                                      value={sku}
                                                      onChange={formik.handleChange}
                                                      onBlur={formik.handleBlur}
                                                    />
                                                  </div>
                                                </div>
                                                <div className='row'>
                                                  <div className='col-md-12'>
                                                    <div className='row'>
                                                      <div className='col-md-6 form-group mb-4'>
                                                        <label className='fs-6 fw-bold mb-2'>
                                                          Wallet Cashback
                                                        </label>
                                                        <input
                                                          type='text'
                                                          className='form-control'
                                                          placeholder=''
                                                          name={`variations[${i}].wallet_cashback`}
                                                          value={wallet_cashback || ''}
                                                          onChange={formik.handleChange}
                                                          onBlur={formik.handleBlur}
                                                          data-bs-toggle='tooltip'
                                                          data-bs-delay-show='1000'
                                                          data-bs-placement='top'
                                                          title='Enter an exact value, or a value ending with % to give a percentage or leave empty for no cashback'
                                                        />
                                                      </div>
                                                      <div className='col-md-6 form-group mb-4'>
                                                        <label className='fs-6 fw-bold mb-2'>
                                                          Stock status
                                                        </label>
                                                        <select
                                                          name='vStockStatus'
                                                          className='form-select me-2'
                                                        >
                                                          <option value='instock'>In stock</option>
                                                          <option value='outofstock'>
                                                            Out of stock
                                                          </option>
                                                          <option value='onbackorder'>
                                                            On backorder
                                                          </option>
                                                        </select>
                                                      </div>
                                                    </div>
                                                    <div className='row'>
                                                      <div className='col-md-6 form-group mb-4'>
                                                        <label className='fs-6 fw-bold mb-2'>
                                                          Regular Price ($)
                                                        </label>
                                                        <input
                                                          type='text'
                                                          className='form-control'
                                                          name={`variations[${i}].regular_price`}
                                                          value={regular_price || ''}
                                                          onChange={formik.handleChange}
                                                          onBlur={formik.handleBlur}
                                                        />
                                                      </div>
                                                      <div className='col-md-6 form-group mb-4'>
                                                        <label className='fs-6 fw-bold mb-2'>
                                                          Sale Price ($)
                                                        </label>
                                                        <input
                                                          type='text'
                                                          className='form-control'
                                                          name={`variations[${i}].sale_price`}
                                                          value={sale_price || ''}
                                                          onChange={formik.handleChange}
                                                          onBlur={formik.handleBlur}
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className='row'>
                                                      <div className='col-md-6 form-group mb-4'>
                                                        <label className='fs-6 fw-bold mb-2'>
                                                          Shipping class
                                                        </label>
                                                        <select
                                                          name={`variations[${i}].shipping_class_id`}
                                                          className='form-select'
                                                          value={shipping_class_id}
                                                          onChange={formik.handleChange}
                                                        >
                                                          <option value='-1'>No shipping class</option>
                                                          {shippingClass &&
                                                            shippingClass.map((item: any) => {
                                                              return (
                                                                <option key={item.value} value={item.value}>
                                                                  {item.label}
                                                                </option>
                                                              )
                                                            })}
                                                        </select>                                                      
                                                      </div>
                                                      <div className='col-md-6 mb-4'>
                                                        <label className='fs-6 fw-bold mb-2'>
                                                          Tax class
                                                        </label>                                                       
                                                        <select
                                                          name={`variations[${i}].tax_class`}
                                                          className='form-select me-2'
                                                          value={tax_class}
                                                          onChange={formik.handleChange}
                                                        >
                                                            {TaxClass && TaxClass.map((item: any, i: number) => {
                                                            return(
                                                              <option key={item.value} value={item.value}>{item.label}</option>
                                                            )
                                                          })
                                                        }
                                                        </select>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <hr className='col-md-12 mt-3 mb-3' />
                                      </div>
                                    )
                                  })}
                                {/** end variant */}
                              </div>
                            </div>
                          ) : null}
                          {/* End Variants */}
                          <div className='tab-pane fade' id='linked_products_pane'>
                            <div className='col-md-12 mb-5'>
                              <div className='uppselles'>
                                <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                  <span>Upsells</span>
                                </label>
                                <Select
                                  styles={styles}
                                  closeMenuOnSelect={false}
                                  isMulti
                                  isSearchable
                                  defaultValue={formik.values.linked_products_upsell}
                                  onChange={(selectedOption) => {
                                    let event = { target: { name: 'linked_products_upsell', value: selectedOption }}
                                    formik.handleChange(event)
                                  }}
                                  options={productsList}
                                  name='linked_products_upsell'
                                />
                              </div>
                              <div className='text-muted fs-8 mt-3'>
                                Upsells are products which you recommend instead of the currently
                                viewed product, for example, products that are more profitable or
                                better quality or more expensive.
                              </div>
                            </div>
                            <div className='col-md-12 mb-5'>
                              <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                <span>Cross-sells</span>
                              </label>
                              <Select
                                styles={styles}
                                closeMenuOnSelect={false}
                                isMulti
                                isSearchable
                                defaultValue={formik.values.linked_products_cross_sell}
                                onChange={(selectedOption) => {
                                  let event = { target: { name: 'linked_products_cross_sell', value: selectedOption }}
                                  formik.handleChange(event)
                                }}
                                options={productsList}
                                name='linked_products_cross_sell'
                              />
                              <div className='text-muted fs-8 mt-3'>
                                Cross-sells are products which you promote in the cart, based on the
                                current product.
                              </div>
                            </div>
                          </div>
                          {/** category_pane  */}
                          <div className='tab-pane fade' id='category_pane'>
                            <div className='col-md-12 mb-5'>
                              <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                                <span>Categories</span>
                              </label>
                              <div className='form-group'>
                              <Select
                                styles={styles}
                                closeMenuOnSelect={false}
                                isMulti
                                isSearchable
                                defaultValue={formik.values.categories}
                                onBlur={()=>{
                                  formik.handleBlur({ target: {name:'categories'} });
                                }}
                                onChange={selectedOption => {
                                  let event = { target : { name:'categories', value: selectedOption}}
                                  formik.handleChange(event)
                                }}
                                options={productCategories}
                                name='categories'
                              />                          
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='pt-10 justify-content-center mb-5'>
                <div className='me-0 d-flex flex-stack '>
                  <button
                    /* onClick={prevStep} */
                    type='submit'
                    className='btn btn-lg btn-primary w-100 me-3'
                    data-kt-stepper-action='previous'
                  >
                    Create Product
                  </button>
                  <button
                    /* onClick={prevStep} */
                    type='button'
                    className='btn btn-lg btn-success w-100 ms-3'
                    data-kt-stepper-action='previous'
                  >
                    Create &amp; Continue
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default connector(ProductCreate)
