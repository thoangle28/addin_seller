<?php

 
// Add form subimt ticket on order customer
// add_action( 'woocommerce_view_order', 'ticket_order', 30 );
/*
function ticket_order( $order_id ){ 
 
if(!empty($_POST['create_ticket'])){   
  addin_ticket_create_ticket();  
}

  ?>
  <form method="post" enctype="multipart/form-data">
  <div class="ticket-order pt-4 pb-3 p-l-lg p-r-lg">
          <div id="ticket_area" class="ticket_area">
              <h2>Ticket</h2>
           
              <div class="tickets_container">
                  <div class="new_ticket_box">
                      <h4 class="new_ticket_box_title">Submit a new ticket</h4>
                      <div class="new_ticket_content">
                          <div class="categories">
                              <label>Category</label>
                              <select name="categories" class="category" style="display: block; width: 100%;" >
                                  <option value="none" selected disabled hidden>Select Categories</option>
                                  <option id="general-enquiry" value="general-enquiry">General Enquiry</option>
                                  <option value="order-enquiry" id="order-enquiry">Order Enquiry</option>
                              </select>
                          </div>
                          <div class="product-list">
                              <label>Products</label>
                              <select name="product-list" class="product-list-order" style="display: block; width: 100%;">
                              <option value="none" selected disabled hidden>Select Product</option>
                                  <option value="furniture">TV Samsung</option>
                                  <option value="decoration">TV LG</option>
                                  <option value="smarthome">TV Sony</option>
                              </select>
                          </div>
                          <div class="order-number">
                              <label>Order Number</label>
                              <select name="order-number" class="order-number" style="display: block; width: 100%;">
                              <option value="none" selected disabled hidden>Select Order</option>
                                  <option value="111111">111111</option>
                                  <option value="222222">222222</option>
                                  <option value="333333">333333</option>
                              </select>
                          </div>
                          <label class="new_ticket_label">Subject</label>
                          <input type="text" name="subject" id="new_ticket_subject" maxlength="1000" style="display: block; width: 100%;">
                          <label class="new_ticket_label">Message</label>
                          <textarea name="message" id="new_ticket_message" class="new_ticket_message" style="display: block; width: 100%;" placeholder="new message"></textarea>
                          <label class="new_ticket_label">Attachment</label>
                          <input type="file" id="myfile" name="image[]" multiple="multiple" style="display: block;">
                          <div class="add-ticket" style="margin-top: 20px;">
                          <input name="create_ticket" type="submit" class="button button-add-ticket" id="open_new_ticket" value="Create new ticket"/>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </form>
  
  <?php

}
*/

// Create ticket
// function addin_ticket_create_ticket(){

// global $wpdb;
//   $user = get_current_user_id();
//   $data_image = addin_ticket_save_image('image');

//   $id = [];
//   foreach ($data_image as $value) {
//       $id [] = $value['id'];
//   }
//   $attachment_id = implode(",",$id);

//   $subject= $_POST['subject'];
//   $categories= $_POST['categories'];
//   $product_list= $_POST['product-list'];
//   $order_number= $_POST['order-number'];
//   $brand_id= $_POST['brand-name'];
//   $image= addin_ticket_convert_image_upload_to_base64();
//   $message= $_POST['message'];

// $ticket_list_table = $wpdb->prefix . "addin_ticket_list";
// $ticket_message_table = $wpdb->prefix . "addin_ticket_message";
//   $ticket_images_table = $wpdb->prefix . "addin_ticket_images";

// $wpdb->insert($ticket_list_table, [
//       'subject' => $subject,
//       'category' => $categories,
//       'order_id' => $order_number,
//       'brand_id' => $brand_id,
//       'customer_id' => $user,
//       'product_name' => $product_list,
//       'status' => 'open'
//   ]);

//   $id = $wpdb->get_var( 'SELECT id FROM ' . $wpdb->prefix . 'addin_ticket_list' . ' ORDER BY id DESC LIMIT 1');
//   $wpdb->insert($ticket_message_table, [
//       'ticket_id' => $id,
//       'attchment_id' => $attachment_id,
//       'ticket_message' => $message,
//       'author_id' => $user
//   ]);

//   foreach($data_image as $value) {
//       $wpdb->insert($ticket_images_table, [
//           'id' => $value['id'],
//           'name' => $value['name'],
//           'type' => $value['type'],
//           'path' => $value['path'],
//       ]);
//   }


// }

