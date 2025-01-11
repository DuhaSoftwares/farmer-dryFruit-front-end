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

// Fetch data from db.json
// Fetch data from db.json
fetch("./db.json")
  .then((response) => response.json())
  .then((data) => {
    populateCollections(data.collections);
    populateProducts(data.topSales, "#sellers .best-seller");
    populateProducts(data.newArrivals, "#new-arrivals .best-seller");
    populateProducts(data.hotSales, "#hot-sales .best-seller");
  })
  .catch((error) => console.error("Error:", error));

// Function to populate collections section
function populateCollections(collections) {
  const collectionContainer = document.querySelector(
    "#collection .collections"
  );
  collectionContainer.innerHTML = collections
    .map(
      (collection) => `
    <div class="content">
      <img src="${collection.image}" alt="${collection.name}" />
      <div class="img-content">
        <p>${collection.name}</p>
        <button><a href="${collection.link}">SHOP NOW</a></button>
      </div>
    </div>`
    )
    .join("");
}

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
        }', '${product.name}', '${product.image}', '${product.price}', '${
        product.description
      }', '${product.rating}', '${product.colors}')"></i>
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
          <button onclick="addToCart(${product.id}, '${product.name}', ${
        product.price
      }, '${product.image}','${product.quantity}')">Add to Cart</button>
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
function addToCart(id, name, price, image, quantity) {
  // Get the current cart from localStorage (if any)
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the product is already in the cart
  const isProductInCart = cart.some((product) => product.id === id);

  if (isProductInCart) {
    Swal.fire({
      icon: "error",
      title: "Alert",
      text: "Item already in cart",
    });
  } else {
    // Add new product to the cart
    const newProduct = {
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: quantity, // Add quantity key in case you need it
    };
    cart.push(newProduct);

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    //  updateCartCount()
    Swal.fire({
      icon: "success",
      title: "Sucesss",
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
        <p>Price: ₹${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
    `
      )
      .join("");
  }
}

// send to whats app//
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    // Clear previous error messages
    // clearErrors();
    event.preventDefault();
    // Get the values from the input fields
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Validation flags
    let isValid = true;

    // If all validations pass, send the message to WhatsApp
    if (isValid) {
      const whatsappNumber = "7006541433"; // Replace with your WhatsApp number
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nMessage: " + message
      )}`;
      window.open(whatsappURL, "_blank");
    }
  });

