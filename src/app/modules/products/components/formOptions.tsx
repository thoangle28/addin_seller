import Dropzone from 'react-dropzone'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import * as common from '../redux/ProductsList'

export interface IAttribute {
  id: number
  title: string
  name: string
  visible: boolean
  variation: boolean
  options: Array<any>
}

export const initialDefaultForm = {
  productId: 0,
  id: 0,
  user_id: 0,
  name: '',
  content: '',
  is_variable: 'simple', //simple
  type_product: 'simple',
  variations: [],
  variations_attr: [],
  attributes: [],
  thumbnail: { src: '', image_id: '' },
  new_thumbnail: '',
  photo_galleries: [],
  new_photo_galleries: [],
  general_price: '',
  general_regular_price: '',
  general_sale_price: '',
  general_total_sales: 0,
  general_tax_status: '',
  general_tax_class: '',
  general_wallet_credit: '',
  general_wallet_cashback: '',
  general_commission: '',
  categories: [],
  inventory_sku: '',
  inventory_stock_status: '',
  inventory_manage_stock: '',
  inventory_backorders: '',
  inventory_stock_quantity: '',
  inventory_low_stock_amount: '',
  inventory_sold_individually: '',
  shipping_weight: 0,
  shipping_length: '',
  shipping_width: '',
  shipping_height: '',
  shipping_class_id: -1,
  linked_products_upsell: [],
  linked_products_cross_sell: [],
  selectedAttr: '',
  usePhoto: false
}

export const initialFormValues = { ...initialDefaultForm }
export const initialForm = { ...initialDefaultForm }

export const mapValuesToForm = (initialValues: any, productValues: any) => {
  initialValues.productId = productValues.id
  initialValues.id = productValues.id
  initialValues.user_id = productValues.user_id
  initialValues.name = productValues.name
  initialValues.content = productValues.content
  initialValues.is_variable = productValues.is_variable
  initialValues.type_product = productValues.type_product
  initialValues.inventory_sku = productValues.inventory_sku
  initialValues.attributes = productValues.attributes
  initialValues.variations = productValues.variations
  initialValues.thumbnail = productValues.thumbnail
  initialValues.new_thumbnail = ''
  initialValues.photo_galleries = productValues.photo_galleries
  initialValues.new_photo_galleries = [];//productValues.new_photo_galleries
  initialValues.general_price = productValues.general_price
  initialValues.general_regular_price = productValues.general_regular_price
  initialValues.general_sale_price = productValues.general_sale_price
  initialValues.general_tax_status = productValues.general_tax_status
  initialValues.general_tax_class = productValues.general_tax_class
  initialValues.categories = productValues.categories
  initialValues.shipping_class_id = productValues.shipping_class_id
  initialValues.selectedAttr = ''
  initialValues.selectedVarAct = ''
  initialValues.variations_attr = productValues.variations_attr
  initialValues.linked_products_upsell = productValues.linked_products_upsell
  initialValues.linked_products_cross_sell = productValues.linked_products_cross_sell
  initialValues.general_wallet_credit = productValues.general_wallet_credit
  initialValues.general_wallet_cashback = productValues.general_wallet_cashback
  initialValues.general_commission = productValues.general_commission
}

export const TaxClass: any = [
  { value: 'parent', label: 'Same as parent' },
  { value: '', label: 'Standard' },
  { value: 'reduced-rate', label: 'Reduced rate' },
  { value: 'zero-rate', label: 'Zero rate' },
]

export const StockStatus: any = [
  { value: 'instock', label: 'In stock' },
  { value: 'outofstock', label: 'Out of stock' },
  { value: 'onbackorder', label: 'On backorder' },
]

export const styles = {
  multiValue: (styles: any) => {
    return {
      ...styles,
      backgroundColor: '#009ef7',
      borderRadius: '5px',
      padding: '2px 5px',
      color: '#FFFFFF',
    }
  },
  multiValueLabel: (styles: any) => ({
    ...styles,
    color: '#ffffff',
  }),
}

