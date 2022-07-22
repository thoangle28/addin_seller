<?php
/**
 * API get all categories product
 */
function addin_seller_get_all_category_product()
{
  $args = array(
    'taxonomy' => 'product_cat',
    'orderby' => 'name'
  );

  $categories = get_categories($args);
  $filtered = [];

  if ($categories) {
    foreach ($categories as $value) {
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
function addin_seller_get_category_product_by_id_product($request)
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
function addin_seller_get_category_product_child_by_parent_id($request)
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
      
      if ($product->post_author === $params['author_id']) {
        $data_products = wc_get_product($params['product_id']);
        $data = [];
        $variation = [];
        
        $data['id'] = $data_products->id;
        $data['sku'] = $data_products->sku;
        $data['name'] = $data_products->name;
        $data['status'] = $data_products->status;
        $data['type_product'] =(wp_get_object_terms( $data_products->id,  'product_type' )[0])->name;
        $data['date_created'] = addin_seller_data_format($data_products->date_created);
        $data['date_modified'] = addin_seller_data_format($data_products->date_modified);
        $data['date_on_sale_from'] = addin_seller_data_format($data_products->date_on_sale_from);
        $data['date_on_sale_to'] = addin_seller_data_format($data_products->date_on_sale_to);

        $data['thumbnail'] = get_the_post_thumbnail_url($data_products->id, 'thumbnail');//wp_get_attachment_url($data_products->image_id);
        $data['category'][] = get_the_terms($data_products->id, 'product_cat');

        foreach ($data_products->gallery_image_ids as $gallery_image_id) {
          $data['product_galery_image'][] = [
            'image_id' => $gallery_image_id,
            'src' => wp_get_attachment_thumb_url($gallery_image_id)
          ];
            //wp_get_attachment_url($gallery_image_id);
        }
        
        foreach ($data_products->attributes as $value) {
          $data['attributes_product'][] = ($value->get_data());
        }

        $data['featured'] = $data_products->featured;
        $data['catalog_visibility'] = $data_products->catalog_visibility;
        $data['product_content'] = $data_products->description;
        $data['short_description'] = $data_products->short_description;
        $data['price'] = $data_products->price;
        $data['regular_price'] = $data_products->regular_price;
        $data['sale_price'] = $data_products->sale_price;
        $data['regular_price'] = $data_products->regular_price;
        $data['total_sales'] = $data_products->total_sales;
        $data['tax_class'] = $data_products->tax_class;
        $data['manage_stock'] = $data_products->manage_stock;
        $data['stock_quantity'] = $data_products->stock_quantity;
        $data['backorders'] = $data_products->backorders;
        $data['low_stock_amount'] = $data_products->low_stock_amount;
        $data['sold_individually'] = $data_products->sold_individually;
        $data['weight'] = $data_products->weight;
        $data['length'] = $data_products->length;
        $data['width'] = $data_products->width;
        $data['height'] = $data_products->height;
        $data['upsell'] = addin_seller_upsell_ids($data_products->upsell_ids);
        $data['cross_sell'] = addin_seller_upsell_ids($data_products->cross_sell_ids);
        $data['parent_id'] = $data_products->parent_id;
        $data['reviews_allowed'] = $data_products->reviews_allowed;
        $data['purchase_note'] = $data_products->purchase_note;
        $data['menu_order'] = $data_products->menu_order;
        $data['virtual'] = $data_products->virtual;
        $data['downloadable'] = $data_products->downloadable;
        $data['download_limit'] = $data_products->download_limit;
        $data['rating_counts'] = $data_products->rating_counts;
        $data['average_rating'] = $data_products->average_rating;
        $data['review_count'] = $data_products->review_count;
        $data['meta_data'] = $data_products->meta_data;
        $data['shipping_class_id'] = addin_seller_get_shipping_class($data_products->shipping_class_id);
        $data['variation_attibutes']= addin_seller_get_variable_product($params['product_id'],$variation) ;
        $data['is_variable'] = $data_products->is_type('variable'); //false : simple

      } else {
        $code = 401;
        $message = esc_html__('No permission.Author of product is:'.$product->post_author, 'addin.sg');
      }

    } else {
      $code = 404;
      $message = esc_html__('No product found.Please check product_id again', 'addin.sg');
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
    $data_upsell[$value] = $title ;
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
  $shipping_class_term = get_term($shipping_class, 'product_shipping_class');
  return ($shipping_class_term->name);
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
      'attributes' => $single_variation->get_variation_attributes(),
      'regular_price' => $single_variation->price,
      'sale_price' => $single_variation->price,
      'sku' => $single_variation->sku,
      'thumbnail' => wp_get_attachment_thumb_url($single_variation->image_id),
      //'date_on_sale_from'=>addin_seller_data_format($single_variation->date_on_sale_from),
      //'date_on_sale_to'=>addin_seller_data_format($single_variation->date_on_sale_to),
      'stock_status'=> $single_variation->stock_status,
      //'weight'=> $single_variation->weight,
      //'length'=> $single_variation->length,
      //'width'=> $single_variation->width,
      //'height'=> $single_variation->height,
      'shipping_class_id'=> addin_seller_get_shipping_class($single_variation->shipping_class_id),
      'tax_class'=> $single_variation->tax_class,
      //'description'=> $single_variation->description,
       'wallet_cashback' => 234
    );
  }

  return $data;
}




