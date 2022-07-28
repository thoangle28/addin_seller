<?php
/**
 * API get all categories product
 */
function addin_seller_get_all_category_product()
{
  $categories = build_custom_category_tree(0, $categories, 0);
  if ($categories) {
    return addin_seller_message_status('200', null, $categories);
  } else {
    return addin_seller_message_status('404', esc_html__('No category', 'addin.sg'), null);
  }

  /*$args = array(
    'taxonomy' => 'product_cat',
    'orderby' => 'name',
    'order' => 'ASC',
    //'number' => 10,
    //'parent' => 0
  );

  $categories = get_categories($args);
  $filtered = [];

  if ($categories) {
    foreach ($categories as $value) {
      $filtered[] = array(
        //'term_id' => $value->term_id,
        'value' => $value->term_id,
        //'slug' => $value->slug,
        //'name' => str_replace('&amp;','&',$value->name),
        'label' => str_replace('&amp;','&',$value->name),
        //'parent' => $value->category_parent,
      );
    }
    return addin_seller_message_status('200', null, $filtered);
  } else {
    return addin_seller_message_status('404', esc_html__('No category', 'addin.sg'), null);
  }*/
}

/**
 * API get category product information by id category
 *  ex {
 *        "id":"618"
 *     }
 */
function addin_seller_get_category_product_by_id($request)
{
  $params = $request->get_params();
  $category = get_term_by('id', $params['id'], 'product_cat');

  if (isset($category->term_id)) {
    return addin_seller_message_status('200', null, $category);
  } else {
    return addin_seller_message_status('404', esc_html__('No category', 'addin.sg'),  null);
  }
}
/**
 * API get category product information by id product
 * ex {
 *      "id":"28391"
 *    }
 */
function addin_seller_get_category_product_by_product_id($request)
{
  $params = $request->get_params();
  $product_category = get_the_terms($params['id'], 'product_cat');

  if (isset($product_category[0]->term_id)) {
    return addin_seller_message_status('200', null, $product_category);
  } else {
    return addin_seller_message_status('404', esc_html__('No category', 'addin.sg'),  null);
  }
}

/**
 * API get categories product child information by id category parent
 * ex {
 *          "id":"618" 
 *     }
 */
function addin_seller_get_child_category_from_parent_id($request)
{
  $params = $request->get_params();

  $args = array(
    'taxonomy'     => 'product_cat',
    'child_of'     => 0,
    'parent'       => $params['id'],
  );

  $sub_cats = get_categories($args);

  if ($sub_cats) {
    foreach ($sub_cats as $value) {
      $filtered[] = array(
        'term_id' => $value->term_id,
        'slug' => $value->slug,
        'name' => $value->name,
        'parent' => $value->category_parent,
      );
    }
    return addin_seller_message_status('200', null, $filtered);
  } else {
    return addin_seller_message_status('404', esc_html__('No category', 'addin.sg'), null);
  }
}
/**
 * API get product information of author manager product and by id product 
 * ex: {
 *         "author_id": "123",
 *         "product_id":"28391
 *     }
 */