// Save attchement image when create ticket
function addin_ticket_save_image($name, $is_post = false ) {

    require_once( ABSPATH . 'wp-admin/includes/file.php' );
    require_once( ABSPATH . 'wp-admin/includes/image.php' );
    require_once( ABSPATH . 'wp-admin/includes/media.php' );
    
    // Upload dir.
    $upload_dir  = wp_upload_dir();
    $upload_path = str_replace( '/', DIRECTORY_SEPARATOR, $upload_dir['path']) . DIRECTORY_SEPARATOR;
    
      $max_image_upload = 5;
      $max_file_size = 1500000;
      $valid_formats = array("jpg", "png" , "gif", "bmp", "jpeg");
      $count = 0;
      $res = [];
      $total = count($_FILES[$name]['name']);
    
      $data_image = [];
    
      if($total > $max_image_upload ){
        $res['error'][]= "Sorry you can only upload " . $max_image_upload . " images for ticket";
      }else {
        for($i=0 ; $i < $total ; $i++) {
            $extension = pathinfo( $_FILES[$name]['name'][$i], PATHINFO_EXTENSION );
          
            if(! in_array( strtolower( $extension ), $valid_formats ) ) {
                $res['error'][] = $_FILES[$name]['name'][$i] ." is not valid format. Photo only allows file types of GIF, PNG, JPG, JPEG and BMP";
            } else if($_FILES[$name]['size'][$i] > $max_file_size) {
                $res['error'][] = $_FILES[$name]['name'][$i] ." is too large!";
            }   
        }
        if(empty($res['error'])) {
            
            for($i=0 ; $i < $total ; $i++) {
             $path_image = $upload_path.basename($_FILES[$name]['name'][$i]);
             if(move_uploaded_file($_FILES[$name]['tmp_name'][$i],$path_image)){
                 $count++;
                 $file_array = array(
                     'name' => $_FILES[$name]['name'][$i],
                     'tmp_name' => $path_image,
                     'type'=> str_replace('image/', '', $_FILES[$name]['type'][$i])
                 );
                
                 $file_return = wp_handle_sideload( $file_array, array( 'test_form' => false ) );
                 $filename = $file_return['file'];
             
                 if( $is_post ) return $file_return;
             
                 // generate_attachment image
                 $attachment = array(
                     'post_mime_type' => $file_return['type'],
                     'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
                     'post_content' => '',
                     'post_status' => 'inherit',
                     'guid' => $file_return['url']
                     );
             
                 $attach_id = wp_insert_attachment( $attachment, $filename);
                 $attachment_meta = wp_generate_attachment_metadata($attach_id, $filename ,0);
                 wp_update_attachment_metadata($attach_id, $attachment_meta);
             
                 $data = array(
                     'id' => $attach_id,
                     'name' => basename($file_return['file']),
                     'type' => $file_return['type'],
                     'path' => $file_return['url']
                     );
                 
                 $data_image[] = $data;
                    $res=[
                     'data_image' => $data_image,
                     'error' => ""
                ];
             } else {
                 $res=[
                     'data_image' =>"",
                     'error' => "Upload Failed"
                ];
             };
            }
     
         }    
      }
      return ($res);
}

function addin_ticket_convert_image_upload_to_base64() {

  $file_name =$_FILES['image']['name'];
  $file_ext = strtolower( end(explode('.',$file_name)));
  $file_tmp= $_FILES['image']['tmp_name'];
  $type = pathinfo($file_name, PATHINFO_EXTENSION);
  $data = file_get_contents( $file_tmp );
  
  return $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
 
}


