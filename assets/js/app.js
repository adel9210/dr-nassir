jQuery(document).ready(function ($) {



  const writings = new Swiper(".writings__swiper", {
    spaceBetween: 42,
    navigation: {
      nextEl: ".writings__swiper__controls .swiper-controls--next",
      prevEl: ".writings__swiper__controls .swiper-controls--prev",
    },

    pagination: {
        clickable: true,
        el: ".writings__swiper__controls .swiper-pagination",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 991px
      991: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  });
  const testimonials = new Swiper(".testimonials__swiper", {
    spaceBetween: 42,
    navigation: {
      nextEl: ".testimonials__swiper__controls .swiper-controls--next",
      prevEl: ".testimonials__swiper__controls .swiper-controls--prev",
    },
    pagination: {
      clickable: true,
      el: ".testimonials__swiper__controls .swiper-pagination",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 991px
      991: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  });
  const news = new Swiper(".news__swiper", {
    spaceBetween: 42,
    navigation: {
      nextEl: ".news__swiper__controls .swiper-controls--next",
      prevEl: ".news__swiper__controls .swiper-controls--prev",
    },
    pagination: {
      clickable: true,
      el: ".news__swiper__controls .swiper-pagination",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 991px
      991: {
        slidesPerView: 3,
        spaceBetween: 42,
      },
    },
  });
  const quotation = new Swiper(".quotation__swiper", {
    spaceBetween: 42,
    navigation: {
      nextEl: ".quotation__swiper__controls .swiper-controls--next",
      prevEl: ".quotation__swiper__controls .swiper-controls--prev",
    },
    pagination: {
      clickable: true,
      el: ".quotation__swiper__controls .swiper-pagination",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      // when window width is >= 991px
      991: {
        slidesPerView: 1,
        spaceBetween: 42,
      },
    },
  });
  // REMOVE SPINNER
  // setTimeout(() => {
  $('.loader').fadeOut('slow');
  // wow.init();

  // }, 1000)


  const topButton = document.getElementById("gotToTopButton");
  const headerNav = document.querySelector(".header__mobile-nav");
  topButton?.addEventListener('click', topFunction)

  // window.onscroll = function () { scrollFunction(topButton, headerNav) };

  mobileNavMenuRender();

});

function scrollFunction(topButton, headerNav) {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topButton.style.display = "block";
    headerNav.style.top = '0px';
  } else {
    topButton.style.display = "none";
    // headerNav.style.top = '60px';
  }

  if (document.body.scrollTop > 120 || document.documentElement.scrollTop > 120) {
    $('.event-details__container').css('bottom', '50px');
  } else {
    $('.event-details__container').css('bottom', '-250px')
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function mobileNavMenuRender() {
  const navExpand = [].slice.call(document.querySelectorAll('.nav-expand'))
  const backLink = `<li class="nav-item">
	<a class="nav-link nav-back-link" href="javascript:;">
		رجوع
	</a>
</li>`

  navExpand.forEach(item => {
    item.querySelector('.nav-expand-content').insertAdjacentHTML('afterbegin', backLink)
    item.querySelector('.nav-link').addEventListener('click', () => item.classList.add('active'))
    item.querySelector('.nav-back-link').addEventListener('click', () => item.classList.remove('active'))
  })


  // ---------------------------------------
  // not-so-important stuff starts here

  const openMenuBtn = document.getElementById('openMenu');
  const closeMenuBtn = document.getElementById('closeMenu');

  openMenuBtn.addEventListener('click', function (e) {
    e.preventDefault();
    $('.header__mobile').fadeIn('slow');
    $('body').addClass('utl-opened');
  })

  closeMenuBtn.addEventListener('click', function (e) {
    e.preventDefault();
    $('.header__mobile').fadeOut('slow');
    $('body').removeClass('utl-opened');
  })

  $('.header__mobile .nav-link').on('click', function () {
    // $('.header__mobile').fadeOut('slow');
    $('body').removeClass('utl-opened');
  })
}
