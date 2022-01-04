import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import ProductList from './components/ProductList'
import ProductCreate from './components/ProductCreate'

const productBreadCrumbs: Array<PageLink> = [];

const ProductPage: React.FC = () => {
  return (
    <>
      <Switch>
        <Route path='/product/listing'>
          <PageTitle breadcrumbs={productBreadCrumbs}>Products Listing</PageTitle>
          <ProductList />
        </Route>
        <Route path='/product/create'>
          <PageTitle breadcrumbs={productBreadCrumbs}>Create Product</PageTitle>
          <ProductCreate />
        </Route>       
        <Route path='/product/update'>
          <PageTitle breadcrumbs={productBreadCrumbs}>Update Product</PageTitle>
          <ProductCreate />
        </Route> 
      </Switch>
      {/* <TablesWidget14 className='mb-5 mb-xl-8' /> */}
    </>
  )
}

export default ProductPage
