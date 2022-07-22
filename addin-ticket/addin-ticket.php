<?php
/**
 * Plugin Name: Addin Ticket
 * Plugin URI: http://www.addin.sg
 * Description: Addin Ticket
 * Version: 1.0
 * Author: Lotus Dev
 * Author URI: https://www.addin.sg/
 */

define('DOMAIN', "addin");
define('PLUGIN_TICKET_PATH_URL', plugin_dir_url( __FILE__ ));
define('NAME_TICKET_SPACE', "addin-seller/");
define('VERSION','v1');


require_once('inc/admin-list-ticket.php');
require_once('inc/admin-ticket-menu.php');
require_once('inc/admin-create-ticket.php');
require_once('inc/admin-create-table-database.php');
require_once('inc/admin-create-endpoint.php');
require_once('inc/common.php');
require_once('api-support-ticket.php');
require_once('inc/api-ticket.php');