(function($){
	"use strict";

	// Header Sticky
	$(window).on('scroll',function() {
		if ($(this).scrollTop() > 120){  
			$('.navbar-area').addClass("is-sticky");
		}
		else{
			$('.navbar-area').removeClass("is-sticky");
		}
	});

	// Others Option Responsive JS
	$(".others-option-for-responsive .dot-menu").on("click", function(){
		$(".others-option-for-responsive .container .container").toggleClass("active");
	});

	// Mean Menu
	$('.mean-menu').meanmenu({
		meanScreenWidth: "1199"
	});

	// Search Menu JS
	$(".others-option .search-box i").on("click", function(){
		$(".search-overlay").toggleClass("search-overlay-active");
	});
	$(".search-overlay-close").on("click", function(){
		$(".search-overlay").removeClass("search-overlay-active");
	});

	// Home Slides
	$('.home-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		animateOut: 'fadeOut',
    	animateIn: 'fadeIn',
		items: 1,
		navText: [
			"<i class='flaticon-null-4'></i>",
			"<i class='flaticon-null-4'></i>"
		]
	});
	$(".home-slides").on("translate.owl.carousel", function(){
		$(".main-banner-content .sub-title").removeClass("animated fadeInLeft").css("opacity", "0");
		$(".main-banner-content h1").removeClass("animated fadeInUp").css("opacity", "0");
		$(".main-banner-content .logo").removeClass("animated fadeInUp").css("opacity", "0");
		$(".main-banner-content h6").removeClass("animated fadeInDown").css("opacity", "0");
		$(".main-banner-content .default-btn").removeClass("animated fadeInLeft").css("opacity", "0");
		$(".main-banner-content .optional-btn").removeClass("animated fadeInRight").css("opacity", "0");
		$(".main-banner-image img").removeClass("animated fadeInUp").css("opacity", "0");
	});
	$(".home-slides").on("translated.owl.carousel", function(){
		$(".main-banner-content .sub-title").addClass("animated fadeInLeft").css("opacity", "1");
		$(".main-banner-content h1").addClass("animated fadeInUp").css("opacity", "1");
		$(".main-banner-content .logo").addClass("animated fadeInUp").css("opacity", "1");
		$(".main-banner-content h6").addClass("animated fadeInDown").css("opacity", "1");
		$(".main-banner-content .default-btn").addClass("animated fadeInLeft").css("opacity", "1");
		$(".main-banner-content .optional-btn").addClass("animated fadeInRight").css("opacity", "1");
		$(".main-banner-image img").addClass("animated fadeInUp").css("opacity", "1");
	});

	// Banner Video Slides
	$('.banner-video-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		animateOut: 'fadeOut',
    	animateIn: 'fadeIn',
		items: 1,
		navText: [
			"<i class='flaticon-null'></i>",
			"<i class='flaticon-null'></i>"
		]
	});

	// Popup Video
	$('.popup-youtube').magnificPopup({
		disableOn: 320,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false
	});

	// Tooltip JS
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	});

	// Tabs
	(function ($) {
		$('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
		$('.tab ul.tabs li a').on('click', function (g) {
			var tab = $(this).closest('.tab'), 
			index = $(this).closest('li').index();
			tab.find('ul.tabs > li').removeClass('current');
			$(this).closest('li').addClass('current');
			tab.find('.tab-content').find('div.tabs-item').not('div.tabs-item:eq(' + index + ')').slideUp();
			tab.find('.tab-content').find('div.tabs-item:eq(' + index + ')').slideDown();
			g.preventDefault();
		});
	})(jQuery);

	// Partner Slides
	$('.partner-slides').owlCarousel({
		loop: true,
		nav: false,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 40,
		navText: [
			"<i class='flaticon-null'></i>",
			"<i class='flaticon-null'></i>"
		],
		responsive: {
			0: {
				items: 2,
				margin: 30,
			},
			576: {
				items: 3,
				margin: 30,
			},
			768: {
				items: 4,
			},
			992: {
				items: 5,
			}
		}
	});

	// Top Team Slides
	$('.top-team-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='flaticon-null-4'></i>",
			"<i class='flaticon-null-4'></i>"
		],
		responsive: {
			0: {
				items: 1,
			},
			576: {
				items: 2,
			},
			768: {
				items: 3,
			},
			992: {
				items: 4,
			}
		}
	});

	// Featured Games Slides
	$('.featured-games-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		items: 1,
		navText: [
			"<i class='flaticon-left'></i>",
			"<i class='flaticon-right'></i>"
		]
	});

	// Products Slides
	$('.products-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='flaticon-null-4'></i>",
			"<i class='flaticon-null-4'></i>"
		],
		responsive: {
			0: {
				items: 1,
			},
			576: {
				items: 2,
			},
			768: {
				items: 2,
			},
			992: {
				items: 4,
			}
		}
	});

	// Blog Slides
	$('.blog-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		center: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='flaticon-left-chevron'></i>",
			"<i class='flaticon-null-3'></i>"
		],
		responsive: {
			0: {
				items: 1,
			},
			768: {
				items: 2,
			},
			992: {
				items: 2,
			}
		}
	});

	// Blog Slides Two
	$('.blog-slides-two').owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='flaticon-null-4'></i>",
			"<i class='flaticon-null-4'></i>"
		],
		responsive: {
			0: {
				items: 1,
			},
			768: {
				items: 2,
			},
			992: {
				items: 3,
			}
		}
	});

	// Article Image Slides
	$('.article-image-slides').owlCarousel({
		loop: true,
		nav: true,
		items: 1,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		animateOut: 'fadeOut',
        animateIn: 'fadeIn',
		navText: [
			"<i class='flaticon-left'></i>",
			"<i class='flaticon-right'></i>"
		]
	});

	// WOW Animation JS
	if($('.wow').length){
		var wow = new WOW({
			mobile: false
		});
		wow.init();
	}

	// Games Slides
	$('.games-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='flaticon-left'></i>",
			"<i class='flaticon-right'></i>"
		],
		responsive: {
			0: {
				items: 1,
			},
			576: {
				items: 2,
			},
			768: {
				items: 2,
			},
			992: {
				items: 3,
			}
		}
	});

	// Input Plus & Minus Number JS
	$('.input-counter').each(function() {
		var spinner = jQuery(this),
		input = spinner.find('input[type="text"]'),
		btnUp = spinner.find('.plus-btn'),
		btnDown = spinner.find('.minus-btn'),
		min = input.attr('min'),
		max = input.attr('max');
		
		btnUp.on('click', function() {
			var oldValue = parseFloat(input.val());
			if (oldValue >= max) {
				var newVal = oldValue;
			} else {
				var newVal = oldValue + 1;
			}
			spinner.find("input").val(newVal);
			spinner.find("input").trigger("change");
		});
		btnDown.on('click', function() {
			var oldValue = parseFloat(input.val());
			if (oldValue <= min) {
				var newVal = oldValue;
			} else {
				var newVal = oldValue - 1;
			}
			spinner.find("input").val(newVal);
			spinner.find("input").trigger("change");
		});
	});

	// Isotop Js
	var $grid = $('.magazine-items').isotope({
		itemSelector: '.grid-item',
		percentPosition: true,
		masonry: {
			// Use outer width of grid-sizer for columnWidth
			columnWidth: '.grid-item'
		}
	});

	// Go to Top
	$(function(){
		// Scroll Event
		$(window).on('scroll', function(){
			var scrolled = $(window).scrollTop();
			if (scrolled > 600) $('.go-top').addClass('active');
			if (scrolled < 600) $('.go-top').removeClass('active');
		});  
		// Click Event
		$('.go-top').on('click', function() {
			$("html, body").animate({ scrollTop: "0" },  500);
		});
	});

}(jQuery));