if ( ! class_exists( 'WP_List_Table' ) ) {
  require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

// Add box reply ticket for customer on order
add_action( 'woocommerce_view_order', 'addin_ticket_get_list_ticket_by_order', 20);

// Create box reply ticket
function addin_ticket_get_list_ticket_by_order() {

    // addin_ticket_admin_render_list_ticket('order');
    $data ='';
    $data.='<div class = "ticket_list_pag_loading">
            <div class = "ticket_list_pag_container">
                <div class="ticket-universal-content"></div>
            </div>
        </div>';
    print $data;
}

//  Save reply message in database
function addin_ticket_reply_message(){
  global $wpdb;
  $user = get_current_user_id();
  $data_image = addin_ticket_save_image('customer_image');
 if(empty($data_image['error'])) {
    $id = [];
    foreach ($data_image['data_image'] as $value) {
        $id [] = $value['id'];
    }
    $attachment_id = implode(",",$id);

    $customer_mesage= $_POST['customer_mesage'];
    $ticket_id= $_POST['ticket_id'];
  
   
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
    return $output = ['success' => "Create New Ticket Success!"];
 } else {
   return $output = ['error'=> $data_image['error'],];
 }
  
 
}

// Get all order for customer (frontend-addin.sg)

function addin_ticket_admin_get_all_order_customer (){
    $customer = wp_get_current_user();
// Get all customer orders
    $customer_orders = get_posts(array(
        'numberposts' => -1,
        'meta_key' => '_customer_user',
        'orderby' => 'date',
        'order' => 'DESC',
        'meta_value' => get_current_user_id(),
        'post_type' => wc_get_order_types(),
        'post_status' => array_keys(wc_get_order_statuses()), 'post_status' => array('wc-processing'),
    ));

    $Order_Array = []; //
    foreach ($customer_orders as $customer_order) {
        $orderq = wc_get_order($customer_order);
        $Order_Array[] = [
            "ID" => $orderq->get_id(),
            "Value" => $orderq->get_total(),
            "Date" => $orderq->get_date_created()->date_i18n('Y-m-d'),
        ];

    }
    return  $Order_Array;
   
}


//  Get all product from order id (frontend-addin.sg)
function  addin_ticket_admin_get_products_from_order($order_id)
{

  $product_array = [];

  $order = wc_get_order($order_id);

  if(!empty($order)) {
    $items = $order->get_items();
  
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
    return $product_array;
  } 
 
}

// Get all user_id is seller_brand (frontend-addin.sg)
function addin_ticket_admin_get_all_seller_brand (){

    global $wpdb; 
    $user_meta_table = $wpdb->prefix . "usermeta";
    $terms_table = $wpdb->prefix . "terms";

    $sql = $wpdb->prepare("SELECT u.user_id, t.name FROM $user_meta_table  u 
                        INNER JOIN $terms_table t on t.term_id = u.meta_value
                        WHERE (u.meta_value is not null and u.meta_value <> 0 ) and  u.meta_key = 'seller_brand'");
    $all_seller_brand = $wpdb->get_results( $sql);

    return $all_seller_brand;
    
}

// get product by user_id is seller_brand (frontend-addin.sg)

function addin_ticket_admin_get_product_name_by_seller_brand ($id) {

    global $wpdb; 
    $user_meta_table = $wpdb->prefix . "usermeta";
    $post_meta_table = $wpdb->prefix . "postmeta";
    $post_table = $wpdb->prefix . "posts";
    $terms_table = $wpdb->prefix . "terms";
    $sql = $wpdb->prepare("	SELECT u.user_id, t.name, pm.post_id,p.post_title FROM $user_meta_table u
    INNER JOIN $terms_table t on t.term_id = u.meta_value
    INNER JOIN $post_meta_table pm on t.term_id = pm.meta_value
    INNER JOIN $post_table p on pm.post_id = p.ID
    WHERE (u.meta_value is not null and u.meta_value <> 0 ) AND  u.meta_key = 'seller_brand' AND pm.meta_key = 'product_brand'
    HAVING u.user_id = $id ");

    $product = $wpdb->get_results( $sql);

    return $product;
}

// Get Brand name by user id
function addin_ticket_admin_get_brand_name_by_user_id($id){
    global $wpdb; 
    $user_meta_table = $wpdb->prefix . "usermeta";
    $terms_table = $wpdb->prefix . "terms";
    $sql = $wpdb->prepare("	SELECT u.user_id, t.name FROM $user_meta_table u
    INNER JOIN $terms_table t on t.term_id = u.meta_value
    WHERE (u.meta_value is not null and u.meta_value <> 0 ) AND  u.meta_key = 'seller_brand'
    HAVING u.user_id = $id ");

    $data = $wpdb->get_results( $sql);

    return $data[0]->name;
}

function addin_ticket_admin_render_list_ticket($type){

  global $wpdb;
  $ticket_list_table = $wpdb->prefix . "addin_ticket_list";
  $ticket_message_table = $wpdb->prefix . "addin_ticket_message";
  $ticket_images_table = $wpdb->prefix . "addin_ticket_images";
  $customer = wp_get_current_user();
  $customer_id = $customer->ID;

 if($type =="general"){
    $sql = $wpdb->prepare("SELECT * FROM  $ticket_list_table as u WHERE (u.order_id IS NULL OR u.order_id = 0) and u.customer_id = %d ", $customer_id);
 } else if ($type =="order") {

    // Get order_id from url
    $link = $_SERVER["REQUEST_URI"];
    $array = explode("/",$link);
    $last_item_index = count($array) - 2;
    $order_id = $array[$last_item_index];
    
    $sql = $wpdb->prepare("SELECT * FROM  $ticket_list_table as u WHERE u.order_id = %d and u.customer_id = %d ",[$order_id,$customer_id] );
 }

  $data_ticket_list = $wpdb->get_results($sql);



//   if(!empty($_POST['reply_mesage'])){
//      $output = addin_ticket_reply_message();
//   }

  foreach($data_ticket_list as $ticket){
    $sql2 = "SELECT * FROM $ticket_message_table WHERE `ticket_id` = '$ticket->id' ";

    $ticket_messages = $wpdb->get_results($wpdb->prepare($sql2));
    $count_ticket_message = count($ticket_messages); 
    $subject = $ticket->subject;
    $ticket_id = $ticket->id;
    $ticket_status = $ticket->status;
    $brand_name = addin_ticket_admin_get_brand_name_by_user_id($ticket->brand_id);
    $ticket_priority = $ticket->priority;

    ?>
    <div class="single_ticket_container">
        <div class="ticket_subject">
            <div class="ticket_subject_text"><?php print $subject; ?></div>
            <button class="collapse_button" data-ticket-id="<?php print $ticket_id; ?>">Expand</button>
        </div>
        <div class="ticket_status">
        <strong>Status:</strong> 
        <span class="<?php $ticket_status =="open" ? print("ticket_status_open "): print("ticket_status_closed ")?>" ><?php print $ticket_status; ?></span> , 
        <strong>ID:</strong> <?php print $ticket_id; ?>, 
        <strong>Number of messages:</strong> <?php print $count_ticket_message ?>, 
        <strong>Created on:</strong> <?php print date("M-d-Y", strtotime($ticket->created)); ?>, 
        <strong>Brand: </strong> <?php print $brand_name ?>
        <!-- <strong>Priority: <?php print $ticket_priority; ?></strong> N/A	 -->
        </div>
    <div class="message_box">
        <?php
            foreach($ticket_messages as $mes) {

                $message = $mes -> ticket_message;
                $message_attchment_id = $mes -> attchment_id;
                $author_id = $mes -> author_id;
                $message_crated_on = date("M d, Y g:i a", strtotime($mes->ticket_created_on));
                $role_author = get_user_meta($author_id,'wp_capabilities',true );
            
                ?>
                    <div class="customer_ticket_message_content">
                        <div class="customer_ticket_message_text <?php (($role_author['seller_portal'])) ? print('admin_reply') : '';?>">
                            <p><?php print $message?></p>
                            
                            <?php
                                    if (!empty($message_attchment_id)) {
                                        $count = 0;
                                    
                                        $sql_att = "SELECT * FROM $ticket_images_table  WHERE `id` IN ($message_attchment_id) ";
                                        $data_attchement = $wpdb->get_results($wpdb->prepare($sql_att));

                                        if(!empty($data_attchement)){
                                            ?>
                                            <div class="attachments_container">
                                                <div class="single_attachment" id="single_attachment_1">
                                                    
                                            <?php
                                                        foreach ($data_attchement as $value) {
                                                            $count += 1;
                                        
                                                                ?>   
                                                                    <a href="<?php print $value->path ?>" target="_blank" >
                                                                        <img class="attchement-images" src="<?php print $value->path ?>">
                                                                    </a>
                                                                                    
                                                                <?php
                                        
                                                        }

                                            ?>
                                                </div>
                                            </div>
                                            <?php

                                        }

                                    }
                                    ?>
                        
                        </div>
                        <div class="customer_ticket_message_detail ">
                                <strong> <?php (($role_author['seller_portal'])) ? print(addin_ticket_get_customer($author_id)) : print('You'); ?> on</strong><br>
                                <?php print $message_crated_on; ?></span>
                        </div>
                        
                    </div>
                <?php
                
            }
     
        ?>
        <div class="reply_message">
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
                                            <input type="hidden" name="ticket_id" value="<?php print $ticket->id; ?>">
                                         
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

    </div>

    <?php
}
?>

<?php

}

// get brands by user_id is seller_brand (frontend-addin.sg)
function addin_ticket_get_brand_by_product_in_order(){

    global $wpdb;
    $user_meta_table = $wpdb->prefix . "usermeta";
    $terms_table = $wpdb->prefix . "terms";
    $post_meta_table = $wpdb->prefix . "postmeta";
    $posts_table = $wpdb->prefix . "posts";

    $sql = $wpdb->prepare("SELECT u.user_id, t.term_id,t.name, pm.post_id,p.post_title FROM $user_meta_table u
    INNER JOIN $terms_table t on t.term_id = u.meta_value
    INNER JOIN $post_meta_table pm on t.term_id = pm.meta_value
    INNER JOIN $posts_table p on pm.post_id = p.ID
    WHERE (u.meta_value is not null and u.meta_value <> 0 ) AND  u.meta_key = 'seller_brand' AND pm.meta_key = 'product_brand'");
    
    $reslut = $wpdb->get_results( $sql);
    // $product_seller = json_decode(json_encode($reslut), true);
    return $reslut;
}

function addin_ticket_get_product_name_by_id($id){
    $product = wc_get_product($id);
    if($product) {
        return $product->get_title();
    }
    
}