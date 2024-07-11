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

// const updateApiDataById = async (endPoint, id, data) => {
//   let response = await fetch(`${BaseURL}/${endPoint}/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response;
// };

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

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIcon();
};

const renderProducts = (data) => {
  swiperContainer.innerHTML = "";

  data.forEach((item) => {
    console.log("Product Item:", item);
    swiperContainer.innerHTML += `
      <div class="swiper-slide slider">
        <div class="slider__dropdown">
          <button><i class="fa-solid fa-magnifying-glass"></i></button>
          <button class="delete" data-id="${item.id}">Delete</button>
          <button class="add__new--product__btn">New</button>
        </div>
        <div class="slider__image">
          <img src="${item.imageSrc}" alt="" />
          <div class="slider__image--discount">
            <span class="">${item.productDiscount}</span>
          </div>
          <div class="slider__image--date">
            <span class="">${item.productDate}</span>
          </div>
        </div>
        <div class="slider__content">
          <h4>${item.productName}</h4>
          <p class="productStars">
            ${createStars(item.productRating)}
          </p>
          <p class="product__price">$${item.productPrice}</p>
          <button class="product__button" data-id="${item.id}" data-name="${
      item.productName
    }" data-price="${item.productPrice}" data-image=${item.imageSrc}>
            <div class="product__button--add">Add to Cart</div>
            <div class="product__button--shop">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
          </button>
        </div>
      </div>
    `;
  });

  attachEventListeners();
};

const attachEventListeners = () => {
  const addProductBtn = document.querySelectorAll(".add__new--product__btn");
  addProductBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      window.open("createProduct.html", "_blank");
    })
  );

  const deleteProductBtn = document.querySelectorAll(".delete");
  deleteProductBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      let attrId = e.target.getAttribute("data-id");
      console.log("Delete Button Clicked, ID:", attrId);
      if (attrId) {
        DeleteApiDataById("data", attrId);
      } else {
        console.error("Failed to get product ID for deletion");
      }
    });
  });

  const addToCartBtns = document.querySelectorAll(".product__button");
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-id");
      const productName = e.currentTarget.getAttribute("data-name");
      const productPrice = e.currentTarget.getAttribute("data-price");
      const productImage = e.currentTarget.getAttribute("data-image");

      console.log("Add to Cart Clicked:", {
        productId,
        productName,
        productPrice,
      });

      if (productId && productName && !isNaN(productPrice)) {
        const product = {
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
        };
        addToCart(product);
        updateCartIcon();
      } else {
        console.error("Failed to get product details for adding to cart");
      }
    });
  });

  const cartIcon = document.getElementById("cartIcon");
  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    openCartModal();
  });

  const modalClose = document.querySelector(".modal .close");
  modalClose.addEventListener("click", (e) => {
    e.preventDefault();
    closeCartModal();
  });

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("cartModal");
    if (event.target == modal) {
      closeCartModal();
    }
  });
};

const openCartModal = () => {
  const modal = document.getElementById("cartModal");
  const cartItemsContainer = document.getElementById("cartItems");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item, index) => {
      cartItemsContainer.innerHTML += `
  <div class="cart-item">
         <img src="${item.image}" alt="Product Image">

     <div class="cart-item__first">
       <div>
          <p>Name: ${item.name}</p>
          <p>Price: $${item.price}</p>
        </div>

        <div>
        <button class="remove-from-cart" data-index="${index}" >Remove</button>
        
        </div>



       </div>
            
    </div>
      `;

      const removeButtons =
        cartItemsContainer.querySelectorAll(".remove-from-cart");
      removeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          removeFromCart(index);
        });
      });
    });
  }

  modal.style.display = "block";
};

const closeCartModal = () => {
  const modal = document.getElementById("cartModal");
  modal.style.display = "none";
};

const removeFromCart = (index) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIcon();
  openCartModal();
};

const updateCartIcon = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.length;
  const cartTotal = cart
    .reduce((total, item) => total + parseFloat(item.price), 0)
    .toFixed(2);

  console.log(cartTotal);

  const cartIcon = document.querySelector(".payment");
  const subTotal = document.querySelector(".cash__total--subtotal");
  cartIcon.innerHTML = `${cartCount} / $${cartTotal}`;
  subTotal.innerHTML = `$${cartTotal}`;
};

document.addEventListener("DOMContentLoaded", updateCartIcon);

getApiDataWithCallBack("data", renderProducts);

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

// const updateProductSrc = document.querySelector("#updateProductSrc");
// const updateProductDiscount = document.querySelector("#updateProductDiscount");
// const updateProductDate = document.querySelector("#updateProductDate");
// const updateProductName = document.querySelector("#updateProductName");
// const updateProductPrice = document.querySelector("#updateProductPrice");
// const updateProductRating = document.querySelector("#updateProductRating");

// const updateProductBtn = document.querySelectorAll(".update__product--btn");
// const updateProductButton = document.querySelector("#updateProductButton");

// updateProductButton &&
//   updateProductButton.addEventListener("click", (e) => {
//     e.preventDefault();

//     const updateProductData = {
//       imageSrc: updateProductSrc.value,
//       productDiscount: updateProductDiscount.value,
//       productDate: updateProductDate.value,
//       productName: updateProductName.value,
//       productPrice: updateProductPrice.value,
//       productRating: updateProductRating.value,
//     };

//     let productId = updateProductBtn.forEach((btn) => {
//       btn.getAttribute("data-set");
//     });

//     updateApiDataById("data", productId, updateProductData);
//   });

/* <button data-set=${
  item?.id
} class="update__product--btn">Update</button> */
