<?php
//addin SG Seller Portal  Lotus 2021
define(SECRET_KEY, 'YWRkaW4gU0cgU2VsbGVyIFBvcnRhbCAgTG90dXMgMjAyMQ==');

add_action( 'rest_api_init', 'addin_seller_register_api_hooks' );

function addin_seller_register_api_hooks() {
  register_rest_route(
    NAME_SPACE . VERSION,
    '/login',
    array(
      'methods'  => 'POST',
      'callback' => 'addin_seller_user_login',
      'permission_callback' => '__return_true'
    )
  );

  register_rest_route(
    NAME_SPACE . VERSION,
    '/verify_token',
    array(
      'methods'  => 'POST',
      'callback' => 'addin_seller_user_verify_token',
      'permission_callback' => '__return_true'
    )
  );

}

function addin_seller_user_login(WP_REST_Request $request){

  $creds = array();
  $creds['user_login'] = $request->get_param("username"); //'Jayden.Ooi';
  $creds['user_password'] = $request->get_param("password"); //'P@33w0rd!'
  $creds['user_login_time'] =  time();//$request->get_param("time"); //2h
  $creds['remember'] = true;

  if ( !$creds['user_login'] ||  !$creds['user_password'] || !$creds['user_login_time']) {
    return addin_seller_message_status( 401, esc_html__( 'Not Authorized', 'addin.sg' ), null );
  }
  
  //find user
  $user = null;
  if( strpos('@', $creds['user_login']) === false) 
    $user = get_user_by( 'login', $creds['user_login'] );
  else 
    $user = get_user_by( 'email', $creds['user_login'] );

  //The account is not registered on this site. If you are unsure of your username, try your email address instead
  if( !$user ) {
    $data = [ 'email' => 'The username/email is incorrect.', 'password' => ''];
    return addin_seller_message_status( 401, esc_html__( 'Unauthorized', 'addin.sg' ), $data );
  }

  $hash = wp_hash_password($creds['user_password']);
  if( !wp_check_password( $creds['user_password'], $user->data->user_pass, $user->ID ) ) {
    $data =  [ 'email' => '', 'password' => 'The password is incorrect.'];
    return addin_seller_message_status( 401, esc_html__( 'Unauthorized', 'addin.sg' ), $data );
  }
  
  $bam = [ $user->ID, $user->user_login, $user->user_email, $user->data->user_pass, $creds['user_login_time'] ];
  $expire_time = strtotime("+1 day +2 hours", $creds['user_login_time']);
  //$secret_key = base64_encode($user->user_login);
  $access_token = hash_hmac('sha256',implode('|', $bam), SECRET_KEY);
  $access_token = ['access_token' => $access_token, 'expire_time' => $expire_time, 'user_id' => $user->ID];
  $access_token = base64_encode(serialize( $access_token ));

  $old_access_token = get_user_meta($user->ID, 'addin_seller_access_token', true );
  update_user_meta( $user->ID, 'addin_seller_access_token', $access_token, $old_access_token );

  $response = [
    "user" => [
      'ID' => $user->data->ID,
      'user_login' => $user->data->user_login,
      'user_email' => $user->data->user_email,
      'user_registered' => $user->data->user_registered,
      'display_name' => $user->data->display_name,
    ],
    "expire_time" => $expire_time,
    "expire_date" => date('m/d/Y H:i', $expire_time),
    "access_token" => $access_token //user_name|user_email|time + secret_key $ tiem
  ];

  return addin_seller_message_status(200, null, $response);
}


function addin_seller_user_verify_token(WP_REST_Request $request) {

  $verify_token = $request->get_param("access_token");
  $user_id = $request->get_param("user_id");

  if ( !$verify_token || $user_id < 0) {
    return addin_seller_message_status( 401, esc_html__( 'The access token is not exists', 'addin.sg' ), $verify_token );
  }

  $access_token = get_user_meta($user_id, 'addin_seller_access_token', true );

  if( $access_token != $verify_token){
    return addin_seller_message_status( 401, esc_html__( 'Not validate', 'addin.sg' ), $access_token );
  }

  $user = get_user_by( 'id', $user_id );
  return addin_seller_message_status(200, null, $user->data);
}

function addin_seller_check_user_login($access_token) {
  $allowAccess = false;
  $confirm_token = $access_token;
  $confirm_token = unserialize( base64_decode($access_token ) );  
  return $confirm_token;
  if( $confirm_token 
    && isset($confirm_token['expire_time']) 
    && $confirm_token['expire_time'] > time()) {
      $user = get_user_by( 'id', $confirm_token['user_id'] );      
      $allowAccess = ($user && $user->ID === $confirm_token['user_id']);
  }
  return $allowAccess;
}