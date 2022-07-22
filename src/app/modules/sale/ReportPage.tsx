import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import Reports from './Reports'

const productBreadCrumbs: Array<PageLink> = [];

const ReportPage: React.FC = () => {
  return (
    <>
      <Switch>
        <Route path='/sale-report'>
          <PageTitle breadcrumbs={productBreadCrumbs}>Sale Reports</PageTitle>
          <Reports />
        </Route>
      </Switch>

    </>
  )
}

export default ReportPage