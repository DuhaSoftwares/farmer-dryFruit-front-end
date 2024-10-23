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
fetch("../json/db.json")
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
  const collectionContainer = document.querySelector("#collection .collections");
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
      }', '${product.rating}', '${product.colors.join(",")}')"></i>
      </div>
      <div class="best-p1-txt">
        <div class="name-of-p">
          <p>${product.name}</p>
        </div>
        <div class="rating">
          ${getRatingStars(product.rating)}
        </div>
        <div class="price">
          &dollar;${product.price}
          <div class="colors">
            ${product.colors
              .map(
                (color) =>
                  `<i class='bi bi-circle-fill' style='color:${color}'></i>`
              )
              .join("")}
          </div>
        </div>
        <div class="add-to-cart">
          <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}','${product.quantity}')">Add to Cart</button>
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
function viewProduct(id, name, image, price, description, rating, colors) {
  window.location.href = `singleProduct.html?id=${id}&name=${encodeURIComponent(
    name
  )}&image=${encodeURIComponent(
    image
  )}&price=${price}&description=${encodeURIComponent(
    description
  )}&rating=${rating}&colors=${encodeURIComponent(colors)}`;
}

// Function to add products to the cart
function addToCart(id, name, price, image,quantity) {
  // Get the current cart from localStorage (if any)
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the product is already in the cart
  const isProductInCart = cart.some((product) => product.id === id);

  if (isProductInCart) {
    alert("Item already added to the cart.");
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
    // Alert and confirm addition to the cart
    alert("Item added to the cart successfully.");
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
    cartContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <p>${item.name}</p>
        <p>Price: $${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
    `).join("");
  }
}

// send to whats app//
document.getElementById('sendBtn').addEventListener('click', function() {
    // Clear previous error messages
    clearErrors();

    // Get the values from the input fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Validation flags
    let isValid = true;

    // Validate name (minimum 3 characters)
    if (name.length < 3) {
        document.getElementById('nameError').textContent = 'Name must be at least 3 characters long.';
        isValid = false;
    }

    // Validate email using a basic regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate message (non-empty)
    if (message.trim() === '') {
        document.getElementById('messageError').textContent = 'Message cannot be empty.';
        isValid = false;
    }

    // If all validations pass, send the message to WhatsApp
    if (isValid) {
        const whatsappNumber = '9541270349'; // Replace with your WhatsApp number
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            'Name: ' + name + '\nEmail: ' + email + '\nMessage: ' + message
        )}`;
        window.open(whatsappURL, '_blank');
    }
});

// Function to clear error messages dynamically when the user types
function clearErrors() {
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';
}

// Event listeners to clear individual errors when the input is corrected
document.getElementById('name').addEventListener('input', function() {
    if (this.value.length >= 3) {
        document.getElementById('nameError').textContent = '';
    }
});

document.getElementById('email').addEventListener('input', function() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(this.value)) {
        document.getElementById('emailError').textContent = '';
    }
});

document.getElementById('message').addEventListener('input', function() {
    if (this.value.trim() !== '') {
        document.getElementById('messageError').textContent = '';
    }
});