function addin_seller_get_product($request)
{
  $params = $request->get_params();
  $code = 200;
  $message = null;
  $data = [];

  if (!empty($params['product_id']) && !empty($params['author_id'])) {
    $product = get_post($params['product_id']);

    if ($product) {
      //get user brand
      $brand_id = get_user_meta($params['author_id'], 'seller_brand', true);
      $brand_post_id = get_post_meta($params['product_id'], 'product_brand', true);

      if( $brand_id === $brand_post_id) {
        //$product->post_author === $params['author_id']) {
        $data_products = wc_get_product($params['product_id']);
        $data = [];
        $variation = [];
        
        $data['id'] = $data_products->id;
        $data['name'] = $data_products->name;
        $data['user_id'] = intval($product->post_author);
        $data['status'] = $data_products->status;
        $data['type_product'] =(wp_get_object_terms( $data_products->id,  'product_type' )[0])->name;
    

        $data['thumbnail'] = [ 
          'src' => get_the_post_thumbnail_url($data_products->id, 'thumbnail'), 
          'image_id' => intval($data_products->image_id)
        ];
        
        $data['categories'] = addin_seller_get_the_terms($data_products->id, 'product_cat');

        //Phot Galleries tab
        foreach ($data_products->gallery_image_ids as $gallery_image_id) {
          $data['photo_galleries'][] = [
            'image_id' => $gallery_image_id,
            'src' => wp_get_attachment_thumb_url($gallery_image_id)
          ];
        }
        
        //Attributes
        $data['attributes'] = [];
        foreach ($data_products->attributes as $taxonomy => $attribute) { 
          $label = wc_attribute_label($taxonomy);
          $attr = $attribute->get_data();
          $attr['title'] = $label;

          if( $attr['options']) {
            $terms = get_terms([ 'taxonomy' => $taxonomy,
            'hide_empty' => false, 'include' => $attr['options']]);
            foreach($terms as $key => $term) {
              $attr['options'][$key] = [ 'attr' => $taxonomy,'id' => $term->term_id, 'value' => $term->slug, 'label' => $term->name ];
            }
          }

          $data['attributes'][] = $attr;
        }
        
        //$data['attributes'] = addin_seller_get_attributes_product_name($data['attributes']);

        //Linked Products
        $data['linked_products_upsell'] = addin_seller_upsell_ids($data_products->upsell_ids);
        $data['linked_products_cross_sell'] = addin_seller_upsell_ids($data_products->cross_sell_ids);

        //Shipping        
        $data['shipping_weight'] = $data_products->weight; //Weight in decimal form
        $data['shipping_length'] = $data_products->length;
        $data['shipping_width'] = $data_products->width;
        $data['shipping_height'] = $data_products->height;
        //Shipping classes are used by certain shipping methods to group similar products.
        $data['shipping_class_id'] = addin_seller_get_shipping_class($data_products->shipping_class_id);
        
        //Inventory
        $data['inventory_sku'] = $data_products->sku;
        $data['inventory_stock_status'] = $data_products->stock_status;
        // $data['inventory_manage_stock'] = $data_products->manage_stock;
        // $data['inventory_stock_quantity'] = $data_products->stock_quantity;
        // $data['inventory_backorders'] = $data_products->backorders;
        // $data['inventory_low_stock_amount'] = $data_products->low_stock_amount;
        // $data['inventory_sold_individually'] = $data_products->sold_individually;

        //Variant
        $data['variations'] = addin_seller_get_variable_product($params['product_id'], $variation) ;
        $data['variations_attr'] = [];
        if( $data_products->is_type('variable')) {
          $variations_attr = $data_products->get_variation_attributes();
          foreach($variations_attr as $key => $value) {
            $data['variations_attr'][] = $key;
          }  
        }

        $data['is_variable'] = $data_products->is_type('variable'); //false : simple

        //General        
        $data['general_price'] = $data_products->price;
        $data['general_regular_price'] = $data_products->regular_price;
        $data['general_sale_price'] = $data_products->sale_price;
        $data['general_total_sales'] = $data_products->total_sales;
        $data['general_tax_class'] = $data_products->tax_class;
        $data['general_tax_status'] = $data_products->tax_status;
        $data['general_wallet_credit'] = addin_seller_get_post_meta($params['product_id'], '_fsww_credit' );        
        $data['general_wallet_cashback'] = addin_seller_get_post_meta($params['product_id'], '_fsww_cashback' );         
        $data['general_commission'] = addin_seller_get_post_meta($params['product_id'], 'fs_commission_type_for_affiliate_in_product_level');

        //$data['featured'] = $data_products->featured; 
        //$data['catalog_visibility'] = $data_products->catalog_visibility;
        $data['content'] = $data_products->description;
        //$data['short_description'] = $data_products->short_description;       
       
        $data['parent_id'] = $data_products->parent_id;
        /* $data['reviews_allowed'] = $data_products->reviews_allowed;
        $data['purchase_note'] = $data_products->purchase_note;
        $data['menu_order'] = $data_products->menu_order;
        $data['virtual'] = $data_products->virtual;
        $data['downloadable'] = $data_products->downloadable;
        $data['download_limit'] = $data_products->download_limit;
        $data['rating_counts'] = $data_products->rating_counts;
        $data['average_rating'] = $data_products->average_rating;
        $data['review_count'] = $data_products->review_count;
        $data['meta_data'] = $data_products->meta_data;  */     
        
      } else {
        $code = 401;
        $message = esc_html__('No permission. The product does not belong to your brand, please contact the administrator', 'addin.sg');
      }

    } else {
      $code = 404;
      $message = esc_html__('No product found. Please check try again', 'addin.sg');
    }

  } else {
    $code = 404;
    $message = esc_html__('author_id and product_id not null', 'addin.sg');
  }

  return addin_seller_message_status($code, $message, $data);
}
//  Change upsell_id to upsell_name
function addin_seller_upsell_ids($data = [])
{
  $data_upsell = [];

  foreach ($data as $value) {
    $title = get_the_title($value);
    $data_upsell[] = ['value' => $value, 'label' => $title];
  }

  return $data_upsell;
}
// Format date
function addin_seller_data_format($data)
{
  $data = date_format($data, 'Y-m-d h:i');

  if ($data) {
    return $data;
  }
}

