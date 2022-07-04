import { FC, useRef, useEffect, useState } from 'react'
import { shallowEqual, useSelector, connect, useDispatch, ConnectedProps } from 'react-redux'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import * as auth from './AuthRedux'
import { getUserByAccessToken } from './AuthCRUD'
import { RootState } from '../../../../setup'
import { useHistory } from 'react-router-dom';

const mapState = (state: RootState) => ({ auth: state.auth })
const connector = connect(mapState, auth.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const AuthInit: FC<PropsFromRedux> = (props) => {
  const didRequest = useRef(false)
  const dispatch = useDispatch()
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  //const accessToken: any = useSelector<RootState>(({auth}) => auth.accessToken, shallowEqual)
  const history = useHistory();
  const auth: any = useSelector<RootState>(({ auth }) => auth, shallowEqual)
  const { accessToken, expireDate, user } = auth
  const currentUserId: number = user ? user.ID : 0

  const logOut = () => {
    localStorage.clear();//clear all
    history.push('/auth/login')
  }
  // We should request user by authToken before rendering the application
  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const { data: user } = await getUserByAccessToken(accessToken, currentUserId)
          if (user.data) {  
            dispatch(props.fulfillUser(user.data)) //reupdate the user info
          }
          else {
            dispatch(props.logout())
            logOut();
          }
        }
      } catch (error) {
        //console.error(error)
        if (!didRequest.current) {
          dispatch(props.logout())
          logOut();
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    const currentDate: number = Date.now();

    if (accessToken && parseInt(expireDate) < currentDate && currentUserId > 0) {
      requestUser()
    } else {
      dispatch(props.logout())
      logOut();
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default connector(AuthInit)
