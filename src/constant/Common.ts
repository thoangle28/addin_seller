
import { iOrderOptions } from "../models";

export const FILTER_STATUS_OPTION: iOrderOptions[] = [
    { name: 'All', value: '' },
    { name: 'Draft', value: 'draft' },
    { name: 'Pending', value: 'pending' },
    { name: 'Publish', value: 'publishs' }
]

interface iCountry {
    [key: string]: string
}

export const COUNTRY: iCountry = {
    "MALAY": 'Malaysia',
    "VN": 'Vietnam',
    "PH": 'Philippines',
    "ID": 'Indonesia',
    "TH": 'Thailand',
    "HK": 'Hongkong',
    "TW": 'Taiwan',
    "SG": 'SG'
}

export const ITEMS_PER_PAGES: number[] = [10, 20, 30, 50, 100]
