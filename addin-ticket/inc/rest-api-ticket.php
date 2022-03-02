<?php

/**
 * API Get products from Order
 */

function  addin_ticket_get_products_from_order($request)
{
  $order_id = $request->get_param("order_id");
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

    $product_seller = addin_ticket_get_brand_by_product_in_order();
    $name_product = [];

    foreach($product_array as $product)
    {
    
       $key =  array_search($product["id"], array_column($product_seller, 'post_id'));
       if(isset($key)){
          $name_product []= [
              'name' => $product_seller [$key]->name,
              'user_id' => $product_seller [$key]->user_id
              ];
       }
       $name_product = array_map("unserialize", array_unique(array_map("serialize", $name_product)));

    }

  $output = [
    'list_products'=>$product_array,
    'list_brands' =>$name_product
  ];

    return addin_ticket_message_status(200, null,  $output);
  
  } else {
    return addin_ticket_message_status(404, esc_html__('Invalid order, please check it!', 'addin.sg'), null);
  }
 
}

/**
 * API create ticket
 */
function addin_ticket_create_ticket_api($request)
{
  
  global $wpdb;
  $subject = $request->get_param("subject");
  $categories = $request->get_param("categories");
  $product_id = $request->get_param("product_id");
  $order_id = $request->get_param("order_id");
  $status = $request->get_param("status");
  $message = $request->get_param("message");
  $author_id = $request->get_param("author_id");
  $brand_id = $request->get_param("brand_id");
  $attachment_image = $request->get_param("attachment_image");
  
  $ticket_list_table = $wpdb->prefix . "addin_ticket_list";
  $ticket_message_table = $wpdb->prefix . "addin_ticket_message";
  $ticket_images_table = $wpdb->prefix . "addin_ticket_images";

  // Insert data to table "addin_ticket_list"
  $result_check = $wpdb->insert($ticket_list_table, [
    'subject' => $subject,
    'category' => $categories,
    'order_id' => $order_id,
    'customer_id' => $author_id,
    'product_name' => $product_id,
    'brand_id' => $brand_id,
    'status' => $status
  ]);

  if($result_check) {
    $data_image = addin_ticket_update_attachment_image($attachment_image);
  
    $id = [];
  
    foreach ($data_image as $value) {
      $id[] = $value['id'];
    }
  
    $attachment_id = implode(",", $id);

  // Insert data to table "addin_ticket_message"
  $ticket_id = $wpdb->get_var('SELECT id FROM ' . $wpdb->prefix . 'addin_ticket_list' . ' ORDER BY id DESC LIMIT 1');
  $wpdb->insert($ticket_message_table, [
    'ticket_id' => $ticket_id,
    'attchment_id' => $attachment_id,
    'ticket_message' => $message,
    'author_id' => $author_id
  ]);

  // Insert data to table "addin_ticket_images"
  foreach ($data_image as $value) {
    $wpdb->insert($ticket_images_table, [
      'id' => $value['id'],
      'name' => $value['name'],
      'type' => $value['type'],
      'path' => $value['path'],
    ]);
  }

    return addin_ticket_message_status(200, "DONE",  null);
  } else {
    return addin_ticket_message_status(404, esc_html__('ticket is not creted, please check form', 'addin.sg'), null);
  }
  
}
  
