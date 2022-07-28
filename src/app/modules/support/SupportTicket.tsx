import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import CreateTicket from './components/CreateTicket'
import TicketDetails from './components/TicketDetails'
import TicketsList from './components/TicketsList'
import OrdersList from './components/OrdersList'

const ticketBreadCrumbs: Array<PageLink> = [];

const SupportTicket: React.FC = () => {
  return (
    <>
      <Switch>
        <Route path='/support/ticket/create'>
          <PageTitle breadcrumbs={ticketBreadCrumbs}>Create Ticket</PageTitle>
          <CreateTicket />
        </Route>
        <Route path='/support/ticket/details'>
          <PageTitle breadcrumbs={ticketBreadCrumbs}>Ticket Details</PageTitle>
          <TicketDetails />
        </Route>       
        <Route path='/support/ticket/listing'>
          <PageTitle breadcrumbs={ticketBreadCrumbs}>Tickets Listing</PageTitle>
          <TicketsList />
        </Route> 
        <Route path='/support/orders/listing'>
          <PageTitle breadcrumbs={ticketBreadCrumbs}>Orders Listing</PageTitle>
          <OrdersList />
        </Route>
        
      </Switch>
    </>
  )
}

export default SupportTicket