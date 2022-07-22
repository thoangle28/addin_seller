<?php
// Create Table for plugin
function detect_plugin_activation( $addinTicket, $network_activation) {
  global $wpdb;
      $charsetCollate = $wpdb->get_charset_collate();
      $contactTable = $wpdb->prefix . 'addin_ticket_list';
      $createContactTable = "CREATE TABLE IF NOT EXISTS `{$contactTable}` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `customer_id` bigint(20) UNSIGNED NOT NULL,
          `order_id` bigint(20) UNSIGNED NULL,
          `category` varchar(255) NULL,
          `product_name` varchar(255) NOT NULL,
          `subject` longtext NULL,
          `status` varchar(255) NOT NULL,
          `brand_id` bigint(20) UNSIGNED NOT NULL,
          `created` timestamp NOT NULL,
          PRIMARY KEY (`id`)
      ) {$charsetCollate};";

      $addin_ticket_message_table = $wpdb->prefix . 'addin_ticket_message';
      $create_addin_ticket_message_table = "CREATE TABLE IF NOT EXISTS `{$addin_ticket_message_table}` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `ticket_id` bigint(20) UNSIGNED NOT NULL,
          `ticket_message` longtext NOT NULL,
          `attchment_id` longtext NULL,
          `author_id` bigint(20) UNSIGNED NOT NULL,
          `ticket_created_on` timestamp NOT NULL,
          PRIMARY KEY (`id`)
      ) {$charsetCollate};";
      
      $addin_ticket_image_table = $wpdb->prefix . 'addin_ticket_images';
      $create_addin_ticket_image_table = "CREATE TABLE IF NOT EXISTS `{$addin_ticket_image_table}` (
          `id` bigint(20) UNSIGNED NOT NULL,
          `name` varchar(255) NOT NULL,
          `type` varchar(255) NOT NULL,
          `path` varchar(255) NOT NULL,
          `created_on` timestamp NOT NULL,
          PRIMARY KEY (`id`)
      ) {$charsetCollate};";
      
      require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
      dbDelta( $createContactTable );
      dbDelta( $create_addin_ticket_message_table );
      dbDelta( $create_addin_ticket_image_table );

}
add_action( 'activated_plugin', 'detect_plugin_activation', 10, 2 );
