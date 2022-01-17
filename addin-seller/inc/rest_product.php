<?php

function create_or_update_product_basic_info($product_id, $data) {
	$product = null;
	
	if( isset($product_id) && $product_id > 0 ) {
 		$product =  wc_get_product($product_id);	
		if( ! $product ) return addin_seller_message_status(404, 'Not found', null);
	} else { //add new
		//$product = addin_seller_get_product_object_type( $data->type_product );	
		//$product_id = $product->get_id();
		$arg = array(
			'post_type' => 'product', 
			'post_status' => 'pending', 
			'post_author' => $data->user_id,
			'post_title' => wp_strip_all_tags($data->name),
			'post_content' => wp_strip_all_tags($data->content),
		);

		$product_id = wp_insert_post( $arg );	
		$product =  wc_get_product($product_id);
	}
	//create or update
	$status = addin_seller_product_update_general($product, $data);

	return $status;
}

function addin_seller_product_update_general($product, $data) {
	
	$product_id = $product->get_id();

	if(isset($data->name) && $data->name) 
		$product->set_name(wp_strip_all_tags($data->name));

	if( isset($data->content) && $data->content) 
		$product->set_description( $data->content);

	$product->set_featured(false); //not feature
	$product->set_virtual(false);

	// Prices
	$product->set_regular_price( isset($data->general_regular_price) ? $data->general_regular_price : '');
	$product->set_sale_price( isset( $data->general_sale_price) ? $data->general_sale_price : '' );
	$product->set_price( isset( $data->general_sale_price) ? $data->general_sale_price :  $data->general_regular_price);

	//From simple to variable
	$old_product_type = $product->is_type('simple') ? 'simple' : 'variable';
	if( $data->type_product !== $old_product_type) {		
		wp_remove_object_terms( $product_id, $old_product_type, 'product_type', true );
		wp_set_object_terms( $product_id, $data->type_product, 'product_type', true ); 
	}
	
	// Taxes
	if ( get_option( 'woocommerce_calc_taxes' ) === 'yes' ) {
		$product->set_tax_status(  isset($data->general_tax_status) ? $data->general_tax_status : 'taxable' );
		$product->set_tax_class(  isset($data->general_tax_class) ? $data->general_tax_class : '' );
	}
	
	//Wallet Credit
	if( isset($data->general_wallet_credit))
		update_post_meta($product_id, '_fsww_credit', $data->general_wallet_credit);
	
	if( isset($data->general_wallet_cashback))
		update_post_meta($product_id, '_fsww_cashback', $data->general_wallet_cashback);
	
	if( isset($data->general_commission))
		update_post_meta($product_id, '_commission', $data->general_commission);
	
	// SKU and Stock (Not a virtual product)
	//if( isset($data->virtual) && ! $data->virtual) {
		$product->set_sku( isset( $data->inventory_sku) ? wc_clean($data->inventory_sku) : '' );
		$product->set_manage_stock( isset( $data->inventory_manage_stock) ? $data->inventory_manage_stock : false );
		$product->set_stock_status( isset( $data->inventory_stock_status) ? $data->inventory_stock_status : 'instock' );
		if( isset( $data->inventory_manage_stock) && $data->inventory_manage_stock) {
			$product->set_stock_status( $data->inventory_stock_quantity );
			$product->set_backorders( isset( $data->inventory_backorders) ? $data->inventory_backorders : 'no' ); // 'yes', 'no' or 'notify'
		}
	//}
	
	// Sold Individually
	$product->set_sold_individually( isset( $data->sold_individually) ? $data->sold_individually : false );
	
	// Weight, dimensions and shipping class
	/* 
	$product->set_weight( isset( $data->weight) ? $data->weight : '' );
	$product->set_length( isset( $data->length) ? $data->length : '' );
	$product->set_width( isset(  $data->width) ?  $data->width : : '' );
	$product->set_height( isset( $data->height) ? $data->height : '' ); */
	if( isset( $data->shipping_class_id) )
		$product->set_shipping_class_id( intval($data->shipping_class_id));	

	// Product categories and Tags
	if( isset( $data->categories) && $data->categories) {
		$category_ids = [];
		foreach($data->categories as $key => $cat) {
			$category_ids[] = $cat->value;
		}

		$product->set_category_ids( $category_ids );
	}
	
	/* if( isset( $data->tag_ids) )
		$product->set_tag_ids( $data->tag_ids); */
	// Upsell and Cross sell (IDs)	
	if( isset($data->linked_products_upsell) && $data->linked_products_upsell) {
		$upsell_ids = [];
		foreach($data->linked_products_upsell as $key => $item) {
			$upsell_ids[] = $item->value;
		}		
		$product->set_upsell_ids( $upsell_ids );
	}

	if( isset($data->linked_products_cross_sell) && $data->linked_products_cross_sell) {
		$cross_sell_ids = [];
		foreach($data->linked_products_cross_sell as $key => $item) {
			$cross_sell_ids[] = $item->value;
		}
		$product->set_cross_sell_ids( $cross_sell_ids );
	}
		
	// Images and Gallery
	//new image & check new upload/removed

	if(isset($data->new_thumbnail)) {
		foreach($data->new_thumbnail as $image) {
			$new_image_id = addin_seller_save_image_base64($image, $product->name.'_tn');
			if( $new_image_id > 0 ) $product->set_image_id($new_image_id);
		}	
	} else {
		$thumbnail = isset($data->thumbnail->image_id) ? $data->thumbnail->image_id : "";
		$product->set_image_id($thumbnail); 
	}	
	//photo gallery	
 	$gallery_ids = [];	
	if(isset($data->photo_galleries)) {
		foreach($data->photo_galleries as $photo) {
			$gallery_ids[] = $photo->image_id;
		}
	}
	//new photo gallery
	//check new upload/removed
	if(isset($data->new_photo_galleries)) {
		foreach($data->new_photo_galleries as $image) {
			$new_image_id = addin_seller_save_image_base64($image, $product->name.'_pt');
			if( $new_image_id > 0 ) $gallery_ids[] = $new_image_id;
		}
	}
	
	$product->set_gallery_image_ids( $gallery_ids );

	// Attributes
	if( isset( $data->attributes) ) {		
		addin_seller_update_attributes($product_id, $data->attributes);	
	}
	
	//if( isset( $data->default_attributes) )
	//	$product->set_default_attributes( $data->default_attributes); // Needs a special formatting


	// Variations
	if( isset( $data->variations) && $data->type_product === 'variable' ) {
		addin_seller_update_variations($product_id, $data->variations);
	}

	// Reviews, purchase note and menu order
	$product->set_reviews_allowed( isset( $data->reviews) ? $data->reviews : true );
	//$product->set_purchase_note( isset( $data->note) ? $data->note : '' );
	//if( isset( $data->menu_order) ) $product->set_menu_order( $data->menu_order);	
	
	## --- UPDATE INFO OF PRODUCT --- ##
	$product_id = $product->save();

	if( is_wp_error($product_id)) {
		return addin_seller_message_status(400, $product_id->get_error_message(), null);
	} else {
		return addin_seller_message_status(200, 'The product have been created/updated successfull!', null);
	}
}

