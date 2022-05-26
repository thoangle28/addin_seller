import { iApiStatus } from "../models";

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
    { key: 'draft', name: 'Draft', btnStatus: 'secondary' },
    { key: 'trash', name: 'Trash', btnStatus: 'secondary' },
]
