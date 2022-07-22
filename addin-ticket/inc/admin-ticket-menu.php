<?php

/**
 * Register Ads menu page.
 * 
 * @see add_menu_page()
 */

define( 'WLT_TEXT_DOMAIN', 'wp-list-table' );
function addin_register_ticket_menu_page() {
    add_menu_page(
        __( 'WP Ticket', WLT_TEXT_DOMAIN ), 
        __( 'WP Ticket', WLT_TEXT_DOMAIN ), 
        'manage_options',
        'support-ticket',
        'addin_support_ticket',
        'dashicons-buddicons-replies',
        80
    );

    $parent_slug = 'support-ticket';
    add_submenu_page( $parent_slug, 'Ticket List', 'Ticket List', 'manage_options', 'ticket-list', 'addin_support_ticket');
}
add_action( 'admin_menu', 'addin_register_ticket_menu_page' );