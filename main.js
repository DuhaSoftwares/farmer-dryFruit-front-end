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
    </div>
  `
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
        <div class="buy-now">
          <button>Buy Now</button>
        </div>
      </div>
    </div>
  `
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
