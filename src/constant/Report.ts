import { iApiStatus, iTableHead } from "../models";

export let TABLE_PRODUCT_STATUS: iApiStatus[] = []
export let TABLE_PRODUCT_SALE_STATUS: any[] = []

const localization = process.env.REACT_APP_LOCALIZATION
switch (localization) {
    case 'MALAY':
        TABLE_PRODUCT_STATUS = [
            { key: '', name: 'All', btnStatus: '' },
            { key: 'wc-malaysia-custom-c', name: 'Malaysia Custom Clearance', btnStatus: 'primary' },
            { key: 'wc-out-for-delivery', name: 'Out For Delivery', btnStatus: 'info' },
            { key: 'wc-pending', name: 'Pending Payment', btnStatus: 'warning' },
            { key: 'wc-in-china-warehous', name: 'In China Warehouse', btnStatus: 'warning' },
            { key: 'wc-leave-china-port', name: 'Leave China Port', btnStatus: 'info' },
            { key: 'wc-reach-singapore-p', name: 'Arrives in Malaysia Port', btnStatus: 'success' },
            { key: 'wc-reach-tuas-wareho', name: 'Reach Tuas Warehouse', btnStatus: 'success' },
            { key: 'wc-failed', name: 'Failed', btnStatus: 'danger' },
            { key: 'wc-refunded', name: 'Refunded', btnStatus: 'danger' },
            { key: 'wc-cancelled', name: 'Cancelled', btnStatus: 'danger' },
            { key: 'wc-completed', name: 'Completed', btnStatus: 'success' },
            { key: 'wc-on-hold', name: 'On hold', btnStatus: 'warning' },
            { key: 'wc-processing', name: 'Processing', btnStatus: 'primary' },
        ]
        break;
    case 'SG':
        TABLE_PRODUCT_STATUS = [
            { key: '', name: 'All', btnStatus: '' },
            { key: 'wc-pending', name: 'Pending Payment', btnStatus: 'warning' },
            { key: 'wc-in-china-warehous', name: 'In China Warehouse', btnStatus: 'warning' },
            { key: 'wc-leave-china-port', name: 'Leave China Port', btnStatus: 'info' },
            { key: 'wc-reach-singapore-p', name: 'Reach Singapore Port', btnStatus: 'success' },
            { key: 'wc-reach-tuas-wareho', name: 'Reach Tuas Warehouse', btnStatus: 'success' },
            { key: 'wc-failed', name: 'Failed', btnStatus: 'danger' },
            { key: 'wc-refunded', name: 'Refunded', btnStatus: 'danger' },
            { key: 'wc-cancelled', name: 'Cancelled', btnStatus: 'danger' },
            { key: 'wc-completed', name: 'Completed', btnStatus: 'success' },
            { key: 'wc-on-hold', name: 'On hold', btnStatus: 'warning' },
            { key: 'wc-processing', name: 'Processing', btnStatus: 'primary' }
        ]
        break;

    default:
        break;
}

switch (localization) {
    case 'MALAY':
        TABLE_PRODUCT_SALE_STATUS = [ 
            { name: 'Processing', btnStatus: 'primary' },
            { name: 'Refunded', btnStatus: 'warning' },
            { name: 'In China Warehous ', btnStatus: 'info' },
            { name: 'Leave China Port', btnStatus: 'success' },
            { name: 'Arrives in Malaysia Port', btnStatus: 'success' },
            { name: 'Reach Tuas Wareho', btnStatus: 'success' },
            { name: 'Failed', btnStatus: 'danger' },
            { name: 'on hold', btnStatus: 'danger' },
            { name: 'Out For Delivery', btnStatus: 'danger' },
            { name: 'pending', btnStatus: 'warning' },
            { name: 'publish', btnStatus: 'success' },
            { name: 'completed', btnStatus: 'success' },
            { name: 'Malaysia Custom Clearance', btnStatus: 'success' },
        ]
        break;
    case 'SG':
        TABLE_PRODUCT_SALE_STATUS = [
            { name: 'Processing', btnStatus: 'primary' },
            { name: 'Refunded', btnStatus: 'warning' },
            { name: 'In China Warehous ', btnStatus: 'info' },
            { name: 'Leave China Port', btnStatus: 'success' },
            { name: 'Reach Singapore Port', btnStatus: 'success' },
            { name: 'Reach Tuas Wareho', btnStatus: 'success' },
            { name: 'Failed', btnStatus: 'danger' },
            { name: 'on hold', btnStatus: 'danger' },
            { name: 'pending', btnStatus: 'warning' },
            { name: 'publish', btnStatus: 'success' },
            { name: 'completed', btnStatus: 'success' },
        ]
        break;

    default:
        break;
}
export const TABLE_PRODUCT_SALE: iTableHead[] = [
    { name: '#ID', className: 'text-left' },
    { name: 'Product Name', className: 'text-left' },
    { name: 'Type', className: 'text-center' },
    { name: 'SKU', className: 'text-center' },
    { name: 'Price', className: 'text-end' },
    { name: 'Status', className: 'text-center' },
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
    { name: 'Order Status', className: 'text-center' },
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
