export const CURRENT_MONTH: number = new Date().getMonth() + 1
export const CURRENT_YEAR: number = new Date().getFullYear()

const now = new Date().getUTCFullYear();
export const YEARS = Array(now - (now - 5))
    .fill('')
    .map((v, idx) => now - idx)
export const MONTHS: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]