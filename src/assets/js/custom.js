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

    $('.single-datepicker').daterangepicker({
        singleDatePicker: true,
        opens: 'center'
    });
    
    $('.daterange-right').daterangepicker({
        opens: 'center'
    });


    // quantity
    function wcqib_refresh_quantity_increments() {
        jQuery("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").each(function(a, b) {
            var c = jQuery(b);
            c.addClass("buttons_added"), c.children().first().before('<input type="button" value="-" class="minus" />'), c.children().last().after('<input type="button" value="+" class="plus" />')
        })
    }
    String.prototype.getDecimals || (String.prototype.getDecimals = function() {
        var a = this,
            b = ("" + a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        return b ? Math.max(0, (b[1] ? b[1].length : 0) - (b[2] ? +b[2] : 0)) : 0
    }), jQuery(document).ready(function() {
        wcqib_refresh_quantity_increments()
    }), jQuery(document).on("updated_wc_div", function() {
        wcqib_refresh_quantity_increments()
    }), jQuery(document).on("click", ".plus, .minus", function() {
        var a = jQuery(this).closest(".quantity").find(".qty"),
            b = parseFloat(a.val()),
            c = parseFloat(a.attr("max")),
            d = parseFloat(a.attr("min")),
            e = a.attr("step");
        b && "" !== b && "NaN" !== b || (b = 0), "" !== c && "NaN" !== c || (c = ""), "" !== d && "NaN" !== d || (d = 0), "any" !== e && "" !== e && void 0 !== e && "NaN" !== parseFloat(e) || (e = 1), jQuery(this).is(".plus") ? c && b >= c ? a.val(c) : a.val((b + parseFloat(e)).toFixed(e.getDecimals())) : d && b <= d ? a.val(d) : b > 0 && a.val((b - parseFloat(e)).toFixed(e.getDecimals())), a.trigger("change")
    }); 


    
    $(".Travellers-dropdown-title").click(function(){ 
        $(".Travellers-dropdown-data").toggleClass("Travellershide");
    }); 

    $(".select-root-left h5").click(function(){
        $(".flight-from-data").toggleClass("flight-from-hide");
    });

    $(".select-root-right h5").click(function(){
        $(".flight-to-data").toggleClass("flight-from-hide");
    });

    var owlslider = jQuery(".carousel-search-date");
    if (owlslider.length > 0) {
        owlslider.each(function () {
            var $this = $(this),
                $items = $this.data("items") ? $this.data("items") : 1,
                $loop = $this.attr("data-loop") ? $this.data("loop") : true,
                $navdots = $this.data("nav-dots") ? $this.data("nav-dots") : false,
                $navarrow = $this.data("nav-arrow") ? $this.data("nav-arrow") : true,
                $autoplay = $this.attr("data-autoplay") ? $this.data("autoplay") : false,
                $autospeed = $this.attr("data-autospeed") ? $this.data("autospeed") : 5000,
                $smartspeed = $this.attr("data-smartspeed") ? $this.data("smartspeed") : 1000,
                $autohgt = $this.data("autoheight") ? $this.data("autoheight") : false,
                $space = $this.attr("data-space") ? $this.data("space") : 30,
                $animateOut = $this.attr("data-animateOut") ? $this.data("animateOut") : false;

            $(this).owlCarousel({
                loop: $loop,
                items: $items,
                responsive: {
                    0: {
                        items: $this.data("xx-items") ? $this.data("xx-items") : 1,
                    },
                    480: {
                        items: $this.data("xs-items") ? $this.data("xs-items") : 1,
                    },
                    768: {
                        items: $this.data("sm-items") ? $this.data("sm-items") : 2,
                    },
                    980: {
                        items: $this.data("md-items") ? $this.data("md-items") : 3,
                    },
                    1200: {
                        items: $items,
                    },
                },
                dots: $navdots,
                space: $space,
                autoplayTimeout: $autospeed,
                smartSpeed: $smartspeed,
                autoHeight: $autohgt,
                margin: $space,
                nav: $navarrow,
                navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
                autoplay: $autoplay,
                autoplayHoverPause: true,
            });
        });
    }
    

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

    $(window).on("load",function(){
        $(".content").mCustomScrollbar();
    });
});