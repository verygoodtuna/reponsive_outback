$(function () {
    $(window).on('scroll', function() {
        const sct = $(window).scrollTop();
        if (sct > 0) {
            $('.Header').addClass('on')
        }
        else {
        $('.Header').removeClass('on')
        }
    });

    const MainSlide = new Swiper('.main_slide', {
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        on: {
            slideChangeTransitionStart: function() {
                $('.MainVisual .dots li')
                .eq(this.eq)
            }
        }
    });

    $('.MainVisual .arrows .left').on('click', function () {
        MainSlide.slidePrev();
    })
    $('.MainVisual .arrows .right').on('click', function () {
        MainSlide.slideNext();
    })

    $('.MainVisual .dots li').on('click', function () {
        const idx = $(this).index();
        // 자기자신 번호 붙임
        $(this).addClass('on').siblings().removeClass('on');
        MainSlide.slideTo(idx);
    })
})