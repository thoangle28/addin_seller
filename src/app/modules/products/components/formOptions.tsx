import Dropzone from 'react-dropzone'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import * as common from '../redux/ProductsList'

export interface IAttribute {
  id: number
  title: string
  name: string
  visible: boolean
  variation: boolean
  options: Array<any>
}

export const initialForm = {
  name: '',
  content: '',
  is_variable: false, //simple
  type_product: 'simple',
  variations: [],
  attributes: [],
  thumnail: '',
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
  thumbnail: '',
  new_thumbnail: '',
}

export const TaxClass: any = [
  {value: 'parent', label: 'Same as parent'},
  {value: '', label: 'Standard'},
  {value: 'reduced-rate', label: 'Reduced rate'},
  {value: 'zero-rate', label: 'Zero rate'},
]

export const StockStatus: any = [
  {value: 'instock', label: 'In stock'},
  {value: 'outofstock', label: 'Out of stock'},
  {value: 'onbackorder', label: 'On backorder'},
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
      const {data} = response.data
      data &&
        data.forEach((e: any) => {
          termsList.push({value: e.term_id, label: e.name})
        })
    })
    .catch(() => {})

  return termsList
}

export const Categoies = () => {
  let termsList: any = []
  common
    .getCategoires()
    .then((response) => {
      const {data} = response.data
      data &&
        data.forEach((e: any) => {
          termsList.push({value: e.term_id, label: e.name})
        })
    })
    .catch(() => {})

  return termsList
}

export const Attributes = () => {
  let termsList: any = []
  let fullList: any = []

  common
    .getAttributes()
    .then((response) => {
      const {data} = response.data
      data &&
        data.forEach((item: any) => {
          //user for add more
          const newItem: IAttribute = {
            id: item.id,
            title: item.label,
            name: item.name,
            visible: false,
            variation: false,
            options: [],
          }

          fullList.push(newItem)

          termsList.push({value: item.id, label: item.label})
        })
      termsList.unshift({value: '', label: 'Custom product attribute'})
    })
    .catch(() => {})

  return {termsList, fullList}
}

export const SubAttributes = (term_slug: string) => {
  let termsList: any = []
  common
    .getSubAttributes(term_slug)
    .then((response) => {
      const {data} = response.data
      data &&
        data.forEach((e: any) => {
          termsList.push({value: e.term_id, label: e.name})
        })
    })
    .catch(() => {})

  return termsList
}

export const ProductDetail = (uId: number, pId: number) => {
  let productDetail: any = []
  common
    .getProductInfoDetail(uId, pId)
    .then((response) => {   
      const {data} = response.data
      return { ...data }
    })
    .catch(() => {})
}


export const ProductsList = (userId: number) => {
  let termsList: any = []

  common
    .getProductsList(userId)
    .then((response) => {
      const {data} = response.data
      data &&
        data.productsList &&
        data.productsList.map((e: any) => {
          termsList.push({value: e.product_id, label: e.product_name})
        })
    })
    .catch(() => {})

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
  const {setFileToState, setFieldValue, fileName} = props
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
          {({getRootProps, getInputProps}) => (
            <section className='notice d-flex bg-light-primary rounded border-primary border border-dashed py-3 px-2 dropzone dz-clickable'>
              <div {...getRootProps()}>
                <input {...getInputProps()} name={fileName} accept='image/*' />
                <div
                  className='dropzone-msg dz-message needsclick d-flex'
                  style={{cursor: 'pointer'}}
                >
                  <i className='bi bi-file-earmark-arrow-up text-primary fs-3x'></i>
                  <div className='ms-4'>
                    <span className='fs-9 text-gray-normal mb-1'>
                      Click here to change the thumbnail.
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
    <div className='text-center w-100='>
      <img src={toAbsoluteUrl('/media/logos/logo-v5-200.png')} alt='Addin Seller Portal' />
      <div className='mt-5'>
        <span>Loading ...</span>
      </div>
    </div>
  )
}
