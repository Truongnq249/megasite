
(function ($) {
    window.onload = function () {
        $(document).ready(function () {
            showSearchForm();
            menuMobile()
            footerAccordionMobile()
            structureToggleMobile()
            backToTop()
        });
    };
})(jQuery);


function showSearchForm() {
    $('.header__search-icon').click(function () {
        $('.header__search-form').toggleClass('active')
        $('#header-search').first().focus()
    })

    $(document).mouseup(function (e) {
        let container = $(".header__search");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $('.header__search-form').removeClass('active')
        }
    });
}



function menuMobile() {
    $('.header__bars').click(function () {
        $('.header__menu').toggleClass('active');
        $('.overlay').toggleClass('active');
    })
    $('.overlay').click(function () {
        $('.header__menu').removeClass('active');
        $('.overlay').removeClass('active');
    })
}


function footerAccordionMobile() {
    if ($(window).width() < 767) {
        $('.footer__item-title').click(function () {
            $(this).toggleClass('clicked');
            $(this).next('.footer__item-accordion-inner').slideToggle();
        })
    }
}


function structureToggleMobile() {
    if ($(window).width() < 768) {
        $('.option-item__button').click(function () {
            $(this).toggleClass('clicked')
            $(this).next('.option-item-inner').slideToggle()
        })
    }
}

function backToTop() {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 200) {
            $('.back-to-top').addClass('active')
        } else {
            $('.back-to-top').removeClass('active')
        }
    })

    $('.back-to-top').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 500);
        return false;
    })
}