// Utility function that returns the correct product object instance
// For New Product
function addin_seller_get_product_object_type( $type ) {
	// Get an instance of the WC_Product object (depending on his type)
	/* switch($type) {
		case 'variable':
			$product = new WC_Product_Variable();
			break;
		case 'grouped':
			$product = new WC_Product_Grouped();
			break;
		case 'external':
			$product = new WC_Product_External();
			break;
		default:
			$product = new WC_Product_Simple(); // "simple" By default
			break;
	}
	
	return ( ! is_a( $product, 'WC_Product' ) ) ? false : $product; */
}


function delete_variations($product_id, $variations){
	$product =  wc_get_product($product_id);  
	$product_variations = $product->get_available_variations();

	$new_variations = [];
	foreach($variations as $var ) {
		$new_variations[] = $var->id;
	}

	foreach($product_variations as $var) {	
		if( !in_array($var['variation_id'], $new_variations)) {
			$variation = new WC_Product_Variation($var['variation_id']);
			$variation->delete(true);
		}
	}
}
// Utility function that prepare product attributes before saving
function addin_seller_update_variations( $product_id, $variations ){
	foreach( $variations as $key => $variation) {
	
		//Delete
		delete_variations($product_id, $variations);
		
		if( is_numeric($variation->id)) 
			$productVar = new WC_Product_Variation($variation->id );
		else 
			$productVar = new WC_Product_Variation();
		//Delete

		$attributes = [];
		foreach( $variation->attributes as $key => $attr) {
			$attributes[$attr->attr] = $attr->value;
		}
		
		$productVar->set_parent_id( $product_id );
		$productVar->set_attributes($attributes);
		$productVar->set_status($variation->enabled ? 'publish' : 'private');
		//$productVar->set_sku($variation->sku);
		$price = $variation->sale_price ? $variation->sale_price : $variation->regular_price;
		$productVar->set_price($price);
		$productVar->set_sale_price($variation->sale_price);
		$productVar->set_regular_price($variation->regular_price);
		$productVar->set_stock_status($variation->stock_status);
		$productVar->set_shipping_class_id($variation->shipping_class_id);
		$productVar->set_tax_class($variation->tax_class);
		
		if(isset($variation->new_thumbnail)) {
			foreach($variation->new_thumbnail as $image) {
				$new_image_id = addin_seller_save_image_base64($image, $variation->id.'_vtn');
				if( $new_image_id > 0 ) {
					$productVar->set_image_id($new_image_id);
				}
			}
		}
		//$variation->set_image_id();
		//$variation->set_tax_status();
		//$variation->set_upsell_ids();
		//$variation->set_cross_sell_ids(); 
		$productVar->save();
		update_post_meta($variation->id, '_fsww_cashback', $variation->wallet_cashback);		
	}
}

