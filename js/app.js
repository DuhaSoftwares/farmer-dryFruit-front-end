let tab1 = document.getElementById("tab-1").addEventListener("click", () => {
  fetchProducts("api/products/dryFruits.json");
});
let tab2 = document.getElementById("tab-2").addEventListener("click", () => {
  fetchProducts("api/products/spices.json");
});
let tab3 = document.getElementById("tab-3").addEventListener("click", () => {
  fetchProducts("api/products/honey.json");
});
let tab4 = document.getElementById("tab-4").addEventListener("click", () => {
  fetchProducts("api/products/oils.json");
});
let tab5 = document.getElementById("tab-5").addEventListener("click", () => {
  fetchProducts("api/products/beautyProducts.json");
});
let tabAll = document
  .getElementById("tab-all")
  .addEventListener("click", () => {
    fetchAllProducts([
      "api/products/spices.json",
      "api/products/dryFruits.json",
      "api/products/beautyProducts.json",
      "api/products/oils.json",
      "api/products/honey.json",
    ]);
  });

async function fetchProducts(apiPath) {
  try {
    const response = await fetch(apiPath);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

async function fetchAllProducts(apiPaths) {
  try {
    // Fetch all the URLs in parallel
    const responses = await Promise.all(apiPaths.map((path) => fetch(path)));

    // Check if any response is not ok
    responses.forEach((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok for ${response.url}`);
      }
    });

    // Convert all responses to JSON
    const productsArray = await Promise.all(
      responses.map((response) => response.json())
    );

    // Combine all product arrays into one array
    const allProducts = productsArray.flat();

    // Display the combined products
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts(products) {
  const productContainer = document.querySelector("#product-list");
  const template = document.querySelector("#product-template").content;
  productContainer.innerHTML = "";
  products.forEach((product) => {
    // Clone the template content
    const productElement = template.cloneNode(true);

    // Set the product details
    productElement.querySelector(".product-image").src = product.image;
    productElement.querySelector(".product-image").alt = product.name;
    productElement.querySelector(".product-name").textContent = product.name;
    productElement.querySelector(".product-description").textContent =
      product.description;
    productElement.querySelector(
      ".product-price"
    ).textContent = `₹${product.price.toFixed(2)}`;
    const addToCartBtn = productElement.querySelector(".add-to-cart");
    addToCartBtn.setAttribute("data-id", product.id);

    // Append to the container
    productContainer.appendChild(productElement);

    // Add event listener for Add to Cart
    addToCartBtn.addEventListener("click", () => addToCart(product));
  });
}

function addToCart(product) {
  try {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      // If the product is already in the cart, increase the quantity
      existingProduct.quantity += 1;
    } else {
      // If not, add the product with a quantity of 1
      product.quantity = 1;
      cart.push(product);
    }

    // Try saving the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // If successful, fire Swal
    Swal.fire({
      title: "Good job!",
      text: `${product.name} added to cart!`,
      icon: "success",
    });
    getCartProductsLength();
  } catch (error) {
    // If there's an error, handle it (optional)
    console.error("Error adding to cart:", error);

    // You can also show an error message to the user if needed
    Swal.fire({
      title: "Error!",
      text: "There was an issue adding the product to the cart.",
      icon: "error",
    });
  }
}

// Call the fetchProducts function to display the products
fetchAllProducts([
  "api/products/spices.json",
  "api/products/dryFruits.json",
  "api/products/beautyProducts.json",
  "api/products/oils.json",
  "api/products/honey.json",
]);

/**
 * Retrieves the number of products in the shopping cart and updates the cart icon.
 *
 * @function getCartProductsLength
 * @returns {void}
 *
 * @description
 * This function retrieves the products from the local storage, calculates the total number of products,
 * and updates the HTML content of the cart icon with the product count.
 *
 * @example
 * getCartProductsLength();
 *
 * @author YourName
 * @since 1.0.0
 */
function getCartProductsLength() {
  const cartItemsIcon = document.querySelector("#cart");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsIcon.innerHTML = cart.length;
}

getCartProductsLength();