/**
 * API create product
 *      Simple Product                                                        Variable Product
 * ex: {
 *      "post_author":16,                                                     "post_author":16,          
 *      "sku":"SLK9302",                                                      "sku":"SLK9302", 
 *      "post_content":"product-test",                                        "post_content":"product-test",
 *      "post_title":"test-product",                                          "post_title":"test-product",
 *      "short_description":"short description",                              "short_description":"short description",
 *      "project_description":"produc project description",                   "project_description":"produc project description",
 *      "product_cat":["Furniture","Foyer"],                                  "product_cat":["Furniture","Foyer"],
 *      "price":678,                                                          "price":678,
 *      "sale_price":null,                                                    "sale_price":null,
 *      "sale_price_dates_from":"2022-01-02",                                 "sale_price_dates_from":"2022-01-02",
 *      "sale_price_dates_to":"2022-02-23",                                   "sale_price_dates_to":"2022-02-23",
 *      "product_type":"simple",                                              "product_type":"variable",
 *                                                                            "attribute_data": 
 *                                                                               [
 *                                                                                        {
 *                                                                                        "name":"size-test",  
 *                                                                                         "options":["S", "L", "XL", "XXL"],
 *                                                                                         "visible": 1, 
 *                                                                                          "variation": 1
 *                                                                                         }, 
 *                                                                                        {
 *                                                                                         "name":"color-test",  
 *                                                                                         "options":["Red", "Blue", "Black", "White"],
 *                                                                                         "visible": 1, 
 *                                                                                         "variation": 1
 *                                                                                        }
 *                                                                                       ]                                                     
 *                                                                                        
 * }
 */
function addin_seller_create_product($request) {

  $post_author = $request->get_param("post_author");
  $post_content = $request->get_param("post_content");
  $post_title = $request->get_param("post_title");
  $short_description = $request->get_param("short_description");
  $product_cat = $request->get_param("product_cat");
  $product_type = $request->get_param("product_type"); 
  $price = $request->get_param("price");
  $sale_price = $request->get_param("sale_price");
  $sale_price_dates_from = $request->get_param("sale_price_dates_from");
  $sale_price_dates_to = $request->get_param("sale_price_dates_to");
  $project_description = $request->get_param("project_description");
  $sku = $request->get_param("sku");
  $attributes_data = $request->get_param("attribute_data");

  $post = array(
    'post_author' => $post_author,
    'post_content' => $post_content,
    'post_status' => "publish",
    'post_title' => $post_title,
    'post_parent' => '',
    'post_type' => "product",
    'post_excerpt' => $short_description
  );

  $post_id = wp_insert_post($post);

  if ($post_id) {
  
    wp_set_object_terms($post_id, $product_cat, 'product_cat');
    wp_set_object_terms($post_id, $product_type, 'product_type');
    update_post_meta($post_id, '_visibility', 'visible');
    update_post_meta($post_id, '_stock_status', 'instock');
    update_post_meta($post_id, 'total_sales', '0');
    update_post_meta($post_id, '_downloadable', 'yes');
    update_post_meta($post_id, '_virtual', 'yes');
    update_post_meta($post_id, '_regular_price', $price);
    update_post_meta($post_id, '_sale_price', $sale_price);
    update_post_meta($post_id, '_purchase_note', "");
    update_post_meta($post_id, '_featured', "no");
    update_post_meta($post_id, '_weight', "");
    update_post_meta($post_id, '_length', "");
    update_post_meta($post_id, '_width', "");
    update_post_meta($post_id, '_height', "");
    update_post_meta($post_id, '_sku', $sku);
    update_post_meta($post_id, '_sale_price_dates_from', $sale_price_dates_from);
    update_post_meta($post_id, '_sale_price_dates_to', $sale_price_dates_to);
    update_post_meta($post_id, '_price', $price);
    update_post_meta($post_id, '_sold_individually', "");
    update_post_meta($post_id, '_manage_stock', "no");
    update_post_meta($post_id, '_backorders', "no");
    update_post_meta($post_id, '_stock', "");
    update_post_meta($post_id, 'project_description', $project_description);

    //update attribute data for variable product
    if (sizeof($attributes_data) > 0) {
      $attributes = array();

      foreach ($attributes_data as $key => $attribute_array) {
        if (isset($attribute_array['name']) && isset($attribute_array['options'])) {
        
          $taxonomy = 'pa_' . wc_sanitize_taxonomy_name($attribute_array['name']);
          $option_term_ids = array(); 

          foreach ($attribute_array['options'] as $option) {               
              wp_set_object_terms($post_id, $option, $taxonomy, true);         
              $option_term_ids[] = get_term_by('name', $option, $taxonomy)->term_id;
          }
        }
        
        $attributes[$taxonomy] = array(
          'name'          => $taxonomy,
          'value'         => $option_term_ids,
          'position'      => $key + 1,
          'is_visible'    => $attribute_array['visible'],
          'is_variation'  => $attribute_array['variation'],
          'is_taxonomy'   => '1'
        );
      }
     
      update_post_meta($post_id, '_product_attributes', $attributes);
    }

    return addin_seller_message_status(200, null, $post_id);
  } else {
    return addin_seller_message_status(404, esc_html__('Error', 'addin.sg'), null);
  }
}