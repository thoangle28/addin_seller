import { ProfileDetails } from './cards/ProfileDetails'
import { SignInMethod } from './cards/SignInMethod'

type Props = {
  onChangeStatus?: (s: boolean) => void
}

export const Settings = ({ onChangeStatus = (s: boolean) => undefined }: Props) => {
  const changeUpdateProfile = (status: boolean) => {
    onChangeStatus(status)
  }

  return (
    <>
      <ProfileDetails onUpdateProfile={changeUpdateProfile} />
      <SignInMethod />
      {/* <ConnectedAccounts />
      <EmailPreferences />
      <Notifications /> */}
      {/* <DeactivateAccount /> */}
    </>
  )
}
