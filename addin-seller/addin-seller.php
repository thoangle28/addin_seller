<?php
/**
 * Plugin Name: Addin Seller
 * Plugin URI: http://www.addin.sg
 * Description: Addin Seller
 * Version: 1.0
 * Author: Lotus Dev
 * Author URI: http://www.addin.sg
 */
define('NAME_SPACE', "addin-seller/");
define('VERSION','v1');

require_once('inc/rest_attribute.php');
require_once('inc/rest_category.php');
require_once('inc/rest_user.php');
require_once('inc/rest_product.php');


add_action( 'rest_api_init', 'addin_seller_register_rest_api' );
function addin_seller_register_rest_api() {
  /***
   * API get ALL attributes of product 
   */
  $route = '/product/attribute';
  register_rest_route( 
    NAME_SPACE . VERSION,$route,
    array(
      'methods' => 'GET',
      'callback' => 'addin_seller_get_attribute_product',
      'permission_callback' => '__return_true'
    ) 
  );


  $route = '/product/attribute/parents';
  register_rest_route( 
    NAME_SPACE . VERSION,$route,
    array(
      'methods' => 'GET',
      'callback' => 'addin_seller_get_parents_attribute_product',
      'permission_callback' => '__return_true'
    ) 
  );

  /***
   * API get all categories product
   */
  $route = '/product/categories';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'GET',
      'callback' => 'addin_seller_get_all_category_product',
      'permission_callback' => '__return_true'
    ) 
  );
  /***
   * API get category product information by id category
   */
  $route = '/product/categori-by-id';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_get_category_product_by_id',
      'permission_callback' => '__return_true'
    ) 
  );
   /***
   * API get category product information by id product
   */
  $route = '/product/category-by-id-product';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_get_category_product_by_product_id',
      'permission_callback' => '__return_true'
    ) 
  );

   /***
   * API get categories product child information by id category parent
   */
  $route = '/product/child-categories';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_get_child_category_from_parent_id',
      'permission_callback' => '__return_true'
    ) 
  );
  /***
   * API get product information of author manager product and by id product 
   */
  $route = '/product';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_get_product',
      'permission_callback' => '__return_true'
    ) 
  );
    /***
   * API create a product 
   */
  $route = '/create-product';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_create_product',
      'permission_callback' => '__return_true'
    ) 
  );

  //get attribute by parent id
  $route = '/product/attribute-list';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_get_attribute_parent',
      'permission_callback' => '__return_true'
    ) 
  );

  //API get all shipping
  $route = '/shipping-classes';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'GET',
      'callback' => 'addin_seller_get_shipping',
      'permission_callback' => '__return_true'
    ) 
  );
  
  //API get product by id, sku, price
  $route = '/products-by-user';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_get_all_products_by_user',
      'permission_callback' => '__return_true'
    ) 
  );

  //API update/create attributes products
  $route = '/product/create-attributes';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_create_attributes',
      'permission_callback' => '__return_true'
    ) 
  );

  //API create varion products
  $route = '/product/create-variations';
  register_rest_route( 
    NAME_SPACE . VERSION,$route, 
    array(
      'methods' => 'POST',
      'callback' => 'addin_seller_create_variation_products',
      'permission_callback' => '__return_true'
    ) 
  );

}   

function addin_seller_message_status($code = 200, $message = null, $data = [])  {
  return [ 'code' => $code, 'message' => $message, 'data' => $data ];
}