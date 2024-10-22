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
});
