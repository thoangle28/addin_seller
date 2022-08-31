import React, { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import AuthInit from './modules/auth/redux/AuthInit'
import { Routes } from './routing/Routes'

type Props = {
  basename: string
}

const App: React.FC<Props> = ({ basename }) => {
  useEffect(() => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  }, []);

  const localization = process.env.REACT_APP_LOCALIZATION
  useEffect(() => {
    switch (localization) {
      case 'MALAY':
        document.title = 'Addin Malaysia | Addin Seller Portal'
        break;
      case 'VN':
        document.title = 'Addin Vietnam | Addin Seller Portal'
        break;
      case 'PH':
        document.title = 'Addin Philippines | Addin Seller Portal'
        break;
      case 'ID':
        document.title = 'Addin Indonesia | Addin Seller Portal'
        break;
      case 'TH':
        document.title = 'Addin Thailand | Addin Seller Portal'
        break;
      case 'HK':
        document.title = 'Addin Hongkong | Addin Seller Portal'
        break;
      case 'TW':
        document.title = 'Addin Taiwan | Addin Seller Portal'
        break;
      default:
        document.title = 'Addin SG | Addin Seller Portal'
        break;
    }
  }, [])
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <BrowserRouter basename={basename}>
        <I18nProvider>
          <LayoutProvider>
            <AuthInit>
              <Routes />
            </AuthInit>
          </LayoutProvider>
        </I18nProvider>
      </BrowserRouter>
    </Suspense>
  )
}

export { App }
