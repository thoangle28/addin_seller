import React, {FC, useEffect, useRef, useState} from 'react'
import {Formik} from 'formik'
import {shallowEqual, useSelector, connect, ConnectedProps} from 'react-redux'
import * as Yup from 'yup'
import Dropzone from 'react-dropzone'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import {useHistory, useLocation} from 'react-router'
import * as detail from '../redux/CreateProductRedux'
import {RootState} from '../../../../setup'
import Select from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {  initialForm,  styles,  TaxClass,  initialFormValues, saveProductProperties,
  StockStatus,  handleFileUpload,  UploadImageField,  FallbackView,  fetchProfileData,  postProduct,  mapValuesToForm,
  getProduct,  loadSubAttrOptions,  loadAttributeOptions,  loadCategoriesOptions,  loadProducts, uploadImage} from './formOptions'

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const mapState = (state: RootState) => ({productDetail: state.productDetail})
const connector = connect(mapState, detail.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const ProductCreate: FC<PropsFromRedux> = (props) => {

  const history = useHistory();
  //get product id or create new
  const userLocation: any = useLocation()
  const { productId } = userLocation.state ? userLocation.state : 0
  const auth: any = useSelector<RootState>(({auth}) => auth, shallowEqual)
  const { accessToken, user } = auth
  const currentUserId: number = user ? user.ID : 0

  //useState
  const [loading, setLoading] = useState(true)
  const [isNewProduct, setNewProduct] = useState(true)
  const [shippingClass, setShippingClass] = useState([])
  const [reloadPage, setReloadPage] = useState(false)
  const [productType, setProductType] = useState('simple')
  const [newPhotoGalleries, setNewPhotoGalleries] = useState<any>([])
  const [newThumbnail, setNewThumbnail] = useState('')
  const [selectedAttr, setSelectedAttr] = useState({value: '', label: ''})
  const [selectedVar, setSelectedVar] = useState({value: '', label: ''})
  const [product, setProductDetail] = useState<any>([])
  const [isAttributeAdded, setAttritesAdded] = useState(false)
  const [isSaveAttr, setSaveAttr] = useState({loading: false, error: ''})
  const [isSaveVar, setSaveVar] = useState({loading: false, error: ''})
  const [formStatus, setFormStatus] = useState({ error: 204, message: ''})

  const tabDefault: any = useRef(null)
  //Get All Properties  
  const promise = fetchProfileData( currentUserId );
  const productInfo = getProduct(currentUserId, productId)
  
  useEffect(() => {
    promise.then((data: any) => {      
      setShippingClass(data.shippingClass)
    });
    
    productInfo.then((response: any) => { 
      const { code, message, data } = response     
      setProductDetail({...data})
      setFormStatus({ error: code, message: message})
    })    

  }, [reloadPage]);
  
  /**
   * Get Product Details
   */
  useEffect(() => {
    
    if( product && productId > 0 && product.id === productId) {
      mapValuesToForm(initialForm, product)
      setProductType(initialForm.type_product)
      setNewProduct(false)
      setLoading(false)
    } else {
      if( typeof productId === 'undefined'  || productId <= 0 ) {
        //console.log(initialFormValues)
        initialFormValues.user_id = currentUserId      
        //mapValuesToForm(initialForm, initialFormValues)       
        setNewProduct(true)
        setProductType('simple')
        setLoading(false)
      } else {
        setTimeout(() => {
          setLoading(false)
        }, 2000)        
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

  const onChangeAttr = (newOption: any) => {
    
    setAttritesAdded(false)
    setSelectedAttr(newOption)
  }

  const onChangeVar = (option: any) => {
    setSelectedVar(option)
  }

  /* Add more Attributes */
  const handleAddMoreAttributes = (formValues: any) => {
    if (!selectedAttr || !selectedAttr.value) return
   
    const value: any = {...selectedAttr}
    const isAdded = formValues.attributes.some((x: any) => x.id === value.id)
    
    if (isAdded) {
      setAttritesAdded(isAdded)
      return
    }
    const newAttr: any = {
        id: value.id,
        is_taxonomy: 1,
        is_variation: 0,
        is_visible: 1,
        name: value.name,
        options: [],
        position: 0,
        title: value.label,
        value: "",
        variation: false,
        visible: true
      }
    formValues.attributes.push(newAttr)

    //reset
    setSelectedAttr({value: '', label: ''})
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
    setSaveAttr({loading: true,  error: ''})
    saveProductProperties({
      accessToken, 
      product_id: formValues.id, 
      attributes: formValues.attributes, 
      type: 'attr'})
    .then((response: any) =>{
      const { code, message, data } = response.data 
      setSaveAttr({loading: false,  error: message})
      setTimeout(() => {
        setSaveAttr({loading: false,  error: ''})
        setReloadPage(true)
      }, 2000)
    })
  }

  /* Add more Attributes */
  const saveProductVariations = (formValues: any) => {
    setSaveVar({loading: true,  error: ''})
    //console.log(formValues)
    saveProductProperties({
      accessToken, 
      product_id: formValues.id, 
      variations: formValues.variations, 
      type: 'var'})
    .then((response: any) => {      
      const { code, message, data } = response.data     
      setSaveVar({loading: false,  error: message})
      //console.log(data)
      setTimeout(() => {
        setSaveVar({loading: false,  error: ''})
        setReloadPage(true)
      }, 2000)
    }).catch(() => {})
  }
  

  /** Add Variations */
  const createVariations = (numToAdd: number, maxAllow: number, formValues: any) => {   
    const listAttr: any = []   

    formValues.variations_attr &&
    formValues.variations_attr.map((e: any) => {
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
        is_new: true,
        is_remove: false
      })
    }
    
  }
  
  const updateAttrToVariations = ( name: any, isChecked: any,formValues: any ) => {
    const variationsAttr: Array<string> = formValues.variations_attr || [];     

    if( isChecked ) {   
      const filterAttr = formValues.attributes.filter((x: any ) => { 
        return ((x.variation || (isChecked && name === x.name)) && !variationsAttr.includes(x.name))
      })
  
      filterAttr && filterAttr.map((newAttr: any) => { 
        const checkExisted = formValues.variations_attr.some((x: string ) => { return x ===  newAttr.name})
        if( !checkExisted) formValues.variations_attr.push(newAttr.name)
      })

      formValues.variations && formValues.variations.map((item:any) => {
        filterAttr && filterAttr.map((newAttr: any) => {
          const checkExisted = item.attributes.some((x: any ) => { return x.attr ===  newAttr.name})
          if(!checkExisted) {
            item.attributes.push({ 
              attr: newAttr.name,
              label: "",
              value: ""
            })
          }
        })
      })
    } else { //remove

      const filterAttr = formValues.attributes.filter((x: any ) => { 
        return (x.variation && !isChecked && name === x.name && variationsAttr.includes(x.name))
      })

      filterAttr && filterAttr.map((newAttr: any) => { 
        const indexOf = formValues.variations_attr.indexOf(newAttr.name)
        if( indexOf > -1) formValues.variations_attr.splice(indexOf, 1)
      })

      formValues.variations && formValues.variations.map((item:any) => {
        filterAttr && filterAttr.map((newAttr: any) => { 
          const findIndex = item.attributes.findIndex((x: any) => { return x.attr === newAttr.name })
          if( findIndex > -1) item.attributes.splice(findIndex, 1)
        })
      })
    }

    mapValuesToForm(initialForm, formValues)
  } 

  const handleAddVariations = (formValues: any) => {

    let maxRows = 1, totalListVar = 1
    formValues.attributes.map((x: any, i: number) => {  
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

  const confirmDelete = (event: any, handleAction: any) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h2>Are you sure?</h2>
            <p>You want to delete this item?</p>
            <button
              className='btn btn-sm btn-success'
              onClick={onClose}>No</button>
            <button
              className='btn btn-sm btn-danger'
              onClick={() => {
                handleAction()
                onClose()
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        )
      }
    })
  }

  const confirmRequest = (message: string, product_id: number) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <p>{message}</p>
            {/* <button
              className='btn btn-sm btn-success'
              onClick={() => {
                //clear product, productId
                history.push({
                  hash: '#' + product_id,
                  pathname: '/product/update/' + product_id,
                  state: { productId: product_id},
                });
                onClose()
              }}>Still on this page</button> */}
            <button
              className='btn btn-sm btn-danger'
              onClick={() => {
                history.push("/product/listing");
                onClose()
              }}
            >
              Go to the products list
            </button>
          </div>
        )
      }
    })
  }

  const removeVariationThumbnail = (case_type: string, id: number | string, formValues: any) => {
    switch(case_type) {
      case 'variations':
        formValues.variations.find((x: any) => { return x.id === id }).thumbnail = { image_id: false, src: ''}   
        break;
      case 'galleries':
        const index = formValues.photo_galleries.findIndex((x: any) => { return x.image_id === id })
        formValues.photo_galleries[index] = { image_id: false, src: ''}   
        break;
      case 'new_galleries':
        if( formValues.new_photo_galleries[id] ) formValues.new_photo_galleries[id] = ''
        break;
      case 'thumbnail':
        formValues.thumbnail = { image_id: false, src: ''}   
        break;
      case 'newThumbnail':
        formValues.new_thumbnail = ''
        setNewThumbnail('')
        break;
    }
    
    mapValuesToForm(initialForm, formValues)
  }
  /**
   * Begin Formik
   */

  const ValidationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().max(250, 'Must be 250 characters or less').required('Pls enter the product title'),    
     /*  variations: Yup.array().of(
        Yup.object().shape({
          regular_price: Yup.number().test("regularPrice", "Invalid number", (value) => {
            if (value) return !isNaN(parseFloat(String(value))) && isFinite(Number(value))
          }) // 20 score
        })) */
      //content: Yup.string().required('no-required'),
      /* name: Yup.string().required("Required!"),
      email: Yup.string().required("Required!") */
    })
  }

  //CKeditor
  const [isUploading, setUploading] = useState(false)

  const convertImageToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }
  const uploadAdapter = (loader: any) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {        
          setUploading(true) 
          loader.file.then((file: any) => {
            const  maxFileSize = 1024*1024/2; //500Kb
            if( file.size > 1024*1024/2 ) {
              reject("Couldn't upload file with file size is greater than 500Kb")
              setUploading(false)
            } else {
              convertImageToBase64(file).then((result) => {
                const file_upload = {
                  fileBase64: result,
                  fileName: file.name
                }

                uploadImage(file_upload).then((response) => {
                  const {data} = response              
                  if( data && data.data) {
                    setUploading(false)
                    resolve({
                      default: data.data
                    });
                  }
                }).catch((err) => {
                  setUploading(false)
                  reject(err)
                })  
              });
            }
          });
        });
      }
    };
  }

  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return uploadAdapter(loader);
    };
  }

  const configCKEditor = {
    extraPlugins: [uploadPlugin]
  }

  return (
    <>
      {(loading && formStatus.error == 204) ? (
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
            {(formStatus && formStatus.error === 401) ? (
              <div  style={{height: '91vh'}} >
                <div className="alert alert-danger">
                  {formStatus.message}
                </div>
              </div>
            ) : (
            <Formik
              initialValues={isNewProduct ? {...initialFormValues} : {...initialForm}}
              validationSchema={ValidationSchema}
              enableReinitialize={true}
              onSubmit={(values, {setSubmitting}) => {
                //save to DB
                setSubmitting(true)
                //console.log(values)
                postProduct(values, accessToken).then((product: any) => {
                  const { code, message, data } = product
                  initialFormValues.attributes = [] //clear
                  initialFormValues.variations = [] //clear     
                  initialFormValues.variations_attr = [] 
                  //console.log(product)
                  switch(code) {
                    case 200:                                     
                      confirmRequest(message, data)
                      break;
                  }            
                  setSubmitting(false) //done
                }).catch(() => {
                  //setSubmitting(false) //error
                })              
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
                        <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                          <span className='required'>Product Title</span>
                        </label>
                        <input
                          name='name'
                          type='text'
                          className='form-control fs-7'
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
                        <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                          Product Content
                        </label>
                        <CKEditor
                          required
                          config={configCKEditor}
                          editor={ClassicEditor}
                          onReady={(editor: any) => {}}
                          onBlur={(event: any, editor: any) => {}}
                          onFocus={(event: any, editor: any) => {}}
                          onChange={(event: any, editor: any) => {
                            setFieldValue('content', editor.getData());
                          }}
                          data="Test"
                          name='content'
                          {...props}
                        />
                        {/* 
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
                        /> */}
                       {/*  {touched.content && errors.content ? (
                          <div className='text-danger'>{errors.content}</div>
                        ) : null} */}                    
                      </div>
                    </div>
                    <div className='w-100'>
                      <div className='row'>
                        <div className='col-md-8'>
                          <div className='fv-row mb-5'>
                            <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                              <span className='no-required'>Photo Gallery</span>
                            </label>
                            <div className='row'>
                              <div className='col-md-12'>
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
                                            className='dropzone-msg dz-message needsclick d-flex align-items-center'
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
                              <div className='col-md-12'>
                                <div className='photo-galleries'>
                                  {
                                    values.photo_galleries &&
                                    values.photo_galleries.map((image: any, i: number) => {
                                      return image.src && (
                                        <div
                                          className='form-group image-input image-input-outline'
                                          key={`photo-galleries-${i}`}
                                        >
                                          <div className='image-input-wrapper w-65px h-65px overflow-hidden ms-2 me-2 mb-3'>
                                            <img className='h-100' src={image.src} alt='' />
                                          </div>
                                          <span
                                            className='btn btn-icon btn-circle btn-active-color-primary w-15px h-15px bg-body shadow'
                                            data-kt-image-input-action='remove'
                                            data-bs-toggle='tooltip'
                                            title='Remove Image'
                                            key={'remove_image_' + i}
                                            onClick={(event) => {
                                              removeVariationThumbnail('galleries', image.image_id, values)
                                              handleChange(event)
                                            }}
                                          >
                                            <i className='bi bi-x fs-2' id={'remove_image_' + i}></i>
                                          </span>
                                        </div>
                                      )
                                    })
                                  }
                                  {
                                    newPhotoGalleries && 
                                    newPhotoGalleries.map((src: string, i: number) => {
                                      return src && (
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
                                              removeVariationThumbnail('new_galleries', i, values)
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
                          <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                            <span className='no-required'>Thumbnail</span>
                          </label>
                          <div className='row'>
                            <div className='col-md-4 thumbnail'>
                              <div className='form-group image-input image-input-outline'>
                                <div className='image-input-wrapper w-65px h-65px overflow-hidden me-2 mb-3'>
                                  {
                                    (!newThumbnail && values && values.thumbnail.src && (
                                      <img className='h-100' src={values.thumbnail.src} alt='' />
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
                                {(newThumbnail || (values && values.thumbnail.src)) &&
                                (<span
                                  className='btn btn-icon btn-circle btn-active-color-primary w-15px h-15px bg-body shadow'
                                  data-kt-image-input-action='remove'
                                  data-bs-toggle='tooltip'
                                  title='Remove Image'
                                  id={`product_thumbnail`}
                                  onClick={(event) => {
                                    if( newThumbnail )
                                      removeVariationThumbnail('newThumbnail', 0, values)
                                    else
                                      removeVariationThumbnail('thumbnail', values.thumbnail.image_id, values)
                                    handleChange(event)
                                  }}
                                >
                                  <i id={`product_thumbnail_1`} className='bi bi-x fs-2'></i>
                                </span>)}
                              </div>
                            </div>
                            <div className='col-md-8 mb-5'>
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
                              <label className='fs-7 fw-bold'>
                                <span className='no-required'>Product Type</span>
                              </label>
                            </div>
                            <div className='col-md-5'>
                              <select
                                name='type_product'
                                className='form-select fs-7'
                                value={values.type_product}
                                onChange={(event) => {
                                  onChangeProducType(event)
                                  handleChange(event)
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
                            <div className='col-md-4 col-lg-4'>
                              <ul className='nav nav-tabs nav-pills flex-row border-0 flex-md-column me-5 mb-3 mb-md-0 fs-7'>
                                <li className='nav-item me-0'>
                                  <a
                                    className='nav-link active btn btn-flex btn-active-secondary w-100'
                                    data-bs-toggle='tab'
                                    id='tab_general'
                                    href='#general_pane'
                                    ref={tabDefault}
                                  >
                                    <span className='d-flex flex-column align-items-start'>
                                      <span className='fs-7'>General</span>
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
                                      <span className='fs-7'>Cagatories</span>
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
                                      <span className='fs-7'>Inventory</span>
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
                                      <span className='fs-7'>Shipping</span>
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
                                      <span className='fs-7'>Linked Products</span>
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
                                      <span className='fs-7'>Attributes</span>
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
                                        <span className='fs-7'>Variations</span>
                                      </span>
                                    </a>
                                  </li>
                                ) : null}
                              </ul>
                            </div>
                            <div className='col-md-8 col-lg-8'>
                              <div className='tab-content rounded border p-4 h-100'>
                                <div className='tab-pane fade active show' id='general_pane'>
                                  {productType !== 'variable' ? (
                                    <div className='form-group row'>
                                      <div className='col-md-6 mb-5'>
                                        <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                          <span>Regular Price</span>
                                        </label>
                                        <div className='input-group'>
                                          <span className='input-group-text'>$</span>
                                          <input
                                            type='text'
                                            className='form-control fs-7'
                                            name='general_regular_price'                                           
                                            value={values.general_regular_price}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        </div>
                                      {/*   {touched.general_regular_price && errors.general_regular_price ? (
                                            <div className='text-danger fs-8'>{errors.general_regular_price}</div>
                                          ) : null} */}
                                      </div>
                                      <div className='col-md-6 mb-5'>
                                        <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                          <span>Sale Price</span>
                                        </label>
                                        <div className='input-group'>
                                          <span className='input-group-text'>$</span>
                                          <input
                                            type='text'
                                            className='form-control fs-7'
                                            name='general_sale_price'
                                            placeholder=''
                                            value={values.general_sale_price}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />            
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                  <div className='form-group row'>
                                    <div className='col-md-6 mb-5'>
                                      <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>Tax status</span>
                                      </label>
                                      <select
                                        name='general_tax_status'
                                        className='form-select fs-7'
                                        value={values.general_tax_status}
                                        onChange={handleChange}
                                      >
                                        <option value='taxable'>Taxable</option>
                                        <option value='shipping'>Shipping only</option>
                                        <option value='none'>None</option>
                                      </select>
                                    </div>
                                    <div className='col-md-6 mb-5'>
                                      <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>Tax class</span>
                                      </label>
                                      <select
                                        name='general_tax_class'
                                        className='form-select me-2 fs-7'
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
                                      <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>Wallet Credit</span>
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control fs-7'
                                        name='general_wallet_credit'
                                        value={values.general_wallet_credit}
                                        onChange={handleChange}
                                      />
                                    </div>
                                    <div className='col-md-4 mb-5'>
                                      <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>Wallet Cashback</span>
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control fs-7'
                                        name='general_wallet_cashback'
                                        value={values.general_wallet_cashback}
                                        onChange={handleChange}
                                      />
                                    </div>
                                    <div className='col-md-4 mb-5'>
                                      <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>Commission:</span>
                                      </label>
                                      <input
                                        type='number'
                                        className='form-control fs-7'
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
                                      <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>SKU</span>
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control fs-7'
                                        name='inventory_sku'
                                        onChange={handleChange}
                                        value={values.inventory_sku}
                                        placeholder=''
                                        data-bs-toggle='tooltip'
                                        data-bs-placement='top'
                                      />
                                      <div className='text-muted fs-9 mt-3'>
                                        SKU refers to a Stock-keeping unit, a unique identifier for
                                        each distinct product and service that can be purchased.
                                      </div>
                                    </div>
                                  </div>
                                  {productType !== 'variable' ? (
                                    <div className='form-group row'>
                                      <div className='col-md-12 mb-5'>
                                        <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                          <span>Stock Status</span>
                                        </label>
                                        <select
                                          name='inventory_stock_status'
                                          className='form-select fs-7'
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
                                        <div className='text-muted fs-9 mt-3'>
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
                                      <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>Shipping Class</span>
                                      </label>
                                      <select
                                        name='shipping_class_id'
                                        className='form-select fs-7'
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
                                      <div className='text-muted fs-9 mt-3'>
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
                                        <label className='d-flex align-items-center fs-7 fw-bold'>
                                          <span>Custom Product Attribute</span>
                                        </label>
                                      </div>
                                    </div>
                                    <div className='col-md-8 mb-5'>
                                      <div className='d-flex align-items-center'>                                       
                                        <AsyncPaginate
                                          placeholder='Select attribute value...'
                                          isMulti={false}      
                                          styles={styles}                                    
                                          closeMenuOnSelect={true}
                                          value={selectedAttr}        
                                          loadOptions={() => { return loadAttributeOptions()}}
                                          onChange={onChangeAttr}
                                          name="attributes"
                                          className='w-100 fs-7'
                                          noOptionsMessage={() => 'No attribute found'}
                                          loadingMessage={() => 'Loading data, please wait...'} 
                                        />
                                      </div>
                                      { isAttributeAdded && 
                                      (<div className='text-danger fs-9'>The attribute has added, pls choose other item...!</div>)}
                                    </div>
                                    <div className='col-md-4 mb-5'>
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
                                                className='accordion-button fs-7 fw-bold p-3 collapsed'
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
                                                    <div className='fw-bold fs-7'>{attr.title}</div>
                                                    <div className='mt-5'>
                                                      <div className='form-check form-check-custom form-check-solid mb-3'>
                                                        <label className='form-check-label ms-0 d-flex align-items-center'>
                                                          <input
                                                            type='checkbox'
                                                            name={`attributes[${i}].visible`}
                                                            className='form-check-input me-2 fs-7'
                                                            checked={attr.visible}
                                                            value={attr.visible}
                                                            onChange={handleChange}
                                                          />
                                                          Visible on the product page
                                                        </label>
                                                      </div>
                                                      { productType === 'variable' 
                                                      && (<div className='form-check form-check-custom form-check-solid'>
                                                        <label className='form-check-label ms-0 d-flex align-items-center'>
                                                          <input
                                                            type='checkbox'
                                                            name={`attributes[${i}].variation`}
                                                            className='form-check-input me-2 fs-7'
                                                            checked={attr.variation}
                                                            value={attr.variation}
                                                            onChange={(event) => {        
                                                              updateAttrToVariations(attr.name, event.target.checked, values)                                                    
                                                              handleChange(event)
                                                            }}
                                                          />
                                                          Used for variations
                                                        </label>
                                                      </div>)}
                                                    </div>
                                                  </div>
                                                  <div className='col-md-7'>
                                                    <label className='fs-7'>Value(s)</label>                                                   
                                                    <AsyncPaginate
                                                      placeholder='Select term value(s)...'
                                                      isMulti              
                                                      styles={styles}                                    
                                                      closeMenuOnSelect={false}
                                                      value={attr.options}        
                                                      loadOptions={() => { return loadSubAttrOptions(attr.name)}}
                                                      onChange={(event) => {                                                        
                                                        setFieldValue(`attributes[${i}].options`, event)
                                                      }}
                                                      name={`attributes[${i}].options`}
                                                      noOptionsMessage={() => 'No value(s) found'}
                                                      loadingMessage={() => 'Loading data, please wait...'} 
                                                      className="fs-7"
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
                                        className='btn btn-sm btn-dark'
                                        name='save-attributes'
                                        disabled={isSaveAttr.loading}
                                      >
                                        { !isSaveAttr.loading ?
                                        (<span className='indicator-label'>Save Attributes</span>) : 
                                        (<span className='indicator-progress' style={{display: 'block'}}>
                                          Processing...
                                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                        </span>)}
                                      </button>
                                      {isSaveAttr.error && (
                                        <div className="alam fs-8 p-2 w-auto mt-2 deley-200" role="alert">
                                          {isSaveAttr.error}
                                        </div>
                                      )}
                                  </div>
                                  ) }
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
                                            className='w-100 fs-7'
                                          />                                        
                                        </div>
                                        <div className='mb-3'>
                                          <button
                                            onClick={(event) => {
                                              handleAddVariations(values)
                                              handleChange(event)
                                            }}
                                            type='button'
                                            className='btn btn-sm btn-primary'
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
                                        values.attributes.some((x: any) => { return x.variation })
                                        && values.variations &&
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
                                                            confirmDelete(event, () => {                                                              
                                                              removeVariations(item.id , values)
                                                              handleChange(event)
                                                            })                                                            
                                                          }}
                                                        >
                                                          <i id={'remove_' + item.id } className='bi bi-x fs-2'></i>
                                                        </button>
                                                      </div>
                                                      <div className='me-2 flex-50 pt-4'>
                                                        <label className='fw-bold fs-7' >
                                                          #{item.id}
                                                        </label>
                                                      </div>
                                                      <div className='variations flex-auto'>
                                                        { attributes && attributes.map((selectedValue: any, index: number) => {
                                                          //find options that selected to build for variations                  
                                                          const attrOpt: any = values.attributes.find((attr: any) => { return selectedValue.attr === attr.name } )                                                         
                                                          const fieldName =  `variations[${i}].attributes[${index}]` 
                                                          return attrOpt && (
                                                            <Select
                                                              key={fieldName}                                                                
                                                              styles={styles}
                                                              closeMenuOnSelect={true}
                                                              isSearchable={false}
                                                              defaultValue={selectedValue}
                                                              value={selectedValue}                                                            
                                                              onChange={(event) => {                                                               
                                                                setFieldValue(fieldName, event)
                                                              }}
                                                              options={attrOpt.options}
                                                              name={fieldName}
                                                              className="ms-2 me-2 float-start min-w-120px mb-3 fs-7"
                                                            />
                                                          )
                                                        })}                                                       
                                                      </div>                                                      
                                                      <a
                                                        href='#'
                                                        className='accordion-button flex-1 fs-7 fw-bold collapsed w-250px bg-white pt-4'
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
                                                        <div className='col-md-3 thumbnail'>
                                                          <div className='form-group image-input image-input-outline'>
                                                            <div className='image-input-wrapper w-65px h-65px overflow-hidden ms-2 me-2 mb-3'>
                                                              {(!new_thumbnail &&
                                                                item.thumbnail && (
                                                                  <img
                                                                    className='h-100 variation_thumbnail'
                                                                    src={item.thumbnail.src || 'https://via.placeholder.com/75x75/f0f0f0'}
                                                                    alt=''
                                                                  />
                                                                )) ||
                                                                (<img
                                                                    className='h-100 variation_thumbnail'
                                                                    src={new_thumbnail|| 'https://via.placeholder.com/75x75/f0f0f0'}
                                                                    alt=''
                                                                  />
                                                                )}
                                                            </div>
                                                            {(new_thumbnail || item.thumbnail) && (
                                                            <span
                                                              className='btn btn-icon btn-circle btn-active-color-primary w-15px h-15px bg-body shadow'
                                                              data-kt-image-input-action='remove'
                                                              data-bs-toggle='tooltip'
                                                              title='Remove Image'
                                                              id={`thumbnail_${item.id}`}
                                                              onClick={(event) => {
                                                                removeVariationThumbnail('variations', item.id, values)
                                                                handleChange(event)
                                                              }}
                                                            >
                                                              <i id={`thumbnail__${item.id}`} className='bi bi-x fs-2'></i>
                                                            </span>)}
                                                          </div>
                                                        </div>
                                                        <div className='col-md-9'>
                                                          <div className='form-group'>
                                                            <UploadImageField
                                                              setFieldValue={setFieldValue}
                                                              fileName={`variations[${i}].new_thumbnail`}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className='col-md-12'>
                                                          <div className='row'>
                                                            <div className='form-group col-md-12'>
                                                              <div className='form-check form-check-custom form-check-solid mb-4'>
                                                                <label className='form-check-label ms-0 d-flex align-items-center fs-7'>
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
                                                              <label className='fs-7 fw-bold mb-2 me-3'>
                                                                SKU
                                                              </label>
                                                              <input
                                                                type='text'
                                                                className='form-control fs-7'
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
                                                              <label className='fs-7 fw-bold mb-2'>
                                                                Wallet Cashback
                                                              </label>
                                                              <input
                                                                type='text'
                                                                className='form-control fs-7'
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
                                                              <label className='fs-7 fw-bold mb-2'>
                                                                Stock status
                                                              </label>
                                                              <select
                                                                className='form-select me-2 fs-7'
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
                                                              <label className='fs-7 fw-bold mb-2'>
                                                                Regular Price ($)
                                                              </label>
                                                              <input
                                                                type='number'
                                                                step={0.1}
                                                                className='form-control fs-7'
                                                                name={`variations[${i}].regular_price`}
                                                                value={regular_price || ''}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                              />
                                                            </div>
                                                            <div className='col-md-6 form-group mb-4'>
                                                              <label className='fs-7 fw-bold mb-2'>
                                                                Sale Price ($)
                                                              </label>
                                                              <input
                                                                type='number'
                                                                step={0.1}
                                                                className='form-control fs-7'
                                                                name={`variations[${i}].sale_price`}
                                                                value={sale_price || ''}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className='row'>
                                                            <div className='col-md-6 form-group mb-4'>
                                                              <label className='fs-7 fw-bold mb-2'>
                                                                Shipping class
                                                              </label>
                                                              <select
                                                                name={`variations[${i}].shipping_class_id`}
                                                                className='form-select fs-7'
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
                                                              <label className='fs-7 fw-bold mb-2'>
                                                                Tax class
                                                              </label>
                                                              <select
                                                                name={`variations[${i}].tax_class`}
                                                                className='form-select me-2 fs-7'
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
                                          className='btn btn-sm btn-dark'
                                          name='save-variations'
                                          disabled={isSaveVar.loading}
                                        >
                                          { !isSaveVar.loading ?
                                          (<span className='indicator-label' id='save-variations'>Save Variations</span>) : 
                                          (<span className='indicator-progress' style={{display: 'block'}}>
                                            Processing...
                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                          </span>)}
                                        </button>
                                        {(isSaveVar.error) && (
                                          <div className="alam fs-8 p-2 w-auto mt-2 deley-200" role="alert">
                                            {isSaveVar.error}
                                          </div>
                                        )}
                                    </div>
                                    )}
                                  </div>
                                ) : null}
                                {/* End Variants */}
                                <div className='tab-pane fade' id='linked_products_pane'>
                                  <div className='col-md-12 mb-5'>
                                    <div className='uppselles'>
                                      <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                        <span>Upsells</span>
                                      </label>                                     
                                      <AsyncPaginate
                                        placeholder='Select product...'
                                        isMulti={true}      
                                        styles={styles}                                    
                                        closeMenuOnSelect={false}
                                        value={values.linked_products_upsell}       
                                        loadOptions={() => { return loadProducts(currentUserId)}}
                                        onChange={(selectedOption) => {
                                          let event = {
                                            target: {
                                              name: 'linked_products_upsell',
                                              value: selectedOption,
                                            },
                                          }
                                          handleChange(event)
                                        }}
                                        name="linked_products_upsell"
                                        className='w-100 fs-7'
                                        noOptionsMessage={() => 'No products found'}
                                        loadingMessage={() => 'Loading data, please wait...'} 
                                      />
                                    </div>
                                    <div className='text-muted fs-9 mt-3'>
                                      Upsells are products which you recommend instead of the
                                      currently viewed product, for example, products that are more
                                      profitable or better quality or more expensive.
                                    </div>
                                  </div>
                                  <div className='col-md-12 mb-5'>
                                    <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                      <span>Cross-sells</span>
                                    </label>                                   
                                    <AsyncPaginate
                                      placeholder='Select product...'
                                      isMulti={true}      
                                      styles={styles}                                    
                                      closeMenuOnSelect={false}
                                      value={values.linked_products_cross_sell}       
                                      loadOptions={() => { return loadProducts(currentUserId)}}
                                      onChange={(selectedOption) => {
                                        let event = {
                                          target: {
                                            name: 'linked_products_cross_sell',
                                            value: selectedOption,
                                          },
                                        }
                                        handleChange(event)
                                      }}
                                      name="linked_products_cross_sell"
                                      className='w-100 fs-7'
                                      noOptionsMessage={() => 'No products found'}
                                      loadingMessage={() => 'Loading data, please wait...'} 
                                    />
                                    <div className='text-muted fs-9 mt-3'>
                                      Cross-sells are products which you promote in the cart, based
                                      on the current product.
                                    </div>
                                  </div>
                                </div>
                                {/** category_pane  */}
                                <div className='tab-pane fade' id='category_pane'>
                                  <div className='col-md-12 mb-5'>
                                    <label className='d-flex align-items-center fs-7 fw-bold mb-2'>
                                      <span>Categories</span>
                                    </label>
                                    <div className='form-group'>                                      
                                      <AsyncPaginate
                                        placeholder='Select categories...'
                                        isMulti={true}      
                                        styles={styles}                                    
                                        closeMenuOnSelect={false}
                                        value={values.categories}        
                                        loadOptions={() => { return loadCategoriesOptions()}}
                                        onChange={(selectedOption) => {
                                          let event = {
                                            target: {name: 'categories', value: selectedOption},
                                          }
                                          handleChange(event)
                                        }}
                                        name="categories"
                                        className='w-100 fs-7'
                                        noOptionsMessage={() => 'No categories found'}
                                        loadingMessage={() => 'Loading data, please wait...'} 
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
                      <div className='me-0 d-flex flex-stack justify-content-center indicator-progress'>
                        <button
                          type='submit'
                          className='btn btn-lg btn-success w-50 me-3'
                          disabled={isSubmitting || isUploading}
                        >
                          { isSubmitting 
                          ? (<>Processing... <span className='spinner-border spinner-border-sm align-middle ms-2'></span></>) 
                          : (!isNewProduct ? 'Update Product': 'Create Product')}
                        </button>                       
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default connector(ProductCreate)