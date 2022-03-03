export interface IProfileDetails {
  email: string
  personal_photo: string
  new_personal_photo: string
  avatar: string
  new_avatar: string
  firstname: string
  lastname: string
  company: string
  brand: { id: number, name: string, logo: string }
  contactPhone: string
  contactEmail: string
  address: string
  country: string
  language: string
  timeZone: string
  currency: string
  communications: {
    email: boolean
    phone: boolean
  }
  allowMarketing: boolean
}

export interface IUpdateEmail {
  newEmail: string
  confirmPassword: string
}

export interface IUpdatePassword {
  currentPassword: string
  newPassword: string
  passwordConfirmation: string
}

export interface IConnectedAccounts {
  google: boolean
  github: boolean
  stack: boolean
}

export interface IEmailPreferences {
  successfulPayments: boolean
  payouts: boolean
  freeCollections: boolean
  customerPaymentDispute: boolean
  refundAlert: boolean
  invoicePayments: boolean
  webhookAPIEndpoints: boolean
}

export interface INotifications {
  notifications: {
    email: boolean
    phone: boolean
  }
  billingUpdates: {
    email: boolean
    phone: boolean
  }
  newTeamMembers: {
    email: boolean
    phone: boolean
  }
  completeProjects: {
    email: boolean
    phone: boolean
  }
  newsletters: {
    email: boolean
    phone: boolean
  }
}

export interface IDeactivateAccount {
  confirm: boolean
}

export const profileDetailsInitValues: IProfileDetails = {
  email: '',
  personal_photo: '',
  new_personal_photo: '',
  avatar: '',
  new_avatar: '',
  firstname: '',
  lastname: '',
  company: '',
  brand: {
    id: 0, name: '', logo: ''
  },
  contactPhone: '',
  contactEmail: '',
  address: '',
  country: '',
  language: '',
  timeZone: '',
  currency: '',
  communications: {
    email: false,
    phone: false,
  },
  allowMarketing: false,
}

export const updateEmail: IUpdateEmail = {
  newEmail: 'support@keenthemes.com',
  confirmPassword: '',
}

export const updatePassword: IUpdatePassword = {
  currentPassword: '',
  newPassword: '',
  passwordConfirmation: '',
}

export const connectedAccounts: IConnectedAccounts = {
  google: true,
  github: true,
  stack: false,
}

export const emailPreferences: IEmailPreferences = {
  successfulPayments: false,
  payouts: true,
  freeCollections: false,
  customerPaymentDispute: true,
  refundAlert: false,
  invoicePayments: true,
  webhookAPIEndpoints: false,
}

export const notifications: INotifications = {
  notifications: {
    email: true,
    phone: true,
  },
  billingUpdates: {
    email: true,
    phone: true,
  },
  newTeamMembers: {
    email: true,
    phone: false,
  },
  completeProjects: {
    email: false,
    phone: true,
  },
  newsletters: {
    email: false,
    phone: false,
  },
}

export const deactivateAccount: IDeactivateAccount = {
  confirm: false,
}
