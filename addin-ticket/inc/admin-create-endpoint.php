<?php

// Register endpoint
function my_account_create_support_ticket_endpoints()
{
    add_rewrite_endpoint('create-support-ticket', EP_ROOT | EP_PAGES);
    add_rewrite_endpoint('support-ticket-general', EP_ROOT | EP_PAGES);
}

add_action('init', 'my_account_create_support_ticket_endpoints');

/**
 * Add new query var.
 *
 * @param array $vars
 * @return array
 */
function my_account_create_support_ticket_query_vars($vars)
{
    $vars[] = 'create-support-ticket';
    $vars[] = 'support-ticket-general';
    return $vars;
}

add_filter('query_vars', 'my_account_create_support_ticket_query_vars', 0);



function my_account_custom_insert_after_helper($items, $new_items, $after)
{
    // Search for the item position and +1 since is after the selected item key.
    $position = array_search($after, array_keys($items)) + 1;

    // Insert the new item.
    $array = array_slice($items, 0, $position, true);
    $array += $new_items;
    $array += array_slice($items, $position, count($items) - $position, true);

    return $array;
}

function my_account_create_support_ticket_menu_items($items)
{
    $new_items = array();
    $new_items['create-support-ticket'] = __('Create Support Ticket', 'woocommerce');
    $new_items['support-ticket-general'] = __('Support Ticket General', 'woocommerce');

    // Add the new item after `orders`.
    return my_account_custom_insert_after_helper($items, $new_items, 'orders');
}

add_filter('woocommerce_account_menu_items', 'my_account_create_support_ticket_menu_items');

// Create support ticket page content
add_action('woocommerce_account_create-support-ticket_endpoint', 'my_account_create_support_ticket_content');

function my_account_create_support_ticket_content()
{
    // if (!empty($_POST['create_ticket'])) {
    //     addin_ticket_create_ticket();
    // }
    $order_array = addin_ticket_admin_get_all_order_customer();
   
    $product = [];
    foreach($order_array as $value) {
        $product [ $value['ID']] = addin_ticket_admin_get_products_from_order($value['ID']);
    }

    $all_brand = addin_ticket_admin_get_all_seller_brand();
    $test = addin_ticket_get_brand_by_product_in_order();
    // $key = array_search(91133, array_column($test, 'post_id'));
    // print($key);
   
    // $name = get_user_meta( 5);
    // $name = get_userdata( 5);
    // $productss = addin_ticket_admin_get_product_name_by_seller_brand(5);
    // print "<pre>";
    // print_r($test);
    // print "</pre>";

?>

   
</div>
    <h3 class="account-sub-title d-none d-md-block mb-3 mt-2"><i class="Simple-Line-Icons-social-dropbox align-middle m-r-sm"></i>Create Support Ticket</h3>
    <form id="create-new-ticket" class="create-support-ticket" method="post" enctype="multipart/form-data">
        <div class="ticket-order pt-4 pb-3 p-l-lg p-r-lg">
            <div id="ticket_area" class="ticket_area">
                <h2>Ticket</h2>
                <div class="tickets_container">
                    <div class="new_ticket_box">
                        <div class="new_ticket_content">
                            <div class="categories">
                                <label>Category</label>
                                <select id="categories" name="categories" class="category" >
                                    <option value="" selected  >Select Categories</option>
                                    <option id="general-enquiry" value="general">General Enquiry</option>
                                    <option id="order-enquiry" value="order" >Order Enquiry</option>
                                </select>
                            </div>
                            <div class="brand-list">
                                <label>Brand Name</label>
                                <select id="brand-name" name="brand-name" class="brand-name" >
                                    <option value="" selected  >Select Brand</option>
                                    <?php
                                   
                                    foreach($all_brand as $value) {
                                        ?>
                                        <option data-brand-id="<?php print $value->user_id; ?>" value="<?php print $value->user_id; ?>"><?php print $value->name; ?></option>
                                        <?php
                                    }
                                    ?>
                                </select>
                            </div>
                            <div class="order-number-list">
                                <label>Order Number</label>
                                <select id="order-number" name="order-number" class="order-number" >
                                    <option data-order-id="" value="" selected   >Select Order</option>
                                    <?php
                                    foreach($order_array as $value) {
                                        ?>
                                        <option data-order-id="<?php print $value['ID']; ?>" value="<?php print $value['ID']; ?>"><?php print $value['ID']; ?></option>
                                        <?php
                                    }
                                    ?>
                                </select>
                            </div>
                         
                            <div class="product-list">
                                <label class="product-label">Products</label>
                                <select id="product-list" name="product-list" class="product-list-order">
                                    <option value="" selected >Select Product</option>
                                   
                                </select>
                            </div>
                           
                            <label class="subject-label">Subject</label>
                            <input type="text" name="subject" id="new_ticket_subject" class="new_ticket_subject" maxlength="1000">
                            <label class="message-label">Message</label>
                            <textarea name="message" id="new_ticket_message" class="new_ticket_message"  placeholder="New message"></textarea>
                            <label class="attachment-label">Attachments</label>
                            <input class="files-data" type="file" id="file-attachment" name="image[]" multiple="multiple">
                            <div class="image-error"></div>
                            <div class="add-ticket" >
                                <input name="create_ticket" type="submit" class="button button-add-ticket" id="open_new_ticket" value="Create new ticket" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
 
    <div class="after-loading-success-create-ticket" style="display: none;">
        <div class="ticket-background-overlay"></div>
        <div class="loader success-create-ticket-container">
            <div class="msg-box">
                    <p class="message-success"></p>        
            </div>     
        </div>
    </div>
    <?php
}

