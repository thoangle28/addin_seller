const date = new Date();
const currentDate = date.getDate();
date.setDate(currentDate);

export const CURRENT_MONTH: number = date.getMonth() + 1
export const CURRENT_YEAR: number = date.getFullYear()
export const CURRENT_DATE = date.toLocaleDateString('en-CA');

const now = date.getUTCFullYear();
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