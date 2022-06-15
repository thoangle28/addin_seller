export const toAbsoluteUrl = (pathname: string) => process.env.PUBLIC_URL + pathname

const localAuth: any = JSON.parse(localStorage.getItem('persist:addin-seller-auth') || '{}')
export const { accessToken } = localAuth
