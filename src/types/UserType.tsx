interface UserType {
  email: string,
  password: string,
  confirmPassword: string,
  phone: string,
  storeName: string,
  storeUid: string,
  termsAndConditions: boolean
}

interface UserError {
  error: string[]
}

export type { UserType, UserError };