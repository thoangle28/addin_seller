<?php
/**
 * Init Css, Js
*/

/**
 * For Front End
 */
function addin_ticket_css_js(){
    
    //3rd 

    //css
    $v = "1.0.0";
    wp_enqueue_style('ticket-css', PLUGIN_TICKET_PATH_URL.'assets/css/addin_ticket.css?'.rand(), array(), $v, 'all' );
    wp_enqueue_style( 'dashicons' );
    //js
    wp_enqueue_script('addin-ticket-js', PLUGIN_TICKET_PATH_URL.'assets/js/addin_ticket.js?'.rand(), array(), $v, 'true' );  
    wp_localize_script( 'addin-ticket-js', 'ticket_ajax', array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );
}
add_action('wp_enqueue_scripts', 'addin_ticket_css_js');


