function displayCartItems() {
  const cartItemsContainer = document.querySelector("#cart-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsIcon = document.querySelector("#cart");

  cartItemsIcon.innerHTML = cart.length;
  const shippingCost = 3.0; // Fixed shipping cost
  let subtotal = 0;

  cartItemsContainer.innerHTML = "";

  // Check if the cart is empty
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<tr><td colspan="6" class="text-center">Your cart is empty</td></tr>';
    updateCartTotals(0, shippingCost);
    return;
  }

  // Loop through the cart items and display them
  cart.forEach((product) => {
    const total = (product.price * product.quantity).toFixed(2);
    subtotal += parseFloat(total);

    const cartRow = `
        <tr>
          <td><img src="${
            product.image
          }" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="${
      product.name
    }"></td>
          <td>${product.name}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>
            <div class="input-group quantity" style="width: 120px;">
              <button class="btn btn-sm btn-minus bg-light border" data-id="${
                product.id
              }"><i class="fa fa-minus"></i></button>
              <input type="text" class="form-control form-control-sm text-center border-0" value="${
                product.quantity
              }" readonly>
              <button class="btn btn-sm btn-plus bg-light border" data-id="${
                product.id
              }"><i class="fa fa-plus"></i></button>
            </div>
          </td>
          <td>$${total}</td>
          <td><button class="btn btn-md rounded-circle bg-light border remove-btn" data-id="${
            product.id
          }">
              <i class="fa fa-times text-danger"></i></button></td>
        </tr>
      `;

    cartItemsContainer.innerHTML += cartRow;
  });

  // Update the cart totals
  updateCartTotals(subtotal, shippingCost);

  // Add event listeners for the plus, minus, and remove buttons
  document.querySelectorAll(".btn-plus").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      updateQuantity(e.target.closest("button").dataset.id, 1)
    );
  });

  document.querySelectorAll(".btn-minus").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      updateQuantity(e.target.closest("button").dataset.id, -1)
    );
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      removeCartItem(e.target.closest("button").dataset.id)
    );
  });
}

function updateCartTotals(subtotal, shipping) {
  const totalCost = (subtotal + shipping).toFixed(2);

  // Update the UI for subtotal and total
  document.querySelector("#cart-subtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.querySelector("#cart-total").textContent = `$${totalCost}`;
}

// On page load, display the cart items
document.addEventListener("DOMContentLoaded", displayCartItems);
function updateQuantity(productId, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = cart.find((item) => item.id === parseInt(productId));

  if (product) {
    product.quantity += delta;

    // Remove the product if quantity is 0 or less
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== product.id);
    }

    // Update the localStorage and refresh the UI
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
  }
}

function removeCartItem(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Remove the product from the cart
  cart = cart.filter((item) => item.id != productId);

  // Update the localStorage and refresh the UI
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
}

// Add event listeners for the plus, minus, and remove buttons after DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
});
function updateCartTotals(subtotal, shipping) {
  const totalCost = (subtotal + shipping).toFixed(2);

  // Update the subtotal and total display
  document.querySelector("#cart-subtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.querySelector("#cart-total").textContent = `$${totalCost}`;
}

// Function to handle the checkout
function handleCheckout() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let orderMessage = "Order Details:\n\n";

  let subtotal = 0;
  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    orderMessage += `${item.name} - $${item.price.toFixed(2)} x ${
      item.quantity
    } = $${itemTotal.toFixed(2)}\n`;
  });

  const shippingCost = 3.0; // Fixed shipping cost
  const total = subtotal + shippingCost;

  orderMessage += `\nSubtotal: $${subtotal.toFixed(2)}\n`;
  orderMessage += `Shipping: $${shippingCost.toFixed(2)}\n`;
  orderMessage += `Total: $${total.toFixed(2)}`;

  const encodedMessage = encodeURIComponent(orderMessage);
  const phoneNumber = "9797970349"; // Replace with your phone number
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Open WhatsApp with the order message
  window.location.href = whatsappURL;
}

// Add event listener to the checkout button
document
  .querySelector(".btn-proceed-checkout")
  .addEventListener("click", handleCheckout);