export const ShippingClass = () => {
  let termsList: any = []
  common
    .getShippingClass()
    .then((response) => {
      const { data } = response.data
      data &&
        data.forEach((e: any) => {
          termsList.push({ value: e.term_id, label: e.name })
        })
    })
    .catch(() => { })

  return termsList
}

export const Categoies = () => {
  let termsList: any = []
  common
    .getCategoires()
    .then((response) => {
      const { data } = response.data
      data &&
        data.forEach((e: any) => {
          termsList.push({ value: e.term_id, label: e.name })
        })
    })
    .catch(() => { })

  return termsList
}

export const Attributes = () => {
  let termsList: any = []
  let fullList: any = []

  common
    .getAttributes()
    .then((response) => {
      const { data } = response.data

      data &&
        data.forEach((item: any) => {
          //user for add more
          const newItem: IAttribute = {
            id: item.id,
            title: item.label,
            name: item.name,
            visible: false,
            variation: false,
            options: item.options,
          }

          fullList.push(newItem)

          termsList.push({ value: item.id, label: item.label })
        })
      termsList.unshift({ value: '', label: 'Custom product attribute' })
    })
    .catch(() => { })

  return { termsList, fullList }
}

export const SubAttributes = (term_slug: string) => {
  let termsList: any = []
  common
    .getSubAttributes(term_slug)
    .then((response) => {
      const { data } = response.data
      data &&
        data.forEach((e: any) => {
          termsList.push({ ...e })
        })
    })
    .catch(() => { })

  return termsList
}

export const ProductDetail = (uId: number, pId: number) => {
  common
    .getProductInfoDetail(uId, pId)
    .then((response) => {
      const { data } = response.data
      return { ...data }
    })
    .catch(() => { })
}


export const ProductsList = (userId: number) => {
  let termsList: any = []

  common
    .getProductsList(userId)
    .then((response) => {
      const { data } = response.data
      data &&
        data.productsList &&
        data.productsList.forEach((e: any) => {
          termsList.push({ value: e.product_id, label: e.product_name })
        })
    })
    .catch(() => { })

  return termsList
}

export const handleFileUpload = (files: any) => {
  const filesList: any = Array.from(files)
  /* Map each file to a promise that resolves to an array of image URI's */
  return Promise.all(
    filesList.map((file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    })
  )
}