function addin_seller_update_attributes( $product_id, $attributes) {

	if( $product_id <= 0 ) return;

    // Loop through the attributes array
	$position = 0;

	$list_attributes = [];
	foreach ($attributes as $id => $attribute) {
		$term_ids = array();
		foreach( $attribute->options as $t => $term ){
			$term_ids[] = $term->id;			
		}

		$taxonomy = $attribute->name;
		$list_attributes[$taxonomy] = array (
			'name' => $taxonomy, // set attribute name
			'value' => $term_ids,				
			'position' => $position++,
			'is_visible' => $attribute->visible,
			'is_variation' => $attribute->variation,
			'is_taxonomy' => isset($attribute->is_taxonomy) ? $attribute->is_taxonomy : 1
		);

		// Save the possible option value for the attribute which will be used for variation later
		wp_set_object_terms( $product_id, $attribute->name, $taxonomy, false );
		wp_set_post_terms( $product_id, $term_ids, $taxonomy, false );
	}

	if($list_attributes) {
		update_post_meta($product_id, '_product_attributes', $list_attributes);		
	} 
}

function addin_seller_create_product($request) {

	$product = $request->get_param("product_info");	
	$accessToken = $request->get_param("accessToken");

	$allowAccess = addin_seller_check_user_login($accessToken);
	//$userId

	if( !$allowAccess ) return addin_seller_message_status(401, 'Unauthorized', null);
	if( !$product ) return addin_seller_message_status(404, 'Not Found', null);
	
	$product = json_decode(json_encode($product)); 
	return create_or_update_product_basic_info($product->productId, $product);
}

// save image base 64 and upload image on folder ../wp-content/uploads
function addin_seller_save_image_base64( $base64_img, $title = null, $is_post = false ) {

	require_once( ABSPATH . 'wp-admin/includes/file.php' );
	require_once( ABSPATH . 'wp-admin/includes/image.php' );
	require_once( ABSPATH . 'wp-admin/includes/media.php' );

	// Upload dir.
	$upload_dir  = wp_upload_dir();
	$upload_path = str_replace( '/', DIRECTORY_SEPARATOR, $upload_dir['path']) . DIRECTORY_SEPARATOR;
	
	$image_parts = explode(";base64,", $base64_img);
	$imgExt = str_replace('data:image/', '', $image_parts[0]);      
	$image = str_replace(' ', '+', $image_parts[1]);
	$imageName =  str_replace(' ','_', $title).".".$imgExt;
	$decoded = base64_decode($image_parts[1]);
	$file_type = 'image/jpeg';
	// Save the image in the uploads directory.
	$image_upload = file_put_contents( $upload_path . $imageName, $decoded );

	$file_array = array(
		'name' => $imageName,
		'tmp_name' => $upload_path . $imageName,
		'type'=> $imgExt
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
	wp_update_attachment_metadata($attach_id,$attachment_meta);

	return $attach_id;
}

/**
 * Update product image or product gallery
 * $meta_post: product image: '_thumbnail_id'
 *             product gallery: '_product_image_gallery'
 */
function addin_seller_update_product_gallery_image($post_id, $data, $meta_post, $title = null) {

	if(is_array($data)){
		$ids= [];
		foreach($data as $value){
			$ids []= addin_seller_save_image_base64($value,$title);
		}
	
		$values = implode(",", $ids );
		update_post_meta( $post_id, $meta_post, $values);

	} else {
		$id = addin_seller_save_image_base64($data,$title);
		update_post_meta( $post_id, $meta_post, $id);
	}  
}

/**
 * 
*/
function addin_seller_create_attributes($request) {
	$params = $request->get_param("data");	
	$params = json_decode(json_encode($params)); 
	
	$attributes = $params->attributes;	
	$product_id = $params->product_id;	
	$accessToken = $params->accessToken;

	$allowAccess = addin_seller_check_user_login($accessToken);
	//$userId

	if( !$allowAccess ) return addin_seller_message_status(401, 'Unauthorized', null);
	if( !$attributes ) return addin_seller_message_status(404, 'Not Found', null);
	
	
	addin_seller_update_attributes($product_id, $attributes, true);
	return addin_seller_message_status(200, 'Done', null);
}

/**
 * 
 */
function addin_seller_create_variation_products($request) {

	$params = $request->get_param("data");	
	$params = json_decode(json_encode($params)); 

	$variations = $params->variations;
	$product_id = $params->product_id;	
	$accessToken = $params->accessToken;

	$allowAccess = addin_seller_check_user_login($accessToken);
	//$userId

	if( !$allowAccess ) return addin_seller_message_status(401, 'Unauthorized', null);
	if( !$variations ) return addin_seller_message_status(404, 'Not Found', null);	
	
	addin_seller_update_variations($product_id, $variations);

	return addin_seller_message_status(200, 'Done', null);
}