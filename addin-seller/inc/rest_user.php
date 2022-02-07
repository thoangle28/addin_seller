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

  register_rest_route(
    NAME_SPACE . VERSION,
    '/register',
    array(
      'methods'  => 'POST',
      'callback' => 'addin_seller_user_register',
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
    return addin_seller_message_status( 400, esc_html__( 'Bad Request', 'addin.sg' ), null );
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
    return addin_seller_message_status( 400, esc_html__( 'Bad Request', 'addin.sg' ), $data );
  }

  $hash = wp_hash_password($creds['user_password']);
  if( !wp_check_password( $creds['user_password'], $user->data->user_pass, $user->ID ) ) {
    $data =  [ 'email' => '', 'password' => 'The password is incorrect.'];
    return addin_seller_message_status( 400, esc_html__( 'Bad Request', 'addin.sg' ), $data );
  }
  //check user roles, only: customer, seller_portal access
  $roles = $user->roles;
  if ( !in_array("seller_portal", $roles, true) 
      && !in_array("customer", $roles, true)) {
    $alert = 'Sorry, you are not allowed to access this page. Please contact the administrator to update your roles.';
    $data =  [ 'role' => $alert];
    return addin_seller_message_status( 401, esc_html__( $alert, 'addin.sg' ), $data );
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

  if( $confirm_token 
    && isset($confirm_token['expire_time']) 
    && $confirm_token['expire_time'] > time()) {
      $user = get_user_by( 'id', $confirm_token['user_id'] );      
      $allowAccess = ($user && $user->ID === $confirm_token['user_id']);
  }
  return $allowAccess;
}


function addin_seller_user_register(WP_REST_Request $request) {

  $email = $request->get_param("email");
  $password = $request->get_param("password");
  $firstname = $request->get_param("firstname");
  $lastname = $request->get_param("lastname");
  //----------------------------------------------------------------
  $user_id = username_exists( $email );
 
  if ( ! $user_id && false == email_exists( $email ) ) {
    //$random_password = wp_generate_password( $length = 12, $include_standard_special_chars = false );
    $userdata = [
      'user_login' => $email,
      'user_pass' =>  $password,
      'user_email' => $email,
      'first_name' => $firstname,
      'last_name' =>  $lastname,
      'role' => '', //seller_portal
      'display_name' => $firstname,
      'user_activation_key' => guid_v4()
    ];

    $user_id = wp_insert_user( $userdata );
    if( !is_wp_error($user_id) ) {     
      //wp_new_user_notification($user_id, $data['user_pass'], 'user');
      wp_new_user_end_mail($user_id, $password);
      return addin_seller_message_status(200, 'Your account has been created successfully, please wait administrator approve!', null);
    } else {
      return addin_seller_message_status(409, $user_id->get_error_message(), null);
    }
  } else {
    return addin_seller_message_status(409, 'User already exists!', null);
  }
}

function wp_new_user_end_mail($user_id, $pass) {

  $user = get_user_by('id', $user_id);
  $message = 'Dear User,'. "\r\n\r\n";
  $message .= 'Your account has been created successfully, please wait administrator approve!'. "\r\n\r\n";
  $message .= sprintf( __( 'Username: %s' ), $user->user_login ) . "\r\n\r\n";
  $message .= sprintf( __( 'Password: %s' ), $pass ) . "\r\n\r\n";
  $message .= __( 'To set your password, go to https://seller.addin.sg/auth/login and then click on "Forgot password?"' ) . "\r\n\r\n";

  $wp_new_user_notification_email = array(
      'to'      => $user->user_email,
      'subject' => __( '[%s] Login Details' ),
      'message' => $message,
      'headers' => '',
  );

  $wp_new_user_notification_email = apply_filters( 'wp_new_user_notification_email', $wp_new_user_notification_email, $user, $blogname );

  wp_mail(
      $wp_new_user_notification_email['to'],
      wp_specialchars_decode( sprintf( $wp_new_user_notification_email['subject'], 'Addin SG - Seller Portal' ) ),
      $wp_new_user_notification_email['message'],
      $wp_new_user_notification_email['headers']
  );

}