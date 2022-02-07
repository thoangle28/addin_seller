<?php

/**
 * API get all attribute 
 */
function addin_seller_get_attribute_product($is_child = true ) {
  $attribute_taxonomies = wc_get_attribute_taxonomies();
  $taxonomy_terms = array();

  foreach ($attribute_taxonomies as $attribute) {
    $taxonomy = wc_attribute_taxonomy_name($attribute->attribute_name);
    $parent = [
      'id' => intval($attribute->attribute_id),
      'label' => $attribute->attribute_label,
      'value' => $taxonomy,
      'name' => $taxonomy
    ];

    $child = get_terms(
      array(
        'taxonomy' => $taxonomy,
        'orderby' => 'name',
        'hide_empty' => false
      )
    );

    if( $child && $is_child) {
      foreach( $child as $id => $term) {
        $t = [];
        $t['id'] = intval($term->term_id);
        $t['label'] = $term->name;
        $t['value'] = $term->slug;
        $t['attr'] = $taxonomy;
        $parent['options'][] = $t;
      }
    }
    
    $taxonomy_terms[] = $parent;
  }
  
  if ( $taxonomy_terms ) {
    return addin_seller_message_status( 200, null, $taxonomy_terms);
  } else {
    return addin_seller_message_status( 404, esc_html__('Attribute Product is not found!', 'addin.sg'), null);
  }
}

function addin_seller_get_parents_attribute_product() {
  return addin_seller_get_attribute_product( false );
}

/**
 * API get attribute by parent id
 */
function addin_seller_get_attribute_parent(WP_REST_Request $request) {
  
  $params = $request->get_params();
  
  $terms = get_terms(
    array('taxonomy' => $params['name'], 
    'hide_empty' => false
  ));
  $attr = [];
  $attributes = [];
  foreach ($terms as $term) {
    $attr["id"] = $term->term_id;
    $attr["label"] = $term->name;
    $attr["value"] = $term->slug;
    $attr["attr"] = $params['name'];
    array_push($attributes,$attr);
  }
  if ( $terms ) {
    return addin_seller_message_status( 200, null, $attributes);
  } else {
    return addin_seller_message_status( 404, esc_html__('Attribute is not found!', 'addin.sg'), null);
  }
}

/**
 * API get all shipping classes
 */
function addin_seller_get_shipping( $request) {
  $shipping = get_terms( 
    array('taxonomy' => 'product_shipping_class',
    'hide_empty' => false 
  ));
  $array = [];
  $newArr = [];

  foreach($shipping as $val){
    $array['term_id'] = $val->term_id;
    $array['name'] = $val->name;
    $array['slug'] = $val->slug;
    $array['parent'] = $val->parent;
    array_push($newArr,$array);
  }

  if ( $newArr ) {
    return addin_seller_message_status( 200, null, $newArr);
  } else {
    return addin_seller_message_status( 404, esc_html__('Shipping classes is not found!', 'addin.sg'), null);
  }
}

/**
 * API get product by id, sku, price... of user
 */
function addin_seller_get_all_products_by_user($request) {
  $page_size = $request->get_param("page_size");
  $page_size = ($page_size > -2) ? $page_size : 10;

  $current_page = $request->get_param("current_page");
  $current_page = $current_page > 0 ? $current_page : 1;

  $user_id = $request->get_param("user_id");

  if( $user_id <= 0) {
    return addin_seller_message_status( 400, 'Not Authorize', null );
  }

  $args = array(
    'limit'  => -1,
    'status' => ['draft', 'publish', 'pending'],
    'author' =>  $user_id,
    'posts_per_page' => $page_size,
    'order' => 'desc',
    'orderby' => 'date',
    'page' => $current_page,
    'paginate' => false
  );
  
  //get total page
  $args['paginate'] = true;
  $paginate = wc_get_products($args);
  
  //get list
  $args['paginate'] = false;
  $products_list = wc_get_products($args);

  $products = [];
  if ($products_list) {

    foreach($products_list as $key => $value){      
      $product = [];
      $price_for_display = floatval($value->regular_price);
      $price_sale_display = floatval($value->sale_price);
      if($value->is_type( 'variable' )) {
        $price_for_display = $value->get_variation_regular_price('min', true);
        $price_sale_display = $value->get_variation_sale_price('min', true); // Min sale price for display
        //$price_for_display = $price_sale_display ? $price_sale_display : $price_for_display;
      }

      $product['product_id'] = $value->id;
      $product['sku'] = $value->sku;
      $product['type'] = $value->is_type( 'variable' ) ? 'Variable' : "Simple";
      $product['regular_price'] = floatval($value->regular_price);
      $product['sale_price'] = floatval($price_sale_display);
      $product['price'] = floatval($price_for_display);
      $product['product_name'] = $value->name;
      $product['posted_date'] = wc_format_datetime($value->get_date_created(), 'm/d/Y');
      $product['status'] = $value->status;

      $categories = get_the_terms( $value->id, 'product_cat' );
      $terms = [];
      foreach ($categories as $cat) {
        $terms[] = str_replace('&amp;','&', $cat->name);
      }

      $product['category'] = implode(', ', $terms);
      $thumbnail = get_the_post_thumbnail_url($value->id);
      $product['thumbnail'] = $thumbnail;

      $product['preview'] = get_permalink($value->id);

      $products[] = $product;
    }
  }

  $response = [
    'totalPages' => $paginate->max_num_pages,
    'totalProducts' => $paginate->total,
    'currentPage' =>  $current_page,
    'pageSize' =>   $page_size,
    'productsList' =>  $products
  ];

  if ( $products ) {    
    return addin_seller_message_status( 200, null, $response );
  } else {
    return addin_seller_message_status( 404, esc_html__('The products is not found!', 'addin.sg'), $response);
  }
}

/**
 * API update attribute product 
 */
function addin_seller_create_attribute($request) {
  $attributes_data = $request->get_param("attribute_data");
  if($attributes_data){
    $productAttributes=[];
    foreach($attributes_data as $attribute){
        $attr = wc_sanitize_taxonomy_name(stripslashes($attribute["name"])); 
        $attr = 'pa_'.$attr; 
        if($attribute["options"]){
            foreach($attribute["options"] as $option){
                wp_set_object_terms($product_id,$option,$attr,true); 
            }
        }
        $productAttributes[sanitize_title($attr)] = array(
            'name' => sanitize_title($attr),
            'value' => $attribute["options"],
            'position' => $attribute["position"],
            'is_visible' => $attribute["visible"],
            'is_variation' => $attribute["variation"],
            'is_taxonomy' => '1'
        );
    }

    update_post_meta($product_id,'_product_attributes',$productAttributes); 
    if ($productAttributes) {
      return addin_seller_message_status( 200, null, $productAttributes );
    } else {
      return addin_seller_message_status( 404, esc_html__('Create Attributes failed!', 'addin.sg'), null);
    }
  }
}