// Create support ticket general page content
add_action('woocommerce_account_support-ticket-general_endpoint', 'my_account_support_ticket_general_content');

function my_account_support_ticket_general_content()
{
    // addin_ticket_admin_render_list_ticket('general');

    $data ='';
    $data.='<div class = "ticket_list_pag_loading">
            <div class = "ticket_list_pag_container">
                <div class="ticket-universal-content"></div>
            </div>
        </div>';
    print $data;
}


//  AJAX Render Products By Order
add_action( 'wp_ajax_get_product_by_order', 'addin_ticket_ajax_get_product_by_order' );
add_action( 'wp_ajax_nopriv_get_product_by_order', 'addin_ticket_ajax_get_product_by_order' );
function addin_ticket_ajax_get_product_by_order() {
 
    $order_id = $_POST['order_id'];
    $product_array = [];

    $order = wc_get_order($order_id);
  
    if(!empty($order)) {
      $items = $order->get_items();
      $data = '';
      $data_brand = '';
      
      foreach ($items as $item) {
        $image_url = wp_get_attachment_image_src( get_post_thumbnail_id( $item['product_id']), 'single-post-thumbnail' );
    
        $product_array[] = [
          'name' => $item['name'],
          'id' => $item['product_id'],
          'product_variation_id' => $item['variation_id'],
          'quantity' => $item['quantity'],
          'image_url' =>  $image_url [0]
        ];
      }
      
      $product_seller = addin_ticket_get_brand_by_product_in_order();
      $name_product = [];
      $data_brand .= '<option value="" selected >Select Brand</option>';

      foreach($product_array as $product)
      {
          $data .= '<option value="'.$product["id"].'">'.$product["name"].'</option>';
         $key =  array_search($product["id"], array_column($product_seller, 'post_id'));
         if(isset($key)){
            $name_product []= [
                'name' => $product_seller [$key]->name,
                'user_id' => $product_seller [$key]->user_id
                ];
         }

      }
 
      $name_product = array_map("unserialize", array_unique(array_map("serialize", $name_product)));
      foreach($name_product as $name) {
        $data_brand .='<option value="'.$name["user_id"].'">'.$name["name"].'</option>';
      }
      
      $output = [
        'data' => $data,
        'order_id'=>$order_id,
        'name_product' =>$name_product,
        'data_brand' => $data_brand
      ];

      print wp_json_encode($output);

    } 
   
 
    die();
}