// Save image base 64 to media
function addin_ticket_save_image_base64($base64_img, $title = null, $is_post = false)
{

  require_once(ABSPATH . 'wp-admin/includes/file.php');
  require_once(ABSPATH . 'wp-admin/includes/image.php');
  require_once(ABSPATH . 'wp-admin/includes/media.php');

  // Upload dir.
  $upload_dir  = wp_upload_dir();
  $upload_path = str_replace('/', DIRECTORY_SEPARATOR, $upload_dir['path']) . DIRECTORY_SEPARATOR;

  $image_parts = explode(";base64,", $base64_img);
  $imgExt = str_replace('data:image/', '', $image_parts[0]);
  $image = str_replace(' ', '+', $image_parts[1]);
  $file_name = $title ? strtolower(str_replace(' ', '_', $title)) : time();
  $imageName =  wp_trim_words($file_name, 5) . "." . $imgExt;
  $decoded = base64_decode($image_parts[1]);
  $file_type = 'image/jpeg';
  // Save the image in the uploads directory.
  $image_upload = file_put_contents($upload_path . $imageName, $decoded);
  $data_image = [];
  $file_array = array(
    'name' => $imageName,
    'tmp_name' => $upload_path . $imageName,
    'type' => str_replace('jpeg', 'jpg', $imgExt)
  );

  $file_return = wp_handle_sideload($file_array, array('test_form' => false));
  $filename = $file_return['file'];

  if ($is_post) return $file_return;

  // generate_attachment image
  $attachment = array(
    'post_mime_type' => $file_return['type'],
    'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
    'post_content' => '',
    'post_status' => 'inherit',
    'guid' => $file_return['url']
  );

  $attach_id = wp_insert_attachment($attachment, $filename);
  $attachment_meta = wp_generate_attachment_metadata($attach_id, $filename, 0);
  wp_update_attachment_metadata($attach_id, $attachment_meta);

  $data = array(
    'id' => $attach_id,
    'name' => basename($file_return['file']),
    'type' => $file_return['type'],
    'path' => $file_return['url']
  );

  $data_image = $data;
  return $data_image;
}

//  Save multi attchment image to media
function addin_ticket_update_attachment_image($data, $title = null)
{
  $data_image = [];
  if (is_array($data)) {
    foreach ($data as $value) {
      $data_image[] = addin_ticket_save_image_base64($value, $title);
    }
    return $data_image;
  } else {
    $data_image[] = addin_ticket_save_image_base64($data, $title);
    return $data_image;
  }
}

/***
* API Change status ticket
*/
function  addin_ticket_change_status_ticket($request) {

  global $wpdb;
  $ticket_id = $request->get_param("ticket_id");
  $status = $request->get_param("status");
  $ticket_list_table = $wpdb->prefix . "addin_ticket_list";

  $result_check = $wpdb->query($wpdb->prepare("UPDATE $ticket_list_table SET `status`= %s WHERE `id`= %d ",[$status, $ticket_id]));

  if($result_check) {
    return addin_ticket_message_status(200, null,  $result_check);
  } else {
    return addin_ticket_message_status(404, esc_html__('Update status failed', 'addin.sg'), null);
  }
                                          
} 

// Api Create message for ticket

function addin_ticket_create_message_for_ticket($request) {
  global $wpdb;
 
  $message = $request->get_param("message");
  $author_id = $request->get_param("author_id");
  $ticket_id = $request->get_param("ticket_id");
  $status = $request->get_param("closed");
  $attachment_image = $request->get_param("attachment_image");

  $ticket_message_table = $wpdb->prefix . "addin_ticket_message";
  $ticket_images_table = $wpdb->prefix . "addin_ticket_images";
  $ticket_list_table = $wpdb->prefix . "addin_ticket_list";

  // Insert ticket message in ticket_message_table
  $result_check = $wpdb->insert($ticket_message_table, [
    'ticket_id' => $ticket_id,
    'ticket_message' => $message,
    'author_id' => $author_id
  ]);

  // Update Status
  if($status === true){
    $wpdb->query($wpdb->prepare("UPDATE $ticket_list_table t SET t.status = 'closed' WHERE t.id = $ticket_id"));
  }

  if($result_check ) {

    $data_image = addin_ticket_update_attachment_image($attachment_image);
    $id = [];
  
    foreach ($data_image as $value) {
      $id[] = $value['id'];
    }
  
    $attachment_id = implode(",", $id);

    $message_id = $wpdb->get_var('SELECT id FROM ' . $wpdb->prefix . 'addin_ticket_message' . ' ORDER BY id DESC LIMIT 1');
    $wpdb->query($wpdb->prepare("UPDATE $ticket_message_table SET `attchment_id`= %s WHERE `id`= %d", [$attachment_id,$message_id]));
    
    // Insert data to table "addin_ticket_images"
    foreach ($data_image as $value) {

      $result_check_image = $wpdb->insert($ticket_images_table, [
        'id' => $value['id'],
        'name' => $value['name'],
        'type' => $value['type'],
        'path' => $value['path'],
      ]);
    
    }

      return addin_ticket_message_status(200, "DONE",  null);
    
    // if($result_check_image) {
    //   return addin_ticket_message_status(200, "DONE",  null);
    // } else {
    //   return addin_ticket_message_status(404, esc_html__('Insert data image attchement not success, please check it!', 'addin.sg'), null);
    // }
    
  } else {
    return addin_ticket_message_status(404, esc_html__('Create message not success, please check it!', 'addin.sg'), null);
  }
}

