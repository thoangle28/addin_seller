<?php
/**
 * API get ticket
*/

function addin_ticket_get_ticket_list($request) {
    global $wpdb;

    $status = $request->get_param("status");

    $current_page = $request->get_param("current_page");
    $current_page = $current_page > 0 ? $current_page : 1;

    $page_size = $request->get_param("page_size");
    $page_size = ($page_size > 0) ? $page_size : 10;

    //user id
    $customer_id = $request->get_param("id");

    $check_user = addin_ticket_check_id($customer_id);

    if($check_user =='seller') {
        $checkId = "(t.brand_id = %d or t.customer_id = %d)";
    } else {
        $checkId = "t.customer_id = %d";
    }
    
    $ticket_list = $wpdb->prefix . "addin_ticket_list";
    $sqlStatus = "AND t.status like '%{$status}%'";

    $sqlCondition = "FROM $ticket_list as t 
                        WHERE {$checkId} {$sqlStatus}  
                        ORDER BY t.created 
                        DESC";
	$list_ticket = $wpdb->prepare(" SELECT COUNT(t.id) {$sqlCondition}", $customer_id, $customer_id);
    $total_ticket = $wpdb->get_var( $list_ticket);
    
    
    $total_pages = ceil($total_ticket / $page_size);
    $start = ($current_page -1) * $page_size;

    if($current_page > $total_pages ){

        $response = [
            'total_pages' => $total_pages,
            'total_ticket' => $total_ticket,
            'current_page' =>  $current_page,
            'page_size' =>   $page_size,
            'ticket_list' =>  []
        ];
        
        return addin_ticket_message_status( 404, esc_html__('Current page is bigger than Total pages, please check current page', 'addin.sg'), $response);

    } else {
        $querySelect = "SELECT * {$sqlCondition} LIMIT %d, %d";
                        
        $list_ticket_limit = $wpdb->prepare($querySelect, $customer_id, $customer_id, $start, $page_size );
        $data_list_limit = $wpdb->get_results( $list_ticket_limit);
       
        if(!empty($data_list_limit)){

            $list = [];
            $lists = [];

            foreach ($data_list_limit as $data) {
                $list["id"] = $data->id;
                $list["customer_id"] = $data->customer_id;
                $list["customer"] = addin_ticket_get_customer($data->customer_id);
                $list["order_id"] = $data->order_id;
                $list["category"] = $data->category;
                $list["product_name"] = $data->product_name;
                $list["subject"] = $data->subject;
                $list["count_ticket"] = addin_ticket_count_reply_for_ticket($data->id);
                $list["message_content"] = addin_ticket_get_message_content_for_ticket($data->id);
                $list["status"] = $data->status;
                $list["brand_id"] = $data->brand_id;
                $list["created"] = $data->created;
                array_push($lists,$list);
            }

            $response = [
                'total_pages' => $total_pages,
                'total_ticket' => $total_ticket,
                'current_page' => $current_page,
                'page_size' => $page_size,
                'ticket_list' => $lists
            ];

            return addin_ticket_message_status( 200, null, $response);

        }else {
            return addin_ticket_message_status( 404, esc_html__('Ticket list is not found!', 'addin.sg'), null);
        }
     
    }
}

// check Id customer(customer or brand)
function addin_ticket_check_id($customer_id) {

    $check_user = get_user_by('id', $customer_id);
    $roles = $check_user -> roles;
    
    $role_name = 'customer';
    if( in_array("seller_portal", $roles, true) ) $role_name = 'seller';

    return $role_name;
   
}

function addin_ticket_get_customer($user_id){
    
    $select_customer = get_user_by( 'id', $user_id );
    $customer = $select_customer->display_name;
    $niceName = $select_customer->user_nicename;
    if($customer) {
        return $customer;
    }
    return $niceName;
}

