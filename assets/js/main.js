
(function ($) {
    window.onload = function () {
        $(document).ready(function () {
            showSearchForm();
            menuMobile()
            footerAccordionMobile()
            carousel()
            structureToggleMobile()
            backToTop()
            // Set same height theme item
            let themeItem = setHeight('ti', $('.theme-item'))
        });
    };
})(jQuery);

let setHeight = function setSameHeight(h, cl) {
    var h = 0;
    $(cl).each(function () {
        if ($(this).outerHeight() > h) {
            h = $(this).outerHeight();
        }
    }).css({ 'height': h });
}


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




function carousel() {
    let el = $('.theme-list-carousel');
    let carousel;
    let carouselOptions = {
        margin: 30,
        nav: false,
        dots: false,
        slideBy: 1,
        onInitialized: counter,
        onTranslated: counter,
        responsive: {
            0: {
                items: 2,
                rows: 2,
                margin: 15,
            },
            425: {
                items: 2,
                rows: 2,
                margin: 20,
            },
            768: {
                items: 3,
                rows: 3
            },
            991: {
                items: 5,
                rows: 5
            }
        }
    };

    function counter(event) {
        let element = event.target;         // DOM element, in this example .owl-carousel
        let items = event.item.count;     // Number of items
        let item = event.item.index + 1;     // Position of the current item

        // it loop is true then reset counter from 1
        if (item > items) {
            item = item - items
        }
        $('.theme-carousel-index').html(item)
        $('.theme-carousel-count').html(items)

    }

    //Taken from Owl Carousel so we calculate width the same way
    let viewport = function () {
        let width;
        if (carouselOptions.responsiveBaseElement && carouselOptions.responsiveBaseElement !== window) {
            width = $(carouselOptions.responsiveBaseElement).width();
        } else if (window.innerWidth) {
            width = window.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            width = document.documentElement.clientWidth;
        } else {
            console.warn('Can not detect viewport width.');
        }
        return width;
    };

    let severalRows = false;
    let orderedBreakpoints = [];
    for (let breakpoint in carouselOptions.responsive) {
        if (carouselOptions.responsive[breakpoint].rows > 1) {
            severalRows = true;
        }
        orderedBreakpoints.push(parseInt(breakpoint));
    }

    //Custom logic is active if carousel is set up to have more than one row for some given window width
    if (severalRows) {
        orderedBreakpoints.sort(function (a, b) {
            return b - a;
        });
        let slides = el.find('[data-slide-index]');
        let slidesNb = slides.length;
        if (slidesNb > 0) {
            let rowsNb;
            let previousRowsNb = undefined;
            let colsNb;
            let previousColsNb = undefined;

            //Calculates number of rows and cols based on current window width
            let updateRowsColsNb = function () {
                let width = viewport();
                for (let i = 0; i < orderedBreakpoints.length; i++) {
                    let breakpoint = orderedBreakpoints[i];
                    if (width >= breakpoint || i == (orderedBreakpoints.length - 1)) {
                        let breakpointSettings = carouselOptions.responsive['' + breakpoint];
                        rowsNb = breakpointSettings.rows;
                        colsNb = breakpointSettings.items;
                        break;
                    }
                }
            };

            let updateCarousel = function () {
                updateRowsColsNb();

                //Carousel is recalculated if and only if a change in number of columns/rows is requested
                if (rowsNb != previousRowsNb || colsNb != previousColsNb) {
                    let reInit = false;
                    if (carousel) {
                        //Destroy existing carousel if any, and set html markup back to its initial state
                        carousel.trigger('destroy.owl.carousel');
                        carousel = undefined;
                        slides = el.find('[data-slide-index]').detach().appendTo(el);
                        el.find('.fake-col-wrapper').remove();
                        reInit = true;
                    }


                    //This is the only real 'smart' part of the algorithm

                    //First calculate the number of needed columns for the whole carousel
                    let perPage = rowsNb * colsNb;
                    let pageIndex = Math.floor(slidesNb / perPage);
                    let fakeColsNb = pageIndex * colsNb + (slidesNb >= (pageIndex * perPage + colsNb) ? colsNb : (slidesNb % colsNb));

                    //Then populate with needed html markup
                    let count = 0;
                    for (let i = 0; i < fakeColsNb; i++) {
                        //For each column, create a new wrapper div
                        let fakeCol = $('<div class="fake-col-wrapper"></div>').appendTo(el);
                        for (let j = 0; j < rowsNb; j++) {
                            //For each row in said column, calculate which slide should be present
                            let index = Math.floor(count / perPage) * perPage + (i % colsNb) + j * colsNb;
                            if (index < slidesNb) {
                                //If said slide exists, move it under wrapper div
                                slides.filter('[data-slide-index=' + index + ']').detach().appendTo(fakeCol);
                            }
                            count++;
                        }
                    }
                    //end of 'smart' part

                    previousRowsNb = rowsNb;
                    previousColsNb = colsNb;

                    if (reInit) {
                        //re-init carousel with new markup
                        carousel = el.owlCarousel(carouselOptions);
                    }
                }
            };

            //Trigger possible update when window size changes
            $(window).on('resize', updateCarousel);

            //We need to execute the algorithm once before first init in any case
            updateCarousel();
        }
    }

    //init
    carousel = el.owlCarousel(carouselOptions);

    // Custom prev, next button
    $('.theme-carousel-control .theme-carousel-btn.prev').click(function () {
        carousel.trigger('prev.owl.carousel')
    })
    $('.theme-carousel-control .theme-carousel-btn.next').click(function () {
        carousel.trigger('next.owl.carousel')
    })
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