// AJAX Submit Form To Create New Ticket
add_action( 'wp_ajax_submit_ticket', 'addin_ticket_ajax_submit_ticket' );
add_action( 'wp_ajax_nopriv_wp_ajax_submit_ticket', 'addin_ticket_ajax_submit_ticket' );

function addin_ticket_ajax_submit_ticket() {
    global $wpdb;
    $data = [];
    parse_str($_POST['data'], $data);
   
  $user = get_current_user_id();
  $data_image = addin_ticket_save_image('image');
    if(empty($data_image['error'])) {
        $id = [];
        foreach ($data_image['data_image'] as $value) {
            $id [] = $value['id'];
        }
        $attachment_id = implode(",",$id);
    
        $subject= $data['subject'];
        $categories= $data['categories'];
        $product_list= $data['product-list'];
        $order_number= $data['order-number'];
        $brand_id= $data['brand-name'];
    
        $message= $data['message'];
    
        $ticket_list_table = $wpdb->prefix . "addin_ticket_list";
        $ticket_message_table = $wpdb->prefix . "addin_ticket_message";
        $ticket_images_table = $wpdb->prefix . "addin_ticket_images";
    
        $wpdb->insert($ticket_list_table, [
            'subject' => $subject,
            'category' => $categories,
            'order_id' => $order_number,
            'brand_id' => $brand_id,
            'customer_id' => $user,
            'product_name' => $product_list,
            'status' => 'open'
        ]);
    
        $id = $wpdb->get_var( 'SELECT id FROM ' . $wpdb->prefix . 'addin_ticket_list' . ' ORDER BY id DESC LIMIT 1');
        $wpdb->insert($ticket_message_table, [
            'ticket_id' => $id,
            'attchment_id' => $attachment_id,
            'ticket_message' => $message,
            'author_id' => $user
        ]);
    
        foreach($data_image['data_image'] as $value) {
            $wpdb->insert($ticket_images_table, [
                'id' => $value['id'],
                'name' => $value['name'],
                'type' => $value['type'],
                'path' => $value['path'],
            ]);
        }
        $output = [
            'data'=> $data,
            'data_image' =>  $data_image['data_image'],
            'success' => "Create New Ticket Success!"
            ];
    
            print wp_json_encode($output);
    } else {

        $output = [
            'error'=> $data_image['error'],
        ];
        print wp_json_encode($output);
    }
    die();
}

//  AJAX Render All Seller Brand
add_action( 'wp_ajax_get_all_seller_brand', 'ajax_get_all_seller_brand' );
add_action( 'wp_ajax_nopriv_get_all_seller_brand', 'ajax_get_all_seller_brand' );

function ajax_get_all_seller_brand() {

    $all_brands = addin_ticket_admin_get_all_seller_brand();
    $all_brands_data = json_decode(json_encode($all_brands), true);
    $data = "";
    $data .= '<option value="" selected >Select Brand</option>';
    foreach($all_brands_data as $brand) {
        $data .='<option value="'.$brand["user_id"].'">'.$brand["name"].'</option>';
    }

    print wp_json_encode($data);

    die();
}

// AJAX Submit Form To Create New Ticket
add_action( 'wp_ajax_submit_reply_message', 'addin_ticket_ajax_submit_reply_message' );
add_action( 'wp_ajax_nopriv_wp_ajax_submit_reply_message', 'addin_ticket_ajax_submit_reply_message' );

