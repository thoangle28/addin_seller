import React, {FC, useEffect, useRef, useState} from 'react'
import {Formik} from 'formik'
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
  initialForm,
  styles,
  SubAttributes,
  TaxClass,
  getInitialFormValues,
 /*  ShippingClass,
  Categoies,
  Attributes,
  ProductsList, */
  StockStatus,
  handleFileUpload,
  UploadImageField,
  FallbackView,
  fetchProfileData,
  postProduct,
  mapValuesToForm
} from './formOptions'

const mapState = (state: RootState) => ({productDetail: state.productDetail})
const connector = connect(mapState, detail.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const ProductCreate: FC<PropsFromRedux> = (props) => {
  const dispatch = useDispatch()
  //get product id or create new
  const userLocation: any = useLocation()
  const {productId} = userLocation.state ? userLocation.state : 0

  //const user: any = useSelector<RootState>(({auth}) => auth.user, shallowEqual)
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const { accessToken, user } = auth
  const currentUserId: number = user ? user.ID : 0

  //useState
  const [loading, setLoading] = useState(true)
  const [isNewProduct, setNewProduct] = useState(true)
  const [shippingClass, setShippingClass] = useState([])
  const [productCategories, setProductCategory] = useState([])
  const [attributesList, setAttributes] = useState([])
  const [fullAttributesList, setFullAttributes] = useState([])
  const [productsList, setProductsList] = useState([])
  const [productType, setProductType] = useState('simple')
  const [newPhotoGalleries, setNewPhotoGalleries] = useState<any>([])
  const [newThumbnail, setNewThumbnail] = useState('')
  const [selectedAttr, setSelectedAttr] = useState({value: '', label: ''})
  const [selectedVar, setSelectedVar] = useState({value: '', label: ''})
 
  //---------------------------------------------------------------------------
  const tabDefault: any = useRef(null)
  //Get product info from cache
  let product: any = []
  product = useSelector<RootState>(({productDetail}) => productDetail.product, shallowEqual)

  //Get All Properties  
  const promise = fetchProfileData( currentUserId );

  useEffect(() => {
    promise.then((data: any) => {
      
      setShippingClass(data.shippingClass)
      setProductCategory(data.categories)
      setProductsList(data.productsList)

      const {termsList, fullList} = data.attributes
      setAttributes(termsList)
      setFullAttributes(fullList)
    });
  }, []);
  
  /**
   * Get Product Details
   */
  useEffect(() => {
    if (product && productId > 0 && product.id === productId) {
      mapValuesToForm(initialForm, product)
      setProductType(initialForm.type_product)
      setNewProduct(false)
      setLoading(false)
    } else {
      setNewProduct(true)
      setProductType('simple')
      if (productId > 0) dispatch(detail.actions.getProductDetail(currentUserId, productId))
      else {
        setLoading(false)
      }
    }
  }, [product, productId])

  /**
   * The events on the form
   * @param event
   */
  const onChangeProducType = (event: any) => {
    const value = event.target.value
    setProductType(value)
  }

  const onChangeAttr = (option: any) => {
    setSelectedAttr(option)
  }

  const onChangeVar = (option: any) => {
    setSelectedVar(option)
  }

  /* Add more Attributes */
  const handleAddMoreAttributes = (formValues: any) => {
    if (!selectedAttr) return
    const {value} = selectedAttr
    const isAdded = formValues.attributes.some((x: any) => x.id === value)

    if (isAdded) return
    const attrFound = fullAttributesList.find((x: any) => x.id === value)
    //reset
    setSelectedAttr({value: '', label: ''})
    if (!attrFound) return
    else formValues.attributes.push(attrFound)

    mapValuesToForm(initialForm, formValues)
  }

  /**
   * Remove Attribute
   */
  const removeAttribute = (id: number, formValues: any) => {
    const afterFilter = formValues.attributes.filter((x: any) => x.id !== id)
    formValues.attributes = afterFilter
    mapValuesToForm(initialForm, formValues)
  }

  /**
   * Remove Attribute
   */
  const removeVariations = (id: number, formValues: any) => {
    const afterFilter = formValues.variations.filter((x: any) => x.id !== id)
    formValues.variations = afterFilter
    mapValuesToForm(initialForm, formValues)
  }

  /* Add more Attributes */
  const saveProductAttributes = (formValues: any) => {
    //mapValuesToForm(initialForm, formValues)
  }

  /* Add more Attributes */
  const saveProductVariations = (formValues: any) => {
    //mapValuesToForm(initialForm, formValues)
  }
  

  /** Add Variations */
  const createVariations = (numToAdd: number, maxAllow: number, formValues: any) => {   
    const listAttr: any = []   

    formValues.variations_attr &&
    formValues.variations_attr.forEach((e: any) => {
      listAttr.push({ attr: e, id: 0, label: "", value: "" })
    })

    let nextVar = 0

    numToAdd = ( numToAdd > maxAllow) ? maxAllow : numToAdd
    nextVar = (numToAdd === 1 && formValues.variations.length < maxAllow) 
              ? 1
              : numToAdd - formValues.variations.length

    for(let i = 0; i < nextVar; i++) {
      formValues.variations.push({
        id: Math.random().toString(36).slice(8),
        sku : '',
        regular_price : '',
        sale_price : '',
        wallet_cashback : '',
        new_thumbnail : '',
        shipping_class_id : '',
        tax_class : '',
        enabled : true,
        attributes : listAttr,
        stock_status : '',
      })
    }
    
  }
  
  const updateAttrToVariations = ( name: any, isChecked: any,formValues: any ) => {
    const variationsAttr: Array<string> = formValues.variations_attr || [];     
    if( isChecked ) {    
      const filterAttr = formValues.attributes.filter((x: any ) => { 
        return ((x.variation || (isChecked && name === x.name)) && !variationsAttr.includes(x.name))
      })

      filterAttr.foreEach((newAttr: any) => { 
        formValues.variations_attr.push(newAttr.name)
      })

      formValues.variations && formValues.variations.forEach((item:any) => {
        filterAttr.foreEach((newAttr: any) => {
          item.attributes.push({ 
            attr: newAttr.name,
            label: "",
            value: ""
          })
        })
      })
    } else {
      const filterAttr = formValues.attributes.filter((x: any ) => { 
        return (x.variation && !isChecked && name === x.name && variationsAttr.includes(x.name))
      })

      //remove
      filterAttr.foreEach((newAttr: any) => { 
        formValues.variations_attr.splice(formValues.variations_attr.indexOf(newAttr.name), 1)
      })

      formValues.variations && formValues.variations.forEach((item:any) => {
        filterAttr.foreEach((newAttr: any) => { 
          const findIndex = item.attributes.findIndex((x: any) => { return x.attr === newAttr.name })
          item.attributes.splice(findIndex, 1)
        })
      })
    }

    mapValuesToForm(initialForm, formValues)
  } 

  const handleAddVariations = (formValues: any) => {

    let maxRows = 1, totalListVar = 1
    formValues.attributes.forEach((x: any, i: number) => {  
      if(x.variation) maxRows *= (x.options.length > 0 ) ? x.options.length : 1
    } )

    if( selectedVar.value === 'add_all') {
      totalListVar = maxRows 
    }

    switch(selectedVar.value) {
      default:
        createVariations(totalListVar, maxRows, formValues)
        break;
      case 'delete_all':
        formValues.variations = []
        break;
    }

    mapValuesToForm(initialForm, formValues)
  }

  /* remove image */
  const removePhotoGallery  = (postion: number, isNew: boolean) => {
    alert(postion + '---' + isNew)
  }
  /**
   * Begin Formik
   */

  const ValidationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().max(250, 'Must be 250 characters or less').required('Pls enter the product title'),      
      //content: Yup.string().required('no-required'),
      /* name: Yup.string().required("Required!"),
      email: Yup.string().required("Required!") */
    })
  }

  return (
    <>
      {loading ? (
        <div className='card mb-5 mb-xl-8 loading-wrapper'>
          <div className='card-body py-3 loading-body'>
            <FallbackView />
          </div>
        </div>
      ) : (
        <div className='card mb-5 mb-xl-8'>
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Create Product</span>
            </h3>
          </div>
          <div className='card-body py-3'>
            <Formik
              initialValues={isNewProduct ? getInitialFormValues : initialForm}
              validationSchema={ValidationSchema}
              enableReinitialize={true}
              onSubmit={(values, {setSubmitting}) => {
                //save to DB
                setSubmitting(true)
                console.log(accessToken)
                postProduct(values, accessToken).then((product) => {
                  console.log(product)
                  setSubmitting(false) //done
                }).catch(() => {})              
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
                  <div className='current' data-kt-stepper-element='content'>
                    <div className='w-100'>
                      <div className='fv-row mb-5'>
                        <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                          <span className='no-required'>Product Title</span>
                        </label>
                        <input
                          name='name'
                          type='text'
                          className='form-control'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                        />
                        {touched.name && errors.name ? (
                          <div className='text-danger fs-8'>{errors.name}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className='w-100'>
                      <div className='fv-row mb-5'>
                        <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                          Product Content
                        </label>
                        <SunEditor
                          name='content'
                          placeholder="Please type here..."
                          autoFocus={false}
                          onChange={(event) => {
                            setFieldValue('content', event)
                          }}
                          defaultValue={values.content}
                          setContents={values.content}
                          width='100%'
                          height='500px'
                          setDefaultStyle={''}
                          setOptions={{
                            buttonList: [
                              //['undo', 'redo'],
                              ['font', 'fontSize', 'formatBlock'],
                              //['paragraphStyle', 'blockquote'],
                              ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                              ['fontColor',  'textStyle'], //'hiliteColor',
                              //['removeFormat', 'outdent', 'indent'],
                              ['align', 'horizontalRule', 'list'], //, 'lineHeight'
                              ['table', 'link', 'image'], //[, 'video', 'audio']
                              ['codeView'],
                              //['fullScreen', 'showBlocks', 'preview', 'print', 'save', 'template'],
                            ],
                          }}
                        />
                       {/*  {touched.content && errors.content ? (
                          <div className='text-danger'>{errors.content}</div>
                        ) : null} */}
                      </div>
                    </div>
                    <div className='w-100'>
                      <div className='row'>
                        <div className='col-md-8'>
                          <div className='fv-row mb-5'>
                            <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                              <span className='no-required'>Photo Gallery</span>
                            </label>
                            <div className='row'>
                              <div className='col-md-5'>
                                <div className='form-group mt-1'>
                                  <Dropzone
                                    onDrop={(acceptedFiles) => {
                                      if (acceptedFiles && acceptedFiles !== undefined) {
                                        handleFileUpload(acceptedFiles).then(
                                          (images) => {
                                            /* Once all promises are resolved, update state with image URI array */
                                            setNewPhotoGalleries(images)
                                            setFieldValue('new_photo_galleries', images)
                                          },
                                          (error) => {
                                            console.error(error)
                                          }
                                        )
                                      }
                                    }}
                                  >
                                    {({getRootProps, getInputProps}) => (
                                      <section className='notice d-flex bg-light-primary rounded border-primary border border-dashed py-3 px-2 dropzone dz-clickable'>
                                        <div {...getRootProps()}>
                                          <input
                                            {...getInputProps()}
                                            name='photo_galleries'
                                            accept='image/*'
                                          />
                                          <div
                                            className='dropzone-msg dz-message needsclick d-flex'
                                            style={{cursor: 'pointer'}}
                                          >
                                            <i className='bi bi-file-earmark-arrow-up text-primary fs-3x'></i>
                                            <div className='ms-4'>
                                              <span className='fs-8 text-gray-normal mb-1'>
                                                Add more photos, drop files here or click to upload.
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </section>
                                    )}
                                  </Dropzone>
                                </div>
                              </div>
                              <div className='col-md-7'>
                                <div className='photo-galleries'>
                                  {
                                    values.photo_galleries &&
                                    values.photo_galleries.map((image: any) => {
                                      return (
                                        <div
                                          className='form-group image-input image-input-outline'
                                          key={image.image_id}
                                        >
                                          <div className='image-input-wrapper w-65px h-65px overflow-hidden ms-2 me-2 mb-3'>
                                            <img className='h-100' src={image.src} alt='' />
                                          </div>
                                          <span
                                            className='btn btn-icon btn-circle btn-active-color-primary w-15px h-15px bg-body shadow'
                                            data-kt-image-input-action='remove'
                                            data-bs-toggle='tooltip'
                                            title='Remove Image'
                                            key={'remove_image_' + image.image_id}
                                            onClick={(event) => {
                                              removePhotoGallery(image.image_id, false)
                                              handleChange(event)
                                            }}
                                          >
                                            <i className='bi bi-x fs-2' id={'remove_image_' + image.image_id}></i>
                                          </span>
                                        </div>
                                      )
                                    })
                                  }
                                  {
                                    newPhotoGalleries && 
                                    newPhotoGalleries.map((src: string, i: number) => {
                                      return (
                                        <div
                                          className='form-group image-input image-input-outline'
                                          key={'image_' + i}
                                        >
                                          <div className='image-input-wrapper w-65px h-65px overflow-hidden ms-2 me-2 mb-3'>
                                            <img className='h-100' src={src} alt='' />
                                          </div>
                                          <span
                                            className='btn btn-icon btn-circle btn-active-color-primary w-15px h-15px bg-body shadow'
                                            data-kt-image-input-action='remove'
                                            data-bs-toggle='tooltip'
                                            title='Remove Image'
                                            key={'remove_image_' + i}
                                            onClick={(event) => {
                                              removePhotoGallery(i, true)
                                              handleChange(event)
                                            }}
                                          >
                                            <i id={'remove_image_' + i} className='bi bi-x fs-2'></i>
                                          </span>
                                        </div>
                                      )
                                    })
                                  }                                 
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-4'>
                          <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                            <span className='no-required'>Thumbnail</span>
                          </label>
                          <div className='row'>
                            <div className='col-md-3 mb-5 thumbnail'>
                              <div className='form-group image-input image-input-outline'>
                                <div className='image-input-wrapper w-65px h-65px overflow-hidden me-2 mb-3'>
                                  {
                                    (!newThumbnail && values && values.thumbnail && (
                                      <img className='h-100' src={values.thumbnail} alt='' />
                                    )) ||
                                    (newThumbnail && (
                                      <img className='h-100' src={newThumbnail} alt='' />
                                    )) || (
                                      <img
                                        className='h-100'
                                        src='https://via.placeholder.com/75x75/f0f0f0'
                                        alt=''
                                      />
                                    )
                                  }
                                </div>
                                <span
                                  className='btn btn-icon btn-circle btn-active-color-primary w-15px h-15px bg-body shadow'
                                  data-kt-image-input-action='remove'
                                  data-bs-toggle='tooltip'
                                  title='Remove Image'
                                >
                                  <i className='bi bi-x fs-2'></i>
                                </span>
                              </div>
                            </div>
                            <div className='col-md-9 mb-5'>
                              <div className='form-group mt-1'>
                                <UploadImageField
                                  setFileToState={setNewThumbnail}
                                  setFieldValue={setFieldValue}
                                  fileName={'new_thumbnail'}
                                />
                              </div>
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
                                <span className='no-required'>Product Type</span>
                              </label>
                            </div>
                            <div className='col-md-5'>
                              <select
                                name='type_product'
                                className='form-select'
                                value={values.type_product}
                                onChange={(e) => {
                                  onChangeProducType(e)
                                  handleChange(e)
                                }}
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
                              <div className='tab-content rounded border p-5 h-100'>
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
                                            value={values.general_price}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />                                         
                                        </div>
                                        {touched.general_price && errors.general_price ? (
                                            <div className='text-danger fs-8'>{errors.general_price}</div>
                                          ) : null}
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
                                        value={values.general_tax_status}
                                        onChange={handleChange}
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
                                        value={values.general_tax_class}
                                        onChange={handleChange}
                                      >
                                        {TaxClass &&
                                          TaxClass.map((item: any, i: number) => {
                                            return (
                                              <option key={item.value} value={item.value}>
                                                {item.label}
                                              </option>
                                            )
                                          })}
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
                                        value={values.general_wallet_credit}
                                        onChange={handleChange}
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
                                        value={values.general_wallet_cashback}
                                        onChange={handleChange}
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
                                        value={values.general_commission}
                                        onChange={handleChange}
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
                                        onChange={handleChange}
                                        value={values.inventory_sku}
                                        placeholder=''
                                        data-bs-toggle='tooltip'
                                        data-bs-placement='top'
                                      />
                                      <div className='text-muted fs-7 mt-3'>
                                        SKU refers to a Stock-keeping unit, a unique identifier for
                                        each distinct product and service that can be purchased.
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
                                          value={values.inventory_stock_status}
                                          onChange={handleChange}
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
                                          Controls whether or not the product is listed as "in
                                          stock" or "out of stock" on the frontend.
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
                                        value={values.shipping_class_id}
                                        onChange={handleChange}
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
                                        Shipping classes are used by certain shipping methods to
                                        group similar products.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Attributes */}

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
                                          isLoading={true}
                                          defaultValue={selectedAttr}
                                          value={selectedAttr}
                                          onChange={(onChangeAttr)}
                                          options={attributesList}
                                          name='attributes'
                                          className='w-100'
                                        />
                                      </div>
                                    </div>
                                    <div className='col-md-3 mb-5'>
                                      <button
                                        onClick={(event) => {
                                          handleAddMoreAttributes(values)
                                          handleChange(event)
                                        }}
                                        type='button'
                                        className='btn btn-sm btn-primary'
                                        name='add-more-attr'
                                      >
                                        Add more
                                      </button>
                                    </div>
                                  </div>
                                  {/** Product Attributes */}

                                  <div className='accordion' id='product_attribute'>
                                    {(values.attributes &&
                                      values.attributes.map((attr: any, i: number | string) => {
                                        //find options list from attributes
                                        const subAttributes = SubAttributes(attr.name)
                                        return (
                                          <div
                                            className='accordion-item'
                                            key={attr.name || attr.id}
                                          >
                                            <h2
                                              className='accordion-header d-flex'
                                              id={'product_attribute_header_' + attr.id}
                                            >
                                              <div className='remov-item'>
                                                <button
                                                  type='button'
                                                  className='btn btn-icon btn-circle btn-active-color-primary w-20px h-20px'
                                                  title='Remove this attribute'
                                                  name={'remove_' + attr.id}
                                                  onClick={(event) => {
                                                    removeAttribute(attr.id, values)
                                                    handleChange(event)
                                                  }}
                                                >
                                                  <i className='bi bi-x fs-2' id={'remove_' + attr.id}></i>
                                                </button>
                                              </div>
                                              <button
                                                className='accordion-button fs-6 fw-bold p-3 collapsed'
                                                type='button'
                                                data-bs-toggle='collapse'
                                                data-bs-target={
                                                  '#product_attribute_body_' + attr.id
                                                }
                                                aria-expanded='false'
                                                aria-controls={'product_attribute_body_' + attr.id}
                                              >
                                                {attr.title}
                                              </button>
                                            </h2>
                                            <div
                                              id={'product_attribute_body_' + attr.id}
                                              className='accordion-collapse collapse'
                                              aria-labelledby={
                                                'product_attribute_header_' + attr.id
                                              }
                                              data-bs-parent='#product_attribute'
                                            >
                                              <div className='accordion-body p-3'>
                                                <div className='row'>
                                                  <div className='col-md-5'>
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
                                                            onChange={handleChange}
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
                                                            onChange={(event) => {        
                                                              updateAttrToVariations(attr.name, event.target.checked, values)                                                    
                                                              handleChange(event)
                                                            }}
                                                          />
                                                          Used for variations
                                                        </label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className='col-md-7'>
                                                    <label>Value(s)</label>
                                                    <Select
                                                      styles={styles}
                                                      closeMenuOnSelect={false}
                                                      isLoading={true}
                                                      isMulti={true}
                                                      isSearchable={true}
                                                      defaultValue={attr.options}
                                                      value={attr.options}
                                                      onChange={(event) => {                                                        
                                                        setFieldValue(`attributes[${i}].options`, event)
                                                      }}
                                                      options={subAttributes}
                                                      name={`attributes[${i}].options`}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      })) ||
                                      null}
                                  </div>
                                  { !isNewProduct && (
                                  <div className='mt-4'>
                                    <button
                                        onClick={(event) => {
                                          saveProductAttributes(values)  
                                          handleChange(event)               
                                        }}
                                        type='button'
                                        className='btn btn-sm btn-primary'
                                        name='save-attributes'
                                      >
                                        Save Attributes
                                      </button>
                                  </div>
                                  )}
                                </div>

                                {productType === 'variable' ? (
                                  <div className='tab-pane fade' id='kt_vtab_pane_8'>
                                    <div className="mb-3">    
                                      <div className='d-flex align-items-center'>                            
                                        <div className='me-3 mb-3 w-100'>
                                          <Select
                                            styles={styles}
                                            closeMenuOnSelect={true}
                                            isMulti={false}
                                            isSearchable={false}
                                            defaultValue={selectedVar}
                                            value={selectedVar}
                                            onChange={(event) => {
                                              onChangeVar(event)
                                            }}
                                            options={[
                                              { value: 'add_one', label: 'Add variation'},
                                              { value: 'add_all', label: 'Create variations from all attributes'},
                                              { value: 'delete_all', label: 'Delete all variations'},
                                            ]}
                                            name={`variation_actions`}
                                            className='w-100'
                                          />                                        
                                        </div>
                                        <div className='mb-3'>
                                          <button
                                            onClick={(event) => {
                                              handleAddVariations(values)
                                              handleChange(event)
                                            }}
                                            type='button'
                                            className='btn btn-md btn-primary'
                                            name='add-more-variations'
                                          >
                                            Update
                                          </button>
                                        </div>
                                      </div>  
                                      <hr className="col-md-12 mt-3 mb-3" />   
                                    </div>                                    
                                    <div className='variants form-group'>
                                      {
                                        values.variations &&
                                        values.variations.map((item: any, i: number) => {
                                          const {
                                            id,
                                            sku,
                                            regular_price,
                                            sale_price,
                                            wallet_cashback,
                                            new_thumbnail,
                                            shipping_class_id,
                                            tax_class,
                                            enabled,
                                            attributes,
                                            stock_status
                                          } : any = values.variations[i]

                                          return (
                                            <div className='row' key={id}>
                                              <div
                                                className='accordion'
                                                id={'variation_' + id}
                                              >
                                                <div className='accordion-item border-0'>
                                                  <div
                                                    className='accordion-header'
                                                    id={'variation_' + id + '_header'}
                                                  >
                                                    <div className='col-md-12 d-flex align-items-start'>
                                                      <div className='remov-item flex-1 pt-2'>
                                                        <button
                                                          type='button'
                                                          className='btn btn-icon btn-circle btn-active-color-primary w-20px h-20px'
                                                          title='Remove this variation'
                                                          name={'remove_' + item.id }
                                                          onClick={(event) => {
                                                            removeVariations(item.id , values)
                                                            handleChange(event)
                                                          }}
                                                        >
                                                          <i id={'remove_' + item.id } className='bi bi-x fs-2'></i>
                                                        </button>
                                                      </div>
                                                      <div className='me-2 flex-50 pt-4'>
                                                        <label className='fw-bold'>
                                                          #{item.id}
                                                        </label>
                                                      </div>
                                                      <div className='variations flex-auto'>
                                                        { attributes && attributes.map((selectedValue: any, index: number) => {
                                                          //find options that selected to build for variations 
                                                          const attrOpt: any = values.attributes.find((a: any) => { return selectedValue.attr === a.name } )                                                         
                                                          const fieldName =  `variations[${i}].attributes[${index}]` 
                                                          return attrOpt && (
                                                            <Select
                                                              key={`attribute_${selectedValue.attr}`}                                                                
                                                              styles={styles}
                                                              closeMenuOnSelect={true}
                                                              isSearchable={false}
                                                              defaultValue={selectedValue}
                                                              value={selectedValue}                                                            
                                                              onChange={(selectedOption) => {
                                                                let event = {
                                                                  target: {
                                                                    name: fieldName,
                                                                    value: selectedOption,
                                                                  },
                                                                }
                                                                handleChange(event)
                                                              }}
                                                              options={attrOpt.options}
                                                              name={fieldName}
                                                              className="ms-2 me-2 float-start min-w-120px mb-3"
                                                            />
                                                          )
                                                        })}                                                       
                                                      </div>                                                      
                                                      <a
                                                        href='#'
                                                        className='accordion-button flex-1 fs-6 fw-bold collapsed w-250px bg-white pt-4'
                                                        data-bs-toggle='collapse'
                                                        data-bs-target={
                                                          '#variation_' + item.id + '_body'
                                                        }
                                                        aria-expanded='false'
                                                        aria-controls={
                                                          'variation_' + item.id + '_body'
                                                        }
                                                      >
                                                        Edit&nbsp;&nbsp;
                                                      </a>
                                                    </div>
                                                  </div>
                                                  <div
                                                    id={'variation_' + item.id + '_body'}
                                                    className='accordion-collapse collapse'
                                                    aria-labelledby={
                                                      'variation_' + item.id + '_header'
                                                    }
                                                    data-bs-parent={'#variation_' + item.id}
                                                  >
                                                    <div className='accordion-body'>
                                                      <div className='row mb-4'>
                                                        <div className='col-md-3 col-lg-2 thumbnail'>
                                                          <div className='form-group image-input image-input-outline'>
                                                            <div className='image-input-wrapper w-65px h-65px overflow-hidden ms-2 me-2 mb-3'>
                                                              {(!new_thumbnail &&
                                                                item.thumbnail && (
                                                                  <img
                                                                    className='h-100 variation_thumbnail'
                                                                    src={item.thumbnail || 'https://via.placeholder.com/75x75/f0f0f0'}
                                                                    alt=''
                                                                  />
                                                                )) ||
                                                                (new_thumbnail && (
                                                                  <img
                                                                    className='h-100 variation_thumbnail'
                                                                    src={new_thumbnail}
                                                                    alt=''
                                                                  />
                                                                )) ||
                                                                null}
                                                            </div>
                                                            <span
                                                              className='btn btn-icon btn-circle btn-active-color-primary w-15px h-15px bg-body shadow'
                                                              data-kt-image-input-action='remove'
                                                              data-bs-toggle='tooltip'
                                                              title='Remove Image'
                                                            >
                                                              <i className='bi bi-x fs-2'></i>
                                                            </span>
                                                          </div>
                                                        </div>
                                                        <div className='col-md-4 col-lg-5'>
                                                          <div className='form-group'>
                                                            <UploadImageField
                                                              /* setFileToState={setNewVariantThumbnail} */
                                                              setFieldValue={setFieldValue}
                                                              fileName={`variations[${i}].new_thumbnail`}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className='col-md-5 col-lg-5'>
                                                          <div className='row'>
                                                            <div className='form-group col-md-12'>
                                                              <div className='form-check form-check-custom form-check-solid mb-4'>
                                                                <label className='form-check-label ms-0 d-flex align-items-center'>
                                                                  <input
                                                                    type='checkbox'
                                                                    name={`variations[${i}].enabled`}
                                                                    className='form-check-input me-2'
                                                                    checked={enabled ? true : false}
                                                                    value={enabled}
                                                                    onChange={handleChange}
                                                                  />
                                                                  Enabled
                                                                </label>
                                                              </div>
                                                            </div>
                                                            <div className='form-group mb-4 col-md-12 d-flex align-items-center'>
                                                              <label className='fs-6 fw-bold mb-2 me-3'>
                                                                SKU
                                                              </label>
                                                              <input
                                                                type='text'
                                                                className='form-control'
                                                                name={`variations[${i}].sku`}
                                                                value={sku}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                              />
                                                            </div>
                                                          </div>
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
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
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
                                                                className='form-select me-2'
                                                                name={`variations[${i}].stock_status`}
                                                                value={stock_status}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                              >
                                                                <option value='instock'>
                                                                  In stock
                                                                </option>
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
                                                                type='number'
                                                                step={0.1}
                                                                className='form-control'
                                                                name={`variations[${i}].regular_price`}
                                                                value={regular_price || ''}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                              />
                                                            </div>
                                                            <div className='col-md-6 form-group mb-4'>
                                                              <label className='fs-6 fw-bold mb-2'>
                                                                Sale Price ($)
                                                              </label>
                                                              <input
                                                                type='number'
                                                                step={0.1}
                                                                className='form-control'
                                                                name={`variations[${i}].sale_price`}
                                                                value={sale_price || ''}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
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
                                                                onChange={handleChange}
                                                              >
                                                                <option value='-1'>
                                                                  No shipping class
                                                                </option>
                                                                {shippingClass &&
                                                                  shippingClass.map((item: any) => {
                                                                    return (
                                                                      <option
                                                                        key={item.value}
                                                                        value={item.value}
                                                                      >
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
                                                                onChange={handleChange}
                                                              >
                                                                {TaxClass &&
                                                                  TaxClass.map(
                                                                    (item: any, i: number) => {
                                                                      return (
                                                                        <option
                                                                          key={item.value}
                                                                          value={item.value}
                                                                        >
                                                                          {item.label}
                                                                        </option>
                                                                      )
                                                                    }
                                                                  )}
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
                                    { !isNewProduct && (
                                    <div className='mt-4'>
                                      <button
                                          onClick={(event) => {
                                            saveProductVariations(values)  
                                            handleChange(event)               
                                          }}
                                          type='button'
                                          className='btn btn-sm btn-primary'
                                          name='save-variations'
                                        >
                                          Save Varations
                                        </button>
                                    </div>
                                    )}
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
                                        defaultValue={values.linked_products_upsell}
                                        value={values.linked_products_upsell}
                                        onChange={(selectedOption) => {
                                          let event = {
                                            target: {
                                              name: 'linked_products_upsell',
                                              value: selectedOption,
                                            },
                                          }
                                          handleChange(event)
                                        }}
                                        options={productsList}
                                        name='linked_products_upsell'
                                      />
                                    </div>
                                    <div className='text-muted fs-8 mt-3'>
                                      Upsells are products which you recommend instead of the
                                      currently viewed product, for example, products that are more
                                      profitable or better quality or more expensive.
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
                                      defaultValue={values.linked_products_cross_sell}
                                      value={values.linked_products_cross_sell}
                                      onChange={(selectedOption) => {
                                        let event = {
                                          target: {
                                            name: 'linked_products_cross_sell',
                                            value: selectedOption,
                                          },
                                        }
                                        handleChange(event)
                                      }}
                                      options={productsList}
                                      name='linked_products_cross_sell'
                                    />
                                    <div className='text-muted fs-8 mt-3'>
                                      Cross-sells are products which you promote in the cart, based
                                      on the current product.
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
                                        defaultValue={values.categories}
                                        value={values.categories}
                                        onBlur={() => {
                                          handleBlur({target: {name: 'categories'}})
                                        }}
                                        onChange={(selectedOption) => {
                                          let event = {
                                            target: {name: 'categories', value: selectedOption},
                                          }
                                          handleChange(event)
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
                          disabled={isSubmitting}
                        >
                          { isSubmitting ? 'Processing...' : 'Create Product'}
                        </button>
                        <button
                          /* onClick={prevStep} */
                          type='button'
                          className='btn btn-lg btn-success w-100 ms-3'
                        >
                          Create &amp; Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  )
}

export default connector(ProductCreate)