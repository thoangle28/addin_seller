import { iApiStatus, iPopupStatus, iTableHead } from "../models";

export const TABLE_STATUS: iApiStatus[] = [
    { key: 'wc-pending', name: 'Pending payment', btnStatus: 'default' },
    { key: 'wc-in-china-warehous', name: 'In China Warehouse', btnStatus: 'warning' },
    { key: 'wc-leave-china-port', name: 'Leave China Port', btnStatus: 'info' },
    { key: 'reach-singapore-p', name: 'Reach Singapore Port', btnStatus: 'success' },
    { key: 'wc-reach-tuas-wareho', name: 'Reach Tuas Warehouse', btnStatus: 'success' },
    { key: 'wc-failed', name: 'Failed', btnStatus: 'danger' },
    { key: 'wc-refunded', name: 'Refunded', btnStatus: 'info' },
    { key: 'wc-cancelled', name: 'Cancelled', btnStatus: 'danger' },
    { key: 'wc-completed', name: 'Completed', btnStatus: 'success' },
    { key: 'wc-on-hold', name: 'On hold', btnStatus: 'warning' },
    { key: 'wc-processing', name: 'Processing', btnStatus: 'warning' },
    { key: 'trash', name: 'Trash', btnStatus: 'secondary' },
]

export const ORDER_LIST_TABLE: iTableHead[] = [
    { name: 'Order Id', className: 'align-middle' }, 
    { name: 'Customer\'s Name', className: 'align-middle text-start' }, 
    { name: 'Order Status', className: 'align-middle text-center' },
    { name: 'Price', className: 'align-middle text-end' },
    { name: 'Date Created', className: 'align-middle text-end' },
    { name: 'Actions', className: 'align-middle text-center' },
]

export const ORDER_LIST_POPUP_TABLE: iTableHead[] = [
    { name: 'Product ID', className: 'align-middle text-center' },
    { name: 'Product Name', className: 'align-middle' },
    { name: 'Quantity', className: 'align-middle text-center' },
    { name: 'SKU', className: 'align-middle text-center' },
    { name: 'Variation ID', className: 'align-middle text-center' },
]

export const FILTER_STATUS: iPopupStatus[] = [
    { status: 'wc-processing', name: 'Processing' },
    { status: 'wc-cancelled', name: 'Cancelled' },
    { status: 'wc-on-hold', name: 'On Hold' },
    { status: 'wc-completed', name: 'Completed' },
]
