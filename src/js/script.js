var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: false,
  },
});

var newSwiper = new Swiper(".productSwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  },
});

// Get api
let BaseURL = "http://localhost:3000";

const swiperContainer = document.querySelector(
  ".swiper-wrapper.productwrapper"
);

const getApiDataWithCallBack = async (endPoint, cb) => {
  let response = await fetch(`${BaseURL}/${endPoint}`).then((res) =>
    res.json()
  );
  cb(response);
};

getApiDataWithCallBack("data", (data) => {
  data.map((item) => {
    swiperContainer.innerHTML += `
       <div class="swiper-slide slider">
              <div class="slider__dropdown">
                <button><i class="fa-solid fa-magnifying-glass"></i></button>
                <button>Delete</button>
              </div>
              <div class="slider__image">
                <img
                  src="${item.imageSrc}"
                  alt=""
                />

                <div class="slider__image--discount">
                  <span class="">${item.productDiscount}</span>
                </div>
                <div class="slider__image--date">
                  <span class="">${item.productDate}</span>
                </div>
              </div>
              <div class="slider__content">
                <h4>Golden Petra</h4>
                <p>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                </p>
                <p class="product__price">$${item.productPrice}</p>
                <button class="product__button">
                  <div class="product__button--add">Add to Card</div>
                  <div class="product__button--shop">
                    <i class="fa-solid fa-cart-shopping"></i>
                  </div>
                </button>
              </div>
            </div>
    `;
  });
});
