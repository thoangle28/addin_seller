import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { RootState } from '../../../setup'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { AddinLoading } from '../../../_metronic/partials'
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