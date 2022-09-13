/*
--------------------------------------------------------------------------------------------------------
*  Project    :  Reward 360                                                                                         *
* Author     : Vikas Mishra | Shachi Mehta                                                       *
* Support    :                                                               *
*-------------------------------------------------------------------------------------------------------
NOTE: This file contains all scripts for the actual Template.
*/

/*-------------------------------------------------------------
:: Document Ready
---------------------------------------------------------------*/
$(document).ready(function($) {
    // Whole Script Strict Mode Syntax
	"use strict";
	
$(".sb_head .dropdown").hover(function(){
 $('.sb_head  .list-travel').removeClass("hideDrop");
});

    /*-------------------------------------------------------------
    :: window on scroll
    ---------------------------------------------------------------*/
    $(window).on( 'scroll', function() {

        var ScrollTop = $(".scrollToTop");
        if ($(this).scrollTop() < 100) {
            ScrollTop.removeClass("active");
        } else {
            ScrollTop.addClass("active");
        }
        // :: back to top JS End
    });

    $(window).on("load",function(){
        $(".content").mCustomScrollbar();
    });

  function  arrayCompare(arr_1, arr_2) {
    var equal = arr_1.length == arr_2.length; // if array sizes mismatches, then we assume, that they are not equal
    if (equal) {
        $.each(arr_1, function(foo, val) {
            if (!equal) return false;
            if ($.inArray(val, arr_2) == -1) {
                equal = false;
            } else {
                equal = true;
            }
        });
    }
    return equal;
} 
});

