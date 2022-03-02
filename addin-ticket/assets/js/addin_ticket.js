/**
 * 
*/

(function ($) {
  $(document).ready(function () {
    collapse_box_message_ticket();
    add_new_message_button();
    general_enquiry();
    ajax_product();
    submit_create_new_ticket();
    create_new_reply_message();
    set_time_out_ticket_success();
    pag_load_all_ticket(1);
  });

  $(window).on('load', function () {
 
   
  });

  // set pop up success 3s
  function set_time_out_ticket_success() {
    setTimeout(function() {
      // $('.pop-up-success').hide();
      // $('.pop-up-background').hide();
      $( ".pop-up-success" ).hide()
    }, 15000);
  }

  //  Show field when change category
  function general_enquiry() {
    var categories = jQuery('.category');
    categories.change(function () {
      $("#brand-name > option[value='']").removeAttr("selected");
      $("#brand-name > option[value='']").attr("selected", true);  

      var data = {
        'action': "get_all_seller_brand", 
      }  
      console.log(data);
     $.ajax({
        type : "POST", 
        dataType : "JSON", 
        url : ticket_ajax.ajax_url,
        data : data,
        beforeSend: function(){
            
        },
        success: function(response) {
          console.log(response);
          $('select.brand-name').html(response);
        },
        error: function(response){             
            console.log( response );
        }
      }) 

        if ($(this).val() !== 'order') {
            $('.order-number-list').hide();
            $('.product-list').hide();
            $('select.product-list-order').html('<option value="" selected="">Select Product</option>');
            $("#order-number > option[value='']").removeAttr("selected");         
            $("#order-number > option[value='']").attr("selected", true); 
            
        }
        else {
          $('.order-number-list').show(); 
          $('.product-list').show(); 
      
        }
    });
  }

  //  Collapse box message ticket
  function collapse_box_message_ticket(){
    $(".collapse_button").click(function(){
      $(this).parent().toggleClass('show_content');
        $('.ticket_subject.show_content ~ .message_box').addClass('message_box_show');
        $(this).text($(this).text() == 'Expand' ? 'Collapse' : 'Expand');
    });
  }

  // Show reply message for customer
  function add_new_message_button(){
      $(".add_new_message_button").click(function(){
          $(this).hide();
          $(this).parent().addClass('show_reply_message');
          $('.show_reply_message .new_reply_message').show();
      });
  }

  // AJAX Get all products from order
  function ajax_product() {
    $('select.order-number').change(function(){
      var order_id = $(this).find(":selected").attr('data-order-id'); 
      var data = {
        'action': "get_product_by_order", 
        'order_id': order_id,
      }  
      $('select.product-list-order').empty();
      console.log(data);
     $.ajax({
        type : "POST", 
        dataType : "JSON", 
        url : ticket_ajax.ajax_url,
        data : data,
        beforeSend: function(){
            
        },
        success: function(response) {
          console.log(response);
          if(response.data) {
            $('select.product-list-order').html(response.data);
          }
          if(response.data_brand){
            $('select.brand-name').html(response.data_brand);
          }          
        },
        error: function(response){             
            console.log( response );
        }
      }) 
    })
  }

  // AJAX get all product by seller brand
  function ajax_product_by_brand() {
    $('select.brand-name').change(function(){
      
      var brand_id = $(this).find(":selected").attr('data-brand-id'); 
      var data = {
        'action': "get_product_by_brand", 
        'brand_id': brand_id,
      }  
      $('select.product-list-order').empty();
      console.log(data);

     $.ajax({
        type : "POST", 
        dataType : "JSON", 
        url : ticket_ajax.ajax_url,
        data : data,
        beforeSend: function(){
            
        },
        success: function(response) {
          console.log(response);
          if(response.data) {
            $('select.product-list-order').html(response.data);
          }else {
            $('select.product-list-order').html('<option value="">No product</option>');
          }          
        },
        error: function(response){             
            console.log( response );
        }
      }) 
    })
  }

  // AJAX submit ticket and insert form data to database
  function submit_create_new_ticket(){
    $('#create-new-ticket').on('submit', function(event){
      event.preventDefault();
      var that = this;
      var categories = $('#categories').val();
		  var order_number = $('#order-number').val();
		  var brand_name = $('#brand-name').val();
		  var product_list = $('#product-list').val();
		  var new_ticket_subject = $('#new_ticket_subject').val();
		  var new_ticket_message = $('#new_ticket_message').val();
      
      clear_error();
      var count_err = 0;
      if(categories == "")
      {    
        $("#categories").addClass('validate-error');
        count_err +=1;     
      }else {

         if(!order_number && $(".order-number-list").css('display') !== 'none' )
        {    
          $("#order-number").addClass('validate-error');
          count_err +=1;

          if(product_list == '')
          {
            $(".product-label").addClass('validate-error');
            count_err +=1;
          }

        }else if(order_number) {

          if(product_list == '')
          {
            $(".product-label").addClass('validate-error');
            count_err +=1;
          }

        }
        if(!brand_name && $(".brand-list").css('display') !== 'none' )
        { 
          $("#brand-name").addClass('validate-error');
          count_err +=1;
        }
  
      }  

      if(!brand_name && $(".brand-list").css('display') !== 'none' )
      { 
        $("#brand-name").addClass('validate-error');
        count_err +=1;
      }

       if(!new_ticket_subject)
      {
   
        $(".subject-label").addClass('validate-error');
        count_err +=1;
      }

     if(!new_ticket_message)
      {
        $(".message-label").addClass('validate-error');    
        count_err +=1;
      }

      console.log(count_err);
     if(count_err >0){
       return false;
     } 
      else
      {
        $('#hidden_product').val($('#product-list').val());
        var form_data = $(this).serialize();
        var fd = new FormData();
        var files_data = $('#create-new-ticket .files-data');

        $.each($(files_data), function(i, obj) {
          $.each(obj.files,function(j,file){
              fd.append('image[' + j + ']', file);
          })
      });

      fd.append('action', 'submit_ticket');  
      fd.append('data', form_data);  
      console.log(fd);
        $.ajax({
          type : "POST", 
          url : ticket_ajax.ajax_url,
          data : fd,
          contentType: false,
          processData: false,
          success:function(response)
          {
            var data = JSON.parse(response);
            console.log(data); 
          
            var error = data.error;
          
            $('.image-error ').empty();
            $.each(error, function( index, value ) {              
              $('.image-error').append('<p class="error">'+value+'</p>') + "<br>";
            });

            if(!error){
        

              $(".after-loading-success-create-ticket").show();
              $(".success-create-ticket-container .message-success").html(data.success);
              
              setTimeout(function() { 
                $(".after-loading-success-create-ticket").fadeOut(400);
                that.reset();
              }, 3000);

            }
            
          }
        });

      }
    });
  }

  //  Clear error message after fill fields
  function clear_error() {
    var categories = $('#categories');
		var order_number = $('#order-number');
		var brand_name = $('#brand-name');
		var product_list = $('#product-list');
		var new_ticket_subject = $('#new_ticket_subject');
		var new_ticket_message = $('#new_ticket_message');

     categories.change(function(){
       if(categories.val() != '' ) {
          categories.removeClass('validate-error');
       }  
     });

    brand_name.change(function(){
       if(brand_name.val() != '' ) {
          brand_name.removeClass('validate-error');
       }   
     }); 

    order_number.change(function(){
       if(order_number.val() != '' ) {
          order_number.removeClass('validate-error');
       }   
     });

    product_list.change(function(){
       if(product_list.val() != '' ) {
          $(".product-label").removeClass('validate-error');
       }   
     }); 

    new_ticket_subject.change(function(){
       if(new_ticket_subject.val() != '' ) {
          $(".subject-label").removeClass('validate-error');
       }   
     });

    new_ticket_message.change(function(){
       if(new_ticket_message.val() != '' ) {
          $(".message-label").removeClass('validate-error');
       }   
     }); 
     
     $(".files-data").change(function(){  
        $('.image-error .error').empty();    
    });  
    
    // clear error replys message
    $(".new_ticket_message").change(function(){
      if($(".new_ticket_message").val() != '' ) {
         $(".message_subject_label").removeClass('validate-error');
      }   
    }); 
  }

  function create_new_reply_message() {
    $('.form-reply-message').on('submit', function(event){
      event.preventDefault();
      var message = $(this).find('.new_ticket_message');
      var error_image = $(this).find('.image-error');
      var that = this;
      var count_err = 0;
      var new_message = message.val();

      clear_error();
      
      if(!new_message)
      {
        $(this).find(".message_subject_label").addClass('validate-error');    
        count_err +=1;
      }
      console.log(new_message);
      console.log(count_err);
     if(count_err >0){
       return false;
     } else {
        
        var form_data = $(this).serialize();
        var fd = new FormData();
        var files_data = $('.form-reply-message .files-data');

        $.each($(files_data), function(i, obj) {
          $.each(obj.files,function(j,file){
              fd.append('customer_image[' + j + ']', file);
          })
      });

      fd.append('action', 'submit_reply_message');  
      fd.append('data', form_data);
      $.ajax({
        type : "POST", 
        url : ticket_ajax.ajax_url,
        data : fd,
        contentType: false,
        processData: false,
        success:function(response)
        {
          var data = JSON.parse(response);
          console.log(data); 
        
          message.change(function(){
            if(message.val() != '' ) {
               $(this).find(".message_subject_label").removeClass('validate-error');
            }   
          }); 
          
          var error = data.error;
        
          error_image.empty();
          $.each(error, function( index, value ) {              
            error_image.append('<p class="error">'+value+'</p>') + "<br>";
          });

          if(!error){        
            // that.reset();  
            location.reload(true);
          }
          
       
        }
      });  
     }

    });
  }

  function pag_load_all_ticket(page){

    collapse_box_message_ticket();
    add_new_message_button();
  
    order_id = $(location).attr('pathname');

    var data = {
        page: page,
        order_id:order_id,
        action: "pagination-load-ticket-list"
    };

    $.ajax({
      type : "POST", 
      dataType : "JSON", 
      url : ticket_ajax.ajax_url,
      data : data,
      beforeSend: function(){
          
      },
      success: function(response) {

        console.log(response);
     
        $(".ticket_list_pag_container").html(response.data);
        collapse_box_message_ticket();
        add_new_message_button();

        $(".ticket_list_pag_loading").css({'background':'none', 'transition':'all 1s ease-out'});
        $('.ticket_list_pag_container .ticket-universal-pagination li.active').click(function(){
          var page = $(this).attr('p');
          pag_load_all_ticket(page);
         
        });

        create_new_reply_message();

        if(response.null == "") {
          $('.ticket-universal-pagination').empty();
        }

      },
      error: function(response){             
          console.log( response );
      }
    }) 
}


})(jQuery);