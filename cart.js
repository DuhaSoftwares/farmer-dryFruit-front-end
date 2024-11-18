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

      // Ensure item price is a number
      const price = parseFloat(item.price) || 0;

      row.innerHTML = `
        <td>
          <img src="${item.image}" alt="${item.name}" width="50">
        </td>
        <td>${item.name}</td>
        <td>₹${price.toFixed(2)}</td>
        <td>
          <button class="quantity-btn" onclick="changeQuantity(${
            item.id
          }, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="changeQuantity(${
            item.id
          }, 1)">+</button>
        </td>
        <td>₹${(price * item.quantity).toFixed(2)}</td>
        <td><button onclick="removeItem(${item.id})">Remove</button></td>
      `;

      cartItemsContainer.appendChild(row);
    });

    // Update the cart total after populating items
    updateTotal();
  }

  // Function to change the quantity of an item
  // Function to change the quantity of an item
  window.changeQuantity = function (id, change) {
    const item = cart.find((item) => item.id === id);
    if (item) {
      const currentQuantity = parseInt(item.quantity, 10) || 1;

      // Adjust the quantity and ensure it's not less than 1
      item.quantity = Math.max(1, currentQuantity + change);

      // Log for debugging to see the current quantity before updating localStorage
      // console.log(`Item ID: ${id}, Updated Quantity: ${item.quantity}`);

      // Update the cart in localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Repopulate the cart after changing quantity
      populateCart();
    } else {
      console.error("Item not found in the cart.");
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
    const total = cart.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
      0
    );
    totalSpan.textContent = total.toFixed(2);
  }

  // Checkout button click handler
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length > 0) {
      const total = document.getElementById("cart-total").textContent;
      const whatsappNumber = "7006541433";
      const itemDetails = cart
        .map(
          (item) =>
            `${item.name} (x${item.quantity}): ₹${(
              parseFloat(item.price) * item.quantity
            ).toFixed(2)}`
        )
        .join("\n");
      const message = `Checkout:\n${itemDetails}\nTotal: ₹${total}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

      // Confirm order before redirecting
      Swal.fire({
        title: "Confirm Order",
        text: `\nTotal Amount: ₹${total}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed!",
        cancelButtonText: "No, cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(whatsappUrl, "_blank");
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Alert",
        text: "Your cart is empty.",
      });
    }
  });

  // Populate the cart on page load
  populateCart();
});

// Populate products
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

  $(".menu-items a").click(function () {
    $("#checkbox").prop("checked", false);
  });

  // Fetch data from db.json
  fetch("./newArivals.json")
    .then((response) => response.json())
    .then((data) => {
      populateProducts(data.newArrivals, "#new-arrivals .best-seller");
    })
    .catch((error) => console.error("Error:", error));
});

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
           ₹${parseFloat(product.price).toFixed(2)}/${product.unit}
         
        </div>
        <div class="add-to-cart">
          <button onclick="addToCart(${product.id}, '${
        product.name
      }', ${parseFloat(product.price).toFixed(2)}, '${product.image}','${
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
  )}&image=${encodeURIComponent(image)}&price=${parseFloat(price).toFixed(
    2
  )}&description=${encodeURIComponent(
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
      text: "Item already in the cart.",
    });
  } else {
    // Create a new product object and add it to the cart
    const newProduct = {
      id: id,
      name: name,
      price: parseFloat(price), // Ensure price is a number
      image: image,
      quantity: quantity || 1, // Default quantity to 1 if not provided
    };

    cart.push(newProduct);

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `${name} has been added to your cart!`,
    });
  }
}