/**
 * API ticket detail
 */

function addin_ticket_detail($request) {

  global $wpdb;
  $ticket_id = $request->get_param("ticket_id");
 

  $sql = $wpdb->prepare("SELECT * FROM  `wp_addin_ticket_list` as l WHERE l.id = %d ",$ticket_id);
  $data_ticket_list = $wpdb->get_results( $sql);

  $sql2 = $wpdb->prepare("SELECT m.id,m.ticket_message, m.attchment_id,m.author_id, m.ticket_created_on, l.order_id, l.customer_id ,l.brand_id,l.product_name
  FROM `wp_addin_ticket_message` as m 
  INNER JOIN `wp_addin_ticket_list` as l 
  ON m.ticket_id = l.id 
  WHERE l.id = %d ",$ticket_id);
  $data_ticket_message = $wpdb->get_results( $sql2);
  // print_r($data_ticket_message);
  $data3 = [];
  foreach($data_ticket_list as $value){
    $data3 = [
      'ticket_id' => $value->id,
      'customer_name' => addin_ticket_get_customer($value ->customer_id),
      'order_id' => $value->order_id,
      'product_name' => addin_ticket_get_product_name_by_id($value->product_name),
      'subject' => $value->subject,
      'created' => $value->created,  
      'email' => addin_ticket_get_customer_email($value ->customer_id),
      'assigned'=>addin_ticket_get_customer($value ->brand_id)
    ];
  }
  foreach($data_ticket_message as $value){
   $value -> author_name = addin_ticket_get_customer($value->author_id);
   $value -> attchment_image = addin_ticket_get_url_attchement($value->attchment_id);
   $data3['ticket_message'] [] = $value;
 } 

  return ($data3);
  
}

function addin_ticket_get_customer_name($customer_id){
 $all_meta_for_user = get_user_meta( $customer_id);
 return ( $all_meta_for_user['nickname'][0] );
}

function addin_ticket_get_customer_email ($customer_id) {

  $user_info = get_userdata($customer_id);
  return $email = $user_info->user_email;

}


  /***
  * API Get all brand
  */
function addin_ticket_get_all_seller_brand($request) {

  global $wpdb; 

  $user_meta_table = $wpdb->prefix . "usermeta";
  $terms_table = $wpdb->prefix . "terms";

  $sql = $wpdb->prepare("SELECT u.user_id, t.name FROM $user_meta_table  u 
                      INNER JOIN $terms_table t on t.term_id = u.meta_value
                      WHERE (u.meta_value is not null and u.meta_value <> 0 ) and  u.meta_key = 'seller_brand'");
  $all_seller_brand = $wpdb->get_results( $sql);

  if($all_seller_brand){
    return addin_ticket_message_status(200, "DONE",  $all_seller_brand);
  }else {
    return addin_ticket_message_status(404, esc_html__('No brand', 'addin.sg'), null);
  }

}


