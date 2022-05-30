export const toAbsoluteUrl = (pathname: string) => process.env.PUBLIC_URL + pathname
export const formatMoney = (money: string | number, currency: string = "$") => currency + money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