export const UploadImageField = (props: any) => {
  const { setFileToState, setFieldValue, fileName } = props
  return (
    <>
      <div className='form-group mt-1'>
        <Dropzone
          onDrop={(acceptedFiles) => {
            if (acceptedFiles && acceptedFiles !== undefined) {
              handleFileUpload(acceptedFiles).then(
                (images) => {
                  setFileToState && setFileToState(images)
                  setFieldValue(fileName, images)
                },
                (error) => {
                  console.error(error)
                }
              )
            }
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section className='notice d-flex bg-light-primary rounded border-primary border border-dashed py-3 px-2 dropzone dz-clickable'>
              <div {...getRootProps()}>
                <input {...getInputProps()} name={fileName} accept='image/*' />
                <div
                  className='dropzone-msg dz-message needsclick d-flex align-items-center'
                  style={{ cursor: 'pointer' }}
                >
                  <i className='bi bi-file-earmark-arrow-up text-primary fs-3x'></i>
                  <div className='ms-4'>
                    <span className='fs-8 text-gray-normal mb-1'>
                      Click here to change.
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </>
  )
}

export const FallbackView = () => {
  return (
    <div className='text-center w-100'>
      <img className='h-40px' src={toAbsoluteUrl('/media/logos/logo-v5-200.png')} alt='Addin Seller Portal' />
      <div className='mt-5 text-center d-flex justify-content-center'>
        <div className='loadding'>
          {/* <span>Loading ...</span> */}
          <div className="balls">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const fetchProfileData = (userId: number) => {
  return Promise.all([
    fetchShippingClass(),
  ]).then(([shippingClass]) => { //, categories, attributes, productsList
    return { shippingClass }  //, categories, attributes, productsList
  })
}

const fetchShippingClass = () => {
  return new Promise((resolve, reject) => {
    try {
      const shippingClass = ShippingClass()
      resolve(shippingClass)
    } catch (e) {
      reject({
        errorMsg: 'Error while loading data. Try again later.'
      })
    }
  })
}

const fetchCategoies = () => {
  return new Promise((resolve, reject) => {
    try {
      const categories = Categoies()
      resolve(categories)
    } catch (e) {
      reject({
        errorMsg: 'Error while loading data. Try again later.'
      })
    }
  })
}

const fetchAttributes = () => {
  return new Promise((resolve, reject) => {
    try {
      const attributes = Attributes()
      resolve(attributes)
    } catch (e) {
      reject({
        errorMsg: 'Error while loading data. Try again later.'
      })
    }
  })
}

export const postProduct = (params: any, token: string) => {
  return new Promise((resolve, reject) => {
    common.saveProductToDB(params, token).then((response) => {
      //console.log(response)
      const { data } = response
      resolve(data)
    })
  })
}


export const getProduct = (uid: number, pid: number) => {
  return new Promise((resolve, reject) => {
    common.getProductInfoDetail(uid, pid)
      .then((response: any) => {
        const { data } = response
        resolve(data)
      })
      .catch(() => { })
      .finally(() => { })
  })
}

export const loadSubAttrOptions = async (term: any, prevOptions: any, newAttrValues: any, search: string) => { 
  return await common.getSubAttributes(term).then((response) => {
    const responseJSON = response.data

    //load more
    const loadCondition = ( prevOptions && responseJSON.data && prevOptions.length < responseJSON.data.length ) || false

    //add new
    const newOption =  newAttrValues.find((element: any) => { return element.attr === term});
    const newOptionAdded =  prevOptions.some((element: any) => { return element.id === newOption.id});

    let options: any = responseJSON.data || []
  
    let addMoreOption = []
    if( !newOptionAdded && newOption ) {
      addMoreOption.push(newOption)
      if( !options ) options.push(newOption)
    }

    if( !search) {
      return {
        options: prevOptions.length <= 0 ? options : addMoreOption,
        hasMore: true
      };
    } else {   
      const searchLower = search.toLowerCase();
      const filterOption =  options.filter((item: any) => {
        return item.label.toLocaleLowerCase().includes(searchLower)
      })
  
      return {
        options: filterOption || [],
        hasMore: false
      };
    }
  })
}

export const loadAttributeOptions = async ( user_id: any, prevOptions: any, newAttrValue: any, search: any ) => {
  const response = await common.getAttributesNoChild(user_id)
  const responseJSON = await response.data
  const loadCondition = ( prevOptions && prevOptions.length === responseJSON.data.length )

  let options: any = []
  if( prevOptions.length <= 0) 
    options = responseJSON.data || []
  else {
    options = (loadCondition ? [] : newAttrValue) || []
  }

  if( !search) {
    return {
      options: options,
      hasMore: true
    };
  } else {   
    const searchLower = search.toLowerCase();
    const filterOption =  options.filter((item: any) => {
      return item.label.toLocaleLowerCase().includes(searchLower)
    })

    return {
      options: filterOption || [],
      hasMore: false
    };
  }
}


export const loadCategoriesOptions = async () => {
  const response = await common.getCategoires()
  const responseJSON = await response.data
  return {
    options: responseJSON.data || [],
    hasMore: false,
  };
}

export const loadProducts = async (userId: number) => {

  const response = await common.getProductsList(userId)
  const responseJSON = await response.data
  const termsList = await convertToList(responseJSON.data)
  return {
    options: termsList || [],
    hasMore: false,
  };
}

const convertToList = (data: any) => {
  const termsList: any = []
  data &&
    data.productsList &&
    data.productsList.forEach((e: any) => {
      termsList.push({ value: e.product_id, label: e.product_name.replace('&amp;', '&') })
    })

  return termsList
}


export const saveProductProperties = async (params: any) => {
  return common.updateProductAttr(params)
}


export const uploadImage = async (params: any) => {
  return common.uploadImage(params)
}