function addin_ticket_ajax_submit_reply_message(){
    global $wpdb;
    $data = [];
    parse_str($_POST['data'], $data);
   
  $user = get_current_user_id();
  $data_image = addin_ticket_save_image('customer_image');
    if(empty($data_image['error'])) {
        $id = [];
        foreach ($data_image['data_image'] as $value) {
            $id [] = $value['id'];
        }

        $attachment_id = implode(",",$id);
        $customer_mesage= $data['customer_mesage'];
        $ticket_id= $data['ticket_id'];
  
   
    $ticket_images_table = $wpdb->prefix . "addin_ticket_images";
    $ticket_message_table = $wpdb->prefix . "addin_ticket_message";
  
    $wpdb->insert($ticket_message_table, [
        'ticket_id' => $ticket_id,
        'attchment_id' => $attachment_id,
        'ticket_message' => $customer_mesage,
        'author_id' => $user
    ]);
  
    foreach ($data_image['data_image'] as $value) {
        $wpdb->insert($ticket_images_table, [
            'id' => $value['id'],
            'name' => $value['name'],
            'type' => $value['type'],
            'path' => $value['path'],
        ]);
    }
        $output = [
            'data'=> $data,
            'data_image' =>  $data_image['data_image'],
            'success' => "Create Reply Message Success!"
            ];
    
            print wp_json_encode($output);
    } else {

        $output = [
            'error'=> $data_image['error'],
        ];
        print wp_json_encode($output);
    }
    die();
}



//  AJAX Render Products By Brand
// add_action( 'wp_ajax_get_product_by_brand', 'ajax_get_product_by_brand' );
// add_action( 'wp_ajax_nopriv_get_product_by_brand', 'ajax_get_product_by_brand' );

// function ajax_get_product_by_brand() {
    
//     $brand_id = $_POST['brand_id'];

//     $product_array = addin_ticket_admin_get_product_name_by_seller_brand($brand_id);
  
//     $data = '';
   
//         foreach($product_array as $product)
//         {
//             $data .= '<option value="'.$product->post_id .'">'.$product->post_title.'</option>';
//         }
   
//     $output = [
//         'data' => $data,
//         'brand_id'=>$brand_id
//       ];

//       print wp_json_encode($output);
//       die();
// }


// AJAX Pagination Ticket List
add_action( 'wp_ajax_pagination-load-ticket-list', 'ajax_pagination_load_ticket_list' );

add_action( 'wp_ajax_nopriv_pagination-load-ticket-list', 'ajax_pagination_load_ticket_list' ); 

