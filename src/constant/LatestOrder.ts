import { iApiStatus } from "../models";

export const LASTEST_ORDER_STATUS: iApiStatus[] = [
    { value: 'wc-pending', name: 'Pending payment', btnStatus: 'default' },
    { value: 'wc-in-china-warehous', name: 'In China Warehouse', btnStatus: 'default' },
    { value: 'wc-leave-china-port', name: 'Leave China Port', btnStatus: 'default' },
    { value: 'reach-singapore-p', name: 'Reach Singapore Port', btnStatus: 'default' },
    { value: 'wc-reach-tuas-wareho', name: 'Reach Tuas Warehouse', btnStatus: 'default' },
    { value: 'wc-failed', name: 'Failed', btnStatus: 'default' },
    { value: 'wc-refunded', name: 'Refunded', btnStatus: 'default' },
    { value: 'wc-cancelled', name: 'Cancelled', btnStatus: 'default' },
    { value: 'wc-completed', name: 'Completed', btnStatus: 'default' },
    { value: 'wc-on-hold', name: 'On hold', btnStatus: 'default' },
    { value: 'wc-processing', name: 'Processing', btnStatus: 'default' },
    { value: 'draft', name: 'Draft', btnStatus: 'default' },
    { value: 'trash', name: 'Trash', btnStatus: 'default' },
]