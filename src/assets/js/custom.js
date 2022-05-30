/*
--------------------------------------------------------------------------------------------------------
* Project    :                                                                                         *
* Author     : piyush Tapaniya | +91 83060 05795                                                       * 
* Support    : piyush.tapaniya90@gmail.com                                                             * 
*------------------------------------------------------------------------------------------------------- 
NOTE: This file contains all scripts for the actual Template.
*/  

/*-------------------------------------------------------------
:: Document Ready
---------------------------------------------------------------*/ 
$(document).ready(function($) {	
    // Whole Script Strict Mode Syntax
	"use strict";   

    $("#main-menu").slicknav({
        allowParentLinks: true,
        prependTo: '#mobile-menu-wrap',
        label: '', 
    });
    $(".mobile-menu-trigger").on("click", function(e) {
        $(".mobile-menu-container").addClass("menu-open");
        e.stopPropagation();
    });
    $(".mobile-menu-close").on("click", function(e) {
        $(".mobile-menu-container").removeClass("menu-open");
        e.stopPropagation();
    }); 


    /*-------------------------------------------------------------
    :: window Ready
    ---------------------------------------------------------------*/ 
    $(window).ready(function(){
		// loader JS Start
		$('.loader-box').fadeOut();
		// loader JS End 
	});

    /*-------------------------------------------------------------
    :: window on scroll
    ---------------------------------------------------------------*/  
    $(window).on( 'scroll', function() {
        // :: sticky menu JS Start
        // var $scroll = $(window).scrollTop();
        // if($scroll > 5){
        //     $('.header').addClass('sticky');
        // }else{
        //     $('.header').removeClass('sticky');
        // }
        // :: sticky menu JS End

        // :: back to top JS Start   
        var ScrollTop = $(".scrollToTop");      
        if ($(this).scrollTop() < 100) {
            ScrollTop.removeClass("active");
        } else {
            ScrollTop.addClass("active");
        }
        // :: back to top JS End
    }); 
});