function ajax_pagination_load_ticket_list() {

    global $wpdb;
   
    $container = '';
    $link = $_POST['order_id'];
    $array = explode("/",$link);
    $last_item_index = count($array) - 2;
    $order_id = $array[$last_item_index];

    if(isset($_POST['page'])){
        // Sanitize the received page   
        $page = sanitize_text_field($_POST['page']);
        $type_categorie = sanitize_text_field($_POST['type']);
       
        $cur_page = $page;
        $page -= 1;
        // Set the number of results to display
        $per_page = 3;
        $previous_btn = true;
        $next_btn = true;
        $first_btn = true;
        $last_btn = true;
        $start = $page * $per_page;

        // Set the table where we will be querying data
        $ticket_list_table = $wpdb->prefix . "addin_ticket_list";
        $ticket_message_table = $wpdb->prefix . "addin_ticket_message";
        $ticket_images_table = $wpdb->prefix . "addin_ticket_images";

        $customer = wp_get_current_user();
        $customer_id = $customer->ID;


    if($order_id =="support-ticket-general"){

        $sql = "SELECT * FROM  $ticket_list_table as u 
        WHERE (u.order_id IS NULL OR u.order_id = 0) 
        and u.customer_id = %d 
        ORDER BY u.created 
        DESC LIMIT %d, %d ";

        $sql2 = $wpdb->prepare("SELECT Count(u.id) as total 
        FROM  $ticket_list_table as u 
        WHERE (u.order_id IS NULL OR u.order_id = 0) 
        and u.customer_id = %d ", $customer_id);

     } else {
        $sql = "SELECT * FROM  $ticket_list_table as u 
        WHERE u.order_id = $order_id 
        and u.customer_id = %d  
        ORDER BY u.created 
        DESC LIMIT %d, %d";

        $sql2 = $wpdb->prepare("SELECT Count(u.id) as total 
        FROM  $ticket_list_table as u 
        WHERE u.order_id = $order_id 
        and u.customer_id = %d ", $customer_id);
        
     }

    $total_ticket = $wpdb->get_var($sql2);
    $list_ticket_limit = $wpdb->prepare($sql,$customer_id, $start, $per_page);
    $data_list_limit = $wpdb->get_results( $list_ticket_limit);
        
    $data = '';
 
    foreach($data_list_limit as $ticket){
      $sql2 = "SELECT * FROM $ticket_message_table WHERE `ticket_id` = '$ticket->id' ";
  
      $ticket_messages = $wpdb->get_results($wpdb->prepare($sql2));
      $count_ticket_message = count($ticket_messages); 
      $subject = $ticket->subject;
      $ticket_id = $ticket->id;
      $ticket_status = $ticket->status;
      $brand_name = addin_ticket_admin_get_brand_name_by_user_id($ticket->brand_id);
      $ticket_priority = $ticket->priority;
      $product_name = addin_ticket_get_product_name_by_id($ticket->product_name);
  
      $ticket_test= ($ticket_status =="open" ? "ticket_status_open ": "ticket_status_closed ");
   
     $data.='<div class="single_ticket_container">
          <div class="ticket_subject">
              <div class="ticket_subject_text">'. $subject .'</div>
              <button class="collapse_button" data-ticket-id=" ' . $ticket_id . '">Expand</button>
          </div>
          <div class="ticket_status">
          <strong>Status: </strong> 
          <span class="'.$ticket_test.'" > '. $ticket_status .' </span>  
          <strong> ID: </strong>'. $ticket_id .', 
          <strong>Number of messages: </strong>'. $count_ticket_message .', 
          <strong>Created on: </strong> '. date("M-d-Y", strtotime($ticket->created)) .', 
          <strong>Brand: </strong> '. $brand_name .'.';
         
          if($product_name){
              $data.='<br><br><strong>Product: </strong> '. $product_name .'.';
          }
        $data.='</div>
        <div class="message_box">';
         
              foreach($ticket_messages as $mes) {
  
                  $message = $mes -> ticket_message;
                  $message_attchment_id = $mes -> attchment_id;
                  $author_id = $mes -> author_id;
                  $message_crated_on = date("M d, Y g:i a", strtotime($mes->ticket_created_on));
                  $role_author = get_user_meta($author_id,'wp_capabilities',true );
                  $role_author = $role_author['seller_portal'] ? 'admin_reply' : '';
                  $user_reply = $role_author['seller_portal'] ? (addin_ticket_get_customer($author_id)) : 'You';
                     $data.='<div class="customer_ticket_message_content">
                          <div class="customer_ticket_message_text '. $role_author .'">
                              <p>'.$message.'</p>';
                              
                       
                                      if (!empty($message_attchment_id)) {
                                          $count = 0;
                                      
                                          $sql_att = "SELECT * FROM $ticket_images_table  WHERE `id` IN ($message_attchment_id) ";
                                          $data_attchement = $wpdb->get_results($wpdb->prepare($sql_att));
  
                                          if(!empty($data_attchement)){
                                           
                                             $data.='<div class="attachments_container">
                                                  <div class="single_attachment" id="single_attachment_1">';
                                                      
                                            
                                                          foreach ($data_attchement as $value) {
                                                              $count += 1;
                                          
                                                                    
                                                                    $data.='<a href="'.$value->path.'" target="_blank" >
                                                                          <img class="attchement-images" src="'.$value->path.'">
                                                                      </a>';
                                                                                      
                                                                 
                                          
                                                          }
  
                                           $data.='
                                                  </div>
                                              </div>';
                                             
  
                                          }
  
                                      }
                                    
                          
                         $data.=' </div>
                          <div class="customer_ticket_message_detail "><strong>'. $user_reply .'  on</strong><br>'.$message_crated_on.'</span>
                      </div>
                          
                      </div>';
                  
                  
              }
       
        
          $data.='<div class="reply_message">
                  <button class="add_new_message_button">Add new message</button>
                      <form id="form-reply-message" class="form-reply-message" method="post" enctype="multipart/form-data"  >
                          <div class="ticket-order pt-4 pb-3 p-l-lg p-r-lg">
                              <div id="ticket_area" class="ticket_area">  
                                  <div class="tickets_container">
                                  
                                      <div class="new_ticket_box new_reply_message">        
                                          <div class="new_ticket_content">
                                              <label class="message_subject_label">New Message</label>
                                              <textarea name="customer_mesage" id="customer_message" class="new_ticket_message" placeholder="New message"></textarea>
                                              <label class="attachment_label">Attachments</label>
                                              <input class="files-data" type="file" id="customer_file" name="customer_image[]" multiple="multiple" >
                                              <div class="image-error"></div>
                                              <div class="add-ticket">
                                              <input type="hidden" name="ticket_id" value="'.$ticket->id .'">
                                           
                                              <input  name="reply_mesage" type="submit" class="button button-add-ticket" id="reply_mesage" value="Submit new message"/>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </form>
                  </div>
  
          
          </div>
  
      </div>';
   
  }
     

        // Optional, wrap the output into a container
        $container = "<div class='ticket-universal-content'>" . $data . "</div><br class = 'clear' />";

     
        $no_of_paginations = ceil($total_ticket / $per_page);

        if ($cur_page >= 7) {
            $start_loop = $cur_page - 3;
            if ($no_of_paginations > $cur_page + 3)
                $end_loop = $cur_page + 3;
            else if ($cur_page <= $no_of_paginations && $cur_page > $no_of_paginations - 6) {
                $start_loop = $no_of_paginations - 6;
                $end_loop = $no_of_paginations;
            } else {
                $end_loop = $no_of_paginations;
            }
        } else {
            $start_loop = 1;
            if ($no_of_paginations > 7)
                $end_loop = 7;            
            else
                $end_loop = $no_of_paginations;
        }

        // Pagination Buttons logic 
        $pag_container = "";
        $pag_container .= "
        <div class='ticket-universal-pagination'>
            <ul>";

        if ($first_btn && $cur_page > 1) {
            $pag_container .= "<li p='1' class='active'>First</li>";
        } else if ($first_btn) {
            $pag_container .= "<li p='1' class='inactive'>First</li>";
        }

        if ($previous_btn && $cur_page > 1) {
            $pre = $cur_page - 1;
            $pag_container .= "<li p='$pre' class='active previous-ticket'></li>";
        } else if ($previous_btn) {
            $pag_container .= "<li class='inactive previous-ticket'></li>";
        }
        for ($i = $start_loop; $i <= $end_loop; $i++) {

            if ($cur_page == $i)
                $pag_container .= "<li p='$i' class = 'selected' >{$i}</li>";
            else
                $pag_container .= "<li p='$i' class='active'>{$i}</li>";
        }

        if ($next_btn && $cur_page < $no_of_paginations) {
            $nex = $cur_page + 1;
            $pag_container .= "<li p='$nex' class='active next-ticket'></li>";
        } else if ($next_btn) {
            $pag_container .= "<li class='inactive next-ticket'></li>";
        }

        if ($last_btn && $cur_page < $no_of_paginations) {
            $pag_container .= "<li p='$no_of_paginations' class='active'>Last</li>";
        } else if ($last_btn) {
            $pag_container .= "<li p='$no_of_paginations' class='inactive'>Last</li>";
        }

        $pag_container = $pag_container . "
            </ul>
        </div>";

        // We echo the final output

        $list_ticket ='<div class = "ticket-pagination-content">' . $container . '</div>' . 
        '<div class = "ticket-pagination-nav">' . $pag_container . '</div>';

        $output = [
            'data' => $list_ticket,
            'type' => $type_categorie,
            'order_id' => $order_id,
            'null' => $data
          ];
    
          print wp_json_encode($output);
    
         
    }

    die();}