function addin_ticket_count_reply_for_ticket($ticket_id){
    
    global $wpdb;
    $select_message = $wpdb->prefix . "addin_ticket_message";
    $sql = $wpdb->prepare("SELECT COUNT(t.ticket_id) 
                            FROM $select_message as t 
                            WHERE t.ticket_id = %d  
                            ORDER BY t.ticket_created_on",$ticket_id );
    $count = $wpdb->get_var( $sql);
    $count_ticket = $count - 1;
    return $count_ticket;
}

function addin_ticket_get_message_content_for_ticket($ticket_id){
    global $wpdb;
    $ticket_message = $wpdb->prefix . "addin_ticket_message";
    $sql = $wpdb->prepare("SELECT t.ticket_message FROM $ticket_message as t 
                            WHERE t.ticket_id = %d  
                            ORDER BY t.ticket_created_on", $ticket_id );
    $message_content = $wpdb->get_var( $sql);
    return $message_content;
}

function addin_ticket_get_messages_for_ticket ( $request) {
    global $wpdb;
    $ticket_id = $request->get_param("ticket_id");
    
    $ticket_message_table = $wpdb->prefix . "addin_ticket_message";

    $data_messages = $wpdb->prepare("SELECT * FROM $ticket_message_table WHERE `ticket_id` = %d ",$ticket_id);
    $data = $wpdb->get_results( $data_messages);
    if ($ticket_id) {
        if($data){
            foreach($data as $value) {
                $value ->attchment_name = addin_ticket_get_url_attchement($value->attchment_id);         
            }
            return addin_ticket_message_status( 200, null, $data);
        }else {
            return addin_ticket_message_status( 404, esc_html__('Messages for Ticket is not found!', 'addin.sg'), null);
        } 
    } else{
        return addin_ticket_message_status( 404, esc_html__('please add ticket id!', 'addin.sg'), null);
    }
      
      
}

//  Get data atctchement from attchement_id
function addin_ticket_get_url_attchement($message_attchment_id) {
    global $wpdb;
    $ticket_images_table = $wpdb->prefix . "addin_ticket_images";

    if(!empty($message_attchment_id)) {
        $explode_attchment_id = explode(',',$message_attchment_id);
        $data = [];

            $sql = "SELECT * FROM $ticket_images_table  WHERE `id` IN ($message_attchment_id) ";
            $data_attchement = $wpdb->get_results($wpdb->prepare($sql)); 

            foreach($data_attchement as $value){
                $data []=[
                    'id'=>$value->id,
                    'name'=>$value->name,
                    'type'=>$value->type,
                    'path'=>$value->path,
                    'created_on'=>$value->created_on,
                ];
            }

        return $data;
    }
   
}

/***
   * API Get list order
   */  
function addin_ticket_get_list_order ($request) {
   
    global $wpdb;

    $customer_id = $request->get_param("customer_id");

    $current_page = $request->get_param("current_page");
    $current_page = $current_page > 0 ? $current_page : 1;

    $page_size = $request->get_param("page_size");
    $page_size = ($page_size > 0) ? $page_size : 10;
   
    $args = array(
        'posts_per_page' => $page_size,
        'paged' => $current_page,
        'meta_key' => '_customer_user',
        'orderby' => 'date',
        'order' => 'DESC',
        'meta_value' => $customer_id,
        'post_type' => wc_get_order_types(),
        'post_status' => array_keys(wc_get_order_statuses()), 'post_status' => array('wc-processing'),
      
      );

    $customer_orders = new WP_Query($args);
 
    $total_order = $customer_orders->found_posts;
    $total_pages = $customer_orders->max_num_pages;
 
    if($current_page > $total_pages ){
        $response = [
            'total_pages' => $total_pages,
            'total_order' => $total_order,
            'current_page' =>  $current_page,
            'page_size' =>   $page_size,
            'order_list' =>  []
        ];
        return addin_ticket_message_status( 404, esc_html__('Current page is bigger than Total pages, please check current page', 'addin.sg'), $response);

    } else {
       
        $order_list = []; 
              
        if(!empty($customer_orders->posts)) {

            foreach ($customer_orders->posts as $customer_order) {
                $order = wc_get_order($customer_order);
                
                $order_list[] = [
                    "id" => $order->get_id(),
                    "total" => $order->get_total()." ".$order->currency." for ".$order->get_item_count(). (($order->get_item_count() < 2) ? " item " :" items "),
                    "date" => date('Y-m-d',strtotime($order->get_date_created())),
                    'order_status' => substr($order->post_status,3),
                    'count_ticket'=> addin_ticket_count_ticket_in_order( $order->get_id()),
                    'total_item' => $order->get_item_count(),
                    'currency' => $order->currency 
                ];
        
            }

            $response = [
                'total_pages' => $total_pages,
                'total_order' => $total_order,
                'current_page' =>  $current_page,
                'page_size' =>   $page_size,
                'order_list' =>  $order_list
            ];

            return addin_ticket_message_status( 200, null, $response);
        }else {
            return addin_ticket_message_status( 404, esc_html__('please check customer id', 'addin.sg'), null);
        }
    }
 
}

// Count ticket in order
function addin_ticket_count_ticket_in_order($order_id) {

    global $wpdb;
    $ticket_list_table = $wpdb->prefix . "addin_ticket_list";
    $data_ticket = $wpdb->prepare("SELECT * FROM $ticket_list_table WHERE `order_id` = %d",$order_id);
    $data = $wpdb->get_results( $data_ticket);
    if($data) {
        return $count = count($data);
    } else {
        return $count = 0;
    }
  
}