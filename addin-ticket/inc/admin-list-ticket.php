<?php

// if(!class_exists('WP_List_Table')){
//    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
// }
// class Link_List_Table extends WP_List_Table {

//     function __construct() {
//        parent::__construct( array(
//       'singular'=> 'wp_list_text_link', 
//       'plural' => 'wp_list_test_links', 
//       'ajax'   => false 
//       ) );
//     }

//     /**
//      * Add extra markup in the toolbars before or after the list
//      * @param string $which, helps you decide if you add the markup after (bottom) or before (top) the list
//     */
//     function extra_tablenav( $which ) {
//        if ( $which == "top" ){
//           echo"Hello, I'm before the table";
//        }
//        if ( $which == "bottom" ){
//           echo"Hi, I'm after the table";
//        }
//     }

//     /**
//      * Define the columns that are going to be used in the table
//      * @return array $columns, the array of columns to use with the table
//      */
//     function get_columns() {
//        return $columns= array(
//           'id'=>__('ID'),
//           'subject'=>__('Subject'),
//           'customer_id'=>__('Customer Id'),
//           'order_id'=>__('Order Id'),
//           'status'=>__('Status'),
//           'created'=>__('Created')
//        );
//     }

//     /**
//      * Decide which columns to activate the sorting functionality on
//      * @return array $sortable, the array of columns that can be sorted by the user
//      */
//     public function get_sortable_columns() {
//        return $sortable = array(
//           'id'=>'id',
//           'subject'=>'subject',
//           'customer_id'=>'customer_id',
//           'order_id'=>'order_id',
//           'order_id'=>'order_id'
//        );
//     }

//     /**
//      * Prepare the table with different parameters, pagination, columns and table elements
//      */
//     function prepare_items() {
//       //   global $wpdb, $_wp_column_headers;
//       //   $screen = get_current_screen();
//       //   $ticket_list = $wpdb->prefix . "addin_ticket_list";
//       //   $query = "SELECT * FROM $wpdb->$ticket_list";
//       //   var_dump(expression)

//       //   $orderby = !empty($_GET["orderby"]) ? mysql_real_escape_string($_GET["orderby"]) : 'ASC';
//       //   $order = !empty($_GET["order"]) ? mysql_real_escape_string($_GET["order"]) : ’;
//       //   if(!empty($orderby) & !empty($order)){ $query.=' ORDER BY '.$orderby.' '.$order; }

//        // /* -- Pagination parameters -- */
//        //      //Number of elements in your table?
//        //      $totalitems = $wpdb->query($query); //return the total number of affected rows
//        //      //How many to display per page?
//        //      $perpage = 5;
//        //      //Which page is this?
//        //      $paged = !empty($_GET["paged"]) ? mysql_real_escape_string($_GET["paged"]) : ’;
//        //      //Page Number
//        //      if(empty($paged) || !is_numeric($paged) || $paged<=0 ){ $paged=1; } 
//        //           "total_items" => $totalitems,
//        //           "total_pages" => $totalpages,
//        //           "per_page" => $perpage,
//        //      ) );
//        //    //The pagination links are automatically built according to those parameters

//        /* -- Register the Columns -- */
//           $columns = $this->get_columns();
//           $_wp_column_headers[$screen->id]=$columns;

//        /* -- Fetch the items -- */
//           $this->items = $wpdb->get_results($query);
//     }

//     /**
//      * Display the rows of records in the table
//      * @return string, echo the markup of the rows
//      */
//     function display_rows() {

//        //Get the records registered in the prepare_items method
//        $records = $this->items;

//        //Get the columns registered in the get_columns and get_sortable_columns methods
//        list( $columns, $hidden ) = $this->get_column_info();

//        //Loop for each record
//        if(!empty($records)){foreach($records as $rec){

//           //Open the line
//             echo '< tr id="record_'.$rec->link_id.'">';
//           foreach ( $columns as $column_name => $column_display_name ) {

//              //Style attributes for each col
//              $class = "class='$column_name column-$column_name'";
//              $style = "";
//              if ( in_array( $column_name, $hidden ) ) $style = ' style="display:none;"';
//              $attributes = $class . $style;

//              //edit link
//              $editlink  = '/wp-admin/link.php?action=edit&link_id='.(int)$rec->link_id;

//              //Display the cell
//              switch ( $column_name ) {
//                 case "col_link_id":  echo '< td '.$attributes.'>'.stripslashes($rec->link_id).'< /td>';   break;
//                 case "col_link_name": echo '< td '.$attributes.'>'.stripslashes($rec->link_name).'< /td>'; break;
//                 case "col_link_url": echo '< td '.$attributes.'>'.stripslashes($rec->link_url).'< /td>'; break;
//                 case "col_link_description": echo '< td '.$attributes.'>'.$rec->link_description.'< /td>'; break;
//                 case "col_link_visible": echo '< td '.$attributes.'>'.$rec->link_visible.'< /td>'; break;
//              }
//           }
//           echo'< /tr>';
//        }}
//     }

// }
// function addin_support_ticket(){
//     $wp_list_table = new Link_List_Table();
//     $wp_list_table->prepare_items();
//     $wp_list_table->display();
// }








if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

Class Wp_Ban_User extends WP_List_Table
{

    public function __construct()
    {
             parent::__construct( array(
                  'singular'=> 'wp_list_text_link', 
                  'plural' => 'wp_list_test_links', 
                  'ajax'   => false 
                  ) );      
            $this->prepare_items();
            $this->display();           

    }

    function get_columns() {
        $columns = array(
            'id'=>__('ID'),
            'subject'=>__('Subject'),
            'customer_id'=>__('Customer Id'),
            'order_id'=>__('Order Id'),
            'status'=>__('Status'),
            'created'=>__('Created')
        );
        return $columns;
    }
    function column_default( $item, $column_name ) {
        switch( $column_name ) {
            case 'id':
            case 'subject':
            case 'customer_id':
            case 'order_id':
            case 'status':
            case 'created':

                return $item[ $column_name ];
            default:
                return print_r( $item, true ) ;
        }
    }

    function prepare_items() {
        global $wpdb;
        $ticket_list = $wpdb->prefix . "addin_ticket_list";
        $query = "SELECT * FROM $ticket_list";
        $data_list = $wpdb->get_results($query);
        
        $example_data = [];
        if ($data_list) {
            foreach($data_list as $data) {
                $example_data[] = [
                    'id' => $data->id,
                    'subject' =>$data->subject,
                    'customer_id' =>$data->customer_id,
                    'order_id' => $data->order_id,
                    'status' => $data->status,
                    'created' => $data->created
                    
                ];
            }
        }
       
        // print_r($example_data);
        $columns = $this->get_columns();
        $hidden = array();
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = array($columns, $hidden, $sortable);
        $this->items = $example_data;
    }

    


}


function addin_support_ticket(){
    global $wpdb;

    $Obj_Wp_Ban_User=new Wp_Ban_User();
    $Obj_Wp_Ban_User->prepare_items();
}

