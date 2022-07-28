<?php 


require_once('inc/api-ticket.php');
require_once('inc/rest-api-ticket.php');

// API Ticket Lists
add_action( 'rest_api_init', 'addin_ticket_register_rest_api' );
function addin_ticket_register_rest_api () {
  /***
   * API get ticket list
  */
  $route = '/ticket/list';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_get_ticket_list',
      'permission_callback' => '__return_true'
    ) 
  );

  /***
   * API get messages for ticket
  */
  $route = '/ticket/message';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_get_messages_for_ticket',
      'permission_callback' => '__return_true'
    ) 
  );

  /***
   * API Get products from Order
   */   
  $route = '/ticket/get-products-from-order';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_get_products_from_order',
      'permission_callback' => '__return_true'
    ) 
  );

  /***
  * API Create ticket
  */
  $route = '/ticket/create-ticket';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_create_ticket_api',
      'permission_callback' => '__return_true'
    ) 
  );

  /***
   * API Get list order
   */   
  $route = '/ticket/get-list-order-by-customer';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_get_list_order',
      'permission_callback' => '__return_true'
    ) 
  );

  /***
  * API Create message for a ticket
  */
  $route = '/ticket/create-message-for-ticket';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_create_message_for_ticket',
      'permission_callback' => '__return_true'
    ) 
  );
  
  /***
  * API Change status ticket
  */
  $route = '/ticket/change-status-ticket';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_change_status_ticket',
      'permission_callback' => '__return_true'
    ) 
  );
    /***
  * API ticket detail
  */
  $route = '/ticket/ticket-detail';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_detail',
      'permission_callback' => '__return_true'
    ) 
  );

  /***
  * API Get all brand
  */
  $route = '/ticket/brands';
  register_rest_route( 
    NAME_TICKET_SPACE . VERSION,$route,
    array(
      'methods' => 'POST',
      'callback' => 'addin_ticket_get_all_seller_brand',
      'permission_callback' => '__return_true'
    ) 
  );

 
}

function addin_ticket_message_status($code = 200, $message = null, $data = [])  {
  return [ 'code' => $code, 'message' => $message, 'data' => $data ];
}