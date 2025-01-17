// Function to parse URL query parameters
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    name: params.get("name"),
    image: params.get("image"),
    price: params.get("price"),
    description: params.get("description"),
    rating: params.get("rating"),
    colors: params.get("colors") ? params.get("colors").split(",") : [],
  };
}

// Load product details dynamically
document.addEventListener("DOMContentLoaded", function () {
  const product = getQueryParams();

  // Update product image
  document.getElementById("main-image").src = product.image;

  // Update product name
  document.getElementById("product-name").textContent = product.name;

  // Update product brand
  document.getElementById("product-brand").textContent = "Product"; // Set a static brand or retrieve from query params

  // Update product price
  const originalPrice = parseFloat(product.price);
  document.getElementById("product-price").textContent =
    "₹" + originalPrice.toFixed(2);

  // Update product description
  document.getElementById("product-description").textContent =
    product.description;

  // Calculate discount price by adding 40% to the original price
  const discountPercentage = 20; // The percentage to add
  const discountMultiplier = (100 + discountPercentage) / 100;
  const discountPrice = originalPrice * discountMultiplier;

  // Update discount price and discount percentage
  document.getElementById("product-discount-price").textContent =
    "₹" + discountPrice.toFixed(2);
  document.getElementById("discount-off").textContent =
    " " + discountPercentage + "% OFF"; // Updated text for clarity
});

//  populate products

$(document).ready(function () {
  $("a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      var hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });
});

$(".menu-items a").click(function () {
  $("#checkbox").prop("checked", false);
});

fetch("./newArivals.json")
  .then((response) => response.json())
  .then((data) => {
    populateProducts(data.newArrivals, "#new-arrivals .best-seller");
  })
  .catch((error) => console.error("Error:", error));

// Function to populate products in any section (reusable for top sales, new arrivals, etc.)
function populateProducts(products, containerSelector) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = products
    .map(
      (product) => `
            <div class="best-p1">
              <div class="image-container">
                <img src="${product.image}" alt="${product.name}">
                <i class="bi bi-eye eye-icon" data-tooltip="View" onclick="viewProduct('${
                  product.id
                }', '${product.name}', '${product.image}', '${
        product.price
      }', '${product.description}', '${product.rating}')"></i>
              </div>
              <div class="best-p1-txt">
                <div class="name-of-p">
                  <p>${product.name}</p>
                </div>
                <div class="rating">
                  ${getRatingStars(product.rating)}
                </div>
                <div class="price">
                  ₹${product.price}/${product.unit}
                </div>
                <div class="add-to-cart">
                  <button onclick="addToCart(${product.id}, '${
        product.name
      }', ${product.price}, '${product.image}','${
        product.quantity
      }')">Add to Cart</button>
                </div>
              </div>
            </div>`
    )
    .join("");
}

// Helper function to generate star ratings
function getRatingStars(rating) {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars +=
      i < rating
        ? "<i class='bi bi-star-fill'></i>"
        : "<i class='bi bi-star'></i>";
  }
  return stars;
}

// Function to view the product details
function viewProduct(id, name, image, price, description, rating, unit) {
  window.location.href = `singleProduct.html?id=${id}&name=${encodeURIComponent(
    name
  )}&image=${encodeURIComponent(
    image
  )}&price=${price}&description=${encodeURIComponent(
    description
  )}&rating=${rating}&unit=${encodeURIComponent(unit)}`;
}

// Function to add products to the cart
function addToCart() {
  // Get the product details from query parameters
  const product = getQueryParams();

  // Get the current cart from localStorage (if any)
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the product is already in the cart
  const isProductInCart = cart.some((item) => item.id === product.id);

  if (isProductInCart) {
    Swal.fire({
      icon: "error",
      title: "Alert",
      text: "Item already in cart",
    });
  } else {
    // Add new product to the cart
    const newProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1, // Default quantity
    };
    cart.push(newProduct);

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Alert and confirm addition to the cart
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Item added to cart successfully",
    });
  }
}

// Function to update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((count, item) => count + item.quantity, 0);
  document.querySelector("#cart-count").textContent = totalCount;
}

// Function to load cart data on the cart page
function loadCartItems() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-container");

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartContainer.innerHTML = cart
      .map(
        (item) => `
              <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" />
                <p>${item.name}</p>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
              </div>
            `
      )
      .join("");
  }
}
