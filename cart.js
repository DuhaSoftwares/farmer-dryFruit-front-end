function changeQuantity(id, change) {
  console.log("click");

  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    const quantitySpan = row.querySelector("td:nth-child(4) span");
    const priceCell = row.querySelector("td:nth-child(3)");
    const totalCell = row.querySelector("td:nth-child(5)");

    let quantity = parseInt(quantitySpan.textContent) + change;
    quantity = Math.max(0, quantity);

    if (quantity === 0) {
      removeItem(id);
    } else {
      quantitySpan.textContent = quantity;
      const price = parseFloat(priceCell.textContent.replace("$", ""));
      totalCell.textContent = "$" + (price * quantity).toFixed(2);
      updateTotal();
    }
  }
}

function removeItem(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    row.remove();
    updateTotal();
  }
}

function updateTotal() {
  const totalSpan = document.getElementById("cart-total");
  const totals = Array.from(
    document.querySelectorAll("#cart-items td:nth-child(5)")
  ).map((cell) => parseFloat(cell.textContent.replace("$", "")));
  const total = totals.reduce((sum, value) => sum + value, 0);
  totalSpan.textContent = total.toFixed(2);
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  alert(
    "Proceeding to checkout. Total: $" +
      document.getElementById("cart-total").textContent
  );
});

// Initialize the total
updateTotal();
