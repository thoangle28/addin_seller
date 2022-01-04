import * as common from '../redux/ProductsList'

/* export const variantOption = [
  { id: 'enabled', label: 'Enabled' },
  { id: 'downloadable', label: 'Downloadable' },
  { id: 'virtual', label: 'Virtual' },
  { id: 'manage_stock', label: 'Manage stock?' }
]
 */
export  const initialForm = {
  name: '',
  content: "",
  is_variable: false, //simple
  variations: [],
  attributes: [],
  thumnail: '',
  photo_galleries: [],
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
}

export const options = [
  {value: 'chocolate', label: 'Chocolate'},
  {value: 'strawberry', label: 'Strawberry'},
  {value: 'vanilla', label: 'Vanilla'},
]

export const styles = {
  multiValue: (styles: any) => {
    return {
      ...styles,
      backgroundColor: '#009ef7',
      borderRadius: '5px',
      padding: '5px',
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
  common.getShippingClass()
  .then((response) => {
    const {data} = response.data 
    data && data.forEach((e: any) => {
      termsList.push({ 'value': e.term_id, 'label': e.name })
    });
  }).catch(() => {}) 

  return termsList
}


export const Categoies = () => {
  let termsList: any = []
  common.getCategoires()
  .then((response) => {
    const {data} = response.data 
    data && data.forEach((e: any) => {
      termsList.push({ 'value': e.term_id, 'label': e.name })
    });
  }).catch(() => {}) 

  return termsList
}


export const Attribues = () => {
  let termsList: any = []
  common.getAttributes()
  .then((response) => {
    const {data} = response.data 
    data && data.forEach((e: any) => {
      termsList.push({ value: e.id, label: e.label })
    });
    termsList.unshift({ value: '', label: 'Custom product attribute' })
  }).catch(() => {}) 

  return termsList
}

export const ProductsList = (userId: number) => {
  let termsList: any = []
  
  common.getProductsList(userId)
  .then((response) => {    
    const { data } = response.data

    data && data.productsList && data.productsList.map((e: any) => {
      termsList.push({ value: e.product_id, label: e.product_name })
    });
  
  }).catch(() => {}) 

  return termsList
}