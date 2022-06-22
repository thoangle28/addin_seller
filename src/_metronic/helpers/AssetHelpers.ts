export const toAbsoluteUrl = (pathname: string) => process.env.PUBLIC_URL + pathname

const localAuth: any = JSON.parse(localStorage.getItem('persist:addin-seller-auth') || '{}')
const { accessToken } = localAuth
export const access_token = accessToken.split("\"")[1]

