async function fetchProducts() {
    try {
      const response = await fetch('api/products/categoryOne.json');
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  
  function displayProducts(products) {
    const productContainer = document.querySelector("#product-list");
    const template = document.querySelector("#product-template").content;
  
    products.forEach(product => {
      // Clone the template content
      const productElement = template.cloneNode(true);
  
      // Set the product details
      productElement.querySelector('.product-image').src = product.image;
      productElement.querySelector('.product-image').alt = product.name;
      productElement.querySelector('.product-name').textContent = product.name;
      productElement.querySelector('.product-description').textContent = product.description;
      productElement.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
      const addToCartBtn = productElement.querySelector('.add-to-cart');
      addToCartBtn.setAttribute('data-id', product.id);
  
      // Append to the container
      productContainer.appendChild(productElement);
  
      // Add event listener for Add to Cart
      addToCartBtn.addEventListener('click', () => addToCart(product));
    });
  }
  
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
      // If the product is already in the cart, increase the quantity
      existingProduct.quantity += 1;
    } else {
      // If not, add the product with a quantity of 1
      product.quantity = 1;
      cart.push(product);
    }
  
    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    alert(`${product.name} added to cart!`);
  }
  
  // Call the fetchProducts function to display the products
  fetchProducts();
  