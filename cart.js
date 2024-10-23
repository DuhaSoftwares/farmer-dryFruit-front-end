document.addEventListener("DOMContentLoaded", function () {
  // Fetch cart items from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemsPerPage = 8; // Number of items per page
  let currentPage = 1;

  // Function to populate cart items
  function populateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Clear previous content

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, cart.length);
    const itemsToDisplay = cart.slice(startIndex, endIndex);

    itemsToDisplay.forEach((item) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", item.id);

      row.innerHTML = `
        <td>
          <img src="${item.image}" alt="${item.name}" width="50">
        </td>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
        </td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button onclick="removeItem(${item.id})">Remove</button></td>
      `;
      
      cartItemsContainer.appendChild(row);
    });

    // Update the cart total after populating items
    updateTotal();

    // Render pagination
    renderPagination();
  }

  // Function to change the quantity of an item
  window.changeQuantity = function (id, change) {
    const item = cart.find((item) => item.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change); // Ensure quantity stays >= 1

      // Update the cart in localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Repopulate the cart after changing quantity
      populateCart();
    }
  };

  // Function to remove an item from the cart
  window.removeItem = function (id) {
    const itemIndex = cart.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      cart.splice(itemIndex, 1);

      // Update the cart in localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Repopulate the cart after removing item
      populateCart();
    }
  };

  // Function to update the total cost of the cart
  function updateTotal() {
    const totalSpan = document.getElementById("cart-total");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalSpan.textContent = total.toFixed(2);
  }

  // Function to render pagination
  function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Clear previous pagination

    const totalPages = Math.ceil(cart.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.className = "pagination-btn";
      pageButton.onclick = () => {
        currentPage = i;
        populateCart();
      };
      paginationContainer.appendChild(pageButton);
    }
  }

  // Checkout button click handler
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length > 0) {
      const total = document.getElementById("cart-total").textContent;
      const whatsappNumber = '9541270349';
      const itemDetails = cart.map(item => `${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`).join('\n');
      const message = `Checkout:\n${itemDetails}\nTotal: $${total}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert("Your cart is empty.");
    }
  });

  // Populate the cart on page load
  populateCart();
})
//populate products
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
