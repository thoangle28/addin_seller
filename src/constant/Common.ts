
import { iOrderOptions } from "../models";

export const FILTER_STATUS_OPTION: iOrderOptions[] = [
    { name: 'All', value: '' },
    { name: 'Draft', value: 'draft' },
    { name: 'Pending', value: 'pending' },
    { name: 'Publish', value: 'publishs' }
]

export const ITEMS_PER_PAGES: number[] = [10, 20, 30, 50, 100]