//  Get name shipping class from shipping class ID
function addin_seller_get_shipping_class($shipping_class)
{
  $shipping_class_term = get_term_by('id', $shipping_class, 'product_shipping_class');
  return ($shipping_class_term) ? $shipping_class_term->name : -1;
}

//  Get product post meta
function addin_seller_get_post_meta($id, $key)
{
  $value = get_post_meta($id, $key, true);
  return $value ? $value : "";
}

//  Get wallet_credit
function addin_seller_get_wallet_credit($id)
{
  $wallet_credit = get_post_meta($id, '_fsww_credit', true);
  return $wallet_credit ? $wallet_credit : "";
}

//  Get wallet_cashback
function addin_seller_get_wallet_cashback($id)
{
  $wallet_cashback = get_post_meta($id, '_fsww_cashback', true);
  return $wallet_cashback ? $wallet_cashback : "";
}

//  Get commission
function addin_seller_get_commission($id)
{
  $commission = get_post_meta($id, 'fs_commission_type_for_affiliate_in_product_level', true);
  return $commission ? $commission : "";
}

// add label for attribute
function addin_seller_add_label_attribute($att) {
  $data = [];

  foreach ($att as $key => $value){
    $data[] = array(
      'attr' => str_replace('attribute_', '', $key),
      'value'=> $value,
      'label'=>  ucwords(str_replace('-', ' ', $value))
    );
  }

  return $data;
}

//  Get variable product from ID product
function addin_seller_get_variable_product($id, $data = [])
{

  $product_variable = new WC_Product_Variable($id);
  $variations = $product_variable->get_children();

  foreach ($variations as $value) {
    $single_variation = new WC_Product_Variation($value);
    $data[] = array(
      'id' => $value,
      'sku' => $single_variation->sku,
      'attributes' => addin_seller_add_label_attribute($single_variation->get_variation_attributes()),
      'regular_price' => $single_variation->regular_price,
      'sale_price' => $single_variation->sale_price,
      'thumbnail' => [
        'src' => wp_get_attachment_thumb_url($single_variation->thumbnail_id),
        'image_id' => intval($single_variation->thumbnail_id)
      ],
      // 'date_on_sale_from'=>addin_seller_data_format($single_variation->date_on_sale_from),
      // 'date_on_sale_to'=>addin_seller_data_format($single_variation->date_on_sale_to),
      'stock_status'=> $single_variation->stock_status,
      // 'weight'=> $single_variation->weight,
      // 'length'=> $single_variation->length,
      // 'width'=> $single_variation->width,
      // 'height'=> $single_variation->height,
      'shipping_class_id'=> addin_seller_get_shipping_class($single_variation->shipping_class_id),
      'tax_class'=> $single_variation->tax_class,
      // 'description'=> $single_variation->description,
      'wallet_cashback'=> addin_seller_get_wallet_cashback($value),
      'enabled'=> $single_variation->status != 'publish' ? false : true,
      'downloadable'=> "",
      'virtual'=> "",
      'is_remove'=> false,
      'is_new'=> false,
      'manage_stock'=> $single_variation->manage_stock
    );
  }

  return $data;
}

function addin_seller_get_the_terms($product_id, $type) {

  $terms = get_the_terms($product_id, $type);

  if($terms) {

    $temrs_list = [];
    foreach ($terms as $term ) {
      $temrs_list[] = [
        "value" => $term->term_id,
        "label" => str_replace('&amp;','&', $term->name),
        "slug" => $term->slug,     
        //"parent" => $term->parent,
        //"count" => $term->count,
      ];
    }
    
    return $temrs_list;
  }

  return [];
}

function build_custom_category_tree ($parentId = 0, &$categories, $level = 0) {
  $terms = get_terms( array(
      'taxonomy' => 'product_cat',
      'hide_empty' => false,
      'hierarchical' => true,
      'parent' => $parentId,
      'orderby' => 'name',
      'order' => 'ASC',
  ) );

  if (count($terms)) {
      foreach ($terms as $id => $term) {			
          $categories[] = [ 
            //'id' => $term->term_id, 
            'label' => add_text($level). str_replace('&amp;', '&', $term->name), 
            'value' => $term->term_id 
          ];
          $sub = get_term_children($term->term_id, 'product_cat');
          if( $sub ) build_custom_category_tree($term->term_id, $categories, $level + 1);
      }
  }

  return $categories;
}

function show_build_custom_category_tree() {
  $test = [];
  build_custom_category_tree(0, $test, 0);
  print_r($test);
}

function add_text($level) {
$_ = '';
for($i = 0; $i < $level; $i++) {
    $_ .= '--';
}
return $_;
}