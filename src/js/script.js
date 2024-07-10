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

const PostApiData = async (endPoint, data) => {
  let response = await fetch(`${BaseURL}/${endPoint}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
};

const DeleteApiDataById = async (endPoint, id) => {
  let response = await fetch(`${BaseURL}/${endPoint}/${id}`, {
    method: "DELETE",
  });
  return response;
};

const createStars = (rating) => {
  const maxStars = 5;
  let starsHTML = "";

  for (let i = 0; i < maxStars; i++) {
    if (i < rating) {
      starsHTML += '<i class="fa-solid fa-star" style="color: gold;"></i>';
    } else {
      starsHTML += '<i class="fa-solid fa-star" style="color: #ccc;"></i>';
    }
  }

  return starsHTML;
};

getApiDataWithCallBack("data", (data) => {
  data.map((item) => {
    if (swiperContainer) {
      swiperContainer.innerHTML += `
      <div class="swiper-slide slider">
             <div class="slider__dropdown">
               <button><i class="fa-solid fa-magnifying-glass"></i></button>
               <button class="delete" data-id=${item?.id}>Delete</button>
               <button class="add__new--product__btn">New</button>

             </div>
             <div class="slider__image">
               <img
                 src="${item?.imageSrc}"
                 alt=""
               />

               <div class="slider__image--discount">
                 <span class="">${item?.productDiscount}</span>
               </div>
               <div class="slider__image--date">
                 <span class="">${item?.productDate}</span>
               </div>
             </div>
             <div class="slider__content">
               <h4>Golden Petra</h4>
               <p class="productStars">
               ${createStars(item.productRating)}
               
               </p>
               <p class="product__price">$${item?.productPrice}</p>
               <button class="product__button">
                 <div class="product__button--add">Add to Card</div>
                 <div class="product__button--shop">
                   <i class="fa-solid fa-cart-shopping"></i>
                 </div>
               </button>
             </div>
           </div>
   `;
    }

    const addProductBtn = document.querySelectorAll(".add__new--product__btn");
    addProductBtn.forEach((btn) =>
      btn.addEventListener("click", () => {
        window.open("createProduct.html", "_blank");
      })
    );

    const deleteProductBtn = document.querySelectorAll(".delete");
    deleteProductBtn &&
      deleteProductBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();

          let attrId = e.target.getAttribute("data-id");

          DeleteApiDataById("data", attrId);
        });
      });
  });
});

const productSrc = document.querySelector("#productSrc");
const productDiscount = document.querySelector("#productDiscount");
const productDate = document.querySelector("#productDate");
const productName = document.querySelector("#productName");
const productPrice = document.querySelector("#productPrice");
const productRating = document.querySelector("#productRating");

const productCreateBtn = document.querySelector("#createProductButton");

productCreateBtn &&
  productCreateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const productData = {
      imageSrc: productSrc.value,
      productDiscount: productDiscount.value,
      productDate: productDate.value,
      productName: productName.value,
      productPrice: productPrice.value,
      productRating: productRating.value,
    };

    PostApiData("data", productData);
  });

// <i class="fa-solid fa-star"></i>
