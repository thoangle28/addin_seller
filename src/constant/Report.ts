import { iTableHead } from "../models";

export const TABLE_PRODUCT_SALE: iTableHead[] = [
    { name: '#ID', className: 'text-left' },
    { name: 'Product Name', className: 'text-left' },
    { name: 'Type', className: 'text-center' },
    { name: 'SKU', className: 'text-center' },
    { name: 'Price', className: 'text-end' },
    { name: 'Status', className: 'text-start' },
    { name: 'Date Created', className: 'text-end' },
]

export const TABLE_PRODUCT_SOLD: iTableHead[] = [
    { name: 'Order ID', className: 'text-start' },
    { name: 'Product Name', className: 'text-left' },
    { name: 'SKU', className: 'text-center' },
    { name: 'Quantity', className: 'text-center' },
    { name: 'Total', className: 'text-end' },
    { name: 'Date Created', className: 'text-end' },
]

export const TABLE_PRODUCT_ORDER: iTableHead[] = [
    { name: 'Order ID', className: 'text-start' },
    { name: 'Customer\'s Name', className: 'text-left' },
    { name: 'Order Status', className: 'text-start' },
    { name: 'Total', className: 'text-end' },
    { name: 'Date Created', className: 'text-end' },
]

export const TABLE_CUSTOMER_SALE: iTableHead[] = [
    { name: 'No.', className: 'text-start' },
    { name: 'Full Name', className: 'text-start' },
    { name: 'Email', className: 'text-start' },
    { name: 'Phone', className: 'text-center' },
    { name: 'City', className: 'text-center' },
    { name: 'Country', className: 'text-center' },
]

export const TABLE_PRODUCT_ORDER_REFUND: iTableHead[] = [
    { name: 'Order ID', className: 'text-start' },
    { name: 'Product Name', className: 'text-left' },
    { name: 'SKU', className: 'text-center' },
    { name: 'Total', className: 'text-end' },
    { name: 'Date Created', className: 'text-end' },
]
