import React, { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import AuthInit from './modules/auth/redux/AuthInit'
import { Routes } from './routing/Routes'
import { COUNTRY } from './../constant'
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

  const localization: string = process.env.REACT_APP_LOCALIZATION || ''

  const showPageTitle = (title: string): string => document.title = `Addin ${!COUNTRY[title] ? 'SG' : COUNTRY[title]} | Addin Seller Portal`

  useEffect(() => {
    showPageTitle(localization)
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
