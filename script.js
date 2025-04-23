let products = [];
let categories = [];

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetch("data.json").then((res) => res.json());
  products = data.products;
  categories = data.categories;

  initFilters();
  render(products);
});

function initFilters() {
  const categorySelect = document.getElementById("categoryFilter");
  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });

  document.getElementById("sort").addEventListener("change", update);
  document.getElementById("categoryFilter").addEventListener("change", update);
  document.getElementById("minPrice").addEventListener("input", update);
  document.getElementById("maxPrice").addEventListener("input", update);
}

function update() {
  const sort = document.getElementById("sort").value;
  const category = document.getElementById("categoryFilter").value;
  const min = parseFloat(document.getElementById("minPrice").value) || 0;
  const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;

  let filtered = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      p.price >= min &&
      p.price <= max
  );

  filtered.sort((a, b) => {
    if (sort === "price") return a.price - b.price;
    if (sort === "rating") return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  render(filtered);
}

function render(data) {
  const container = document.getElementById("productGrid");
  container.innerHTML = "";

  data.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    const picture = document.createElement("picture");

    const sourceMobile = document.createElement("source");
    sourceMobile.media = "(max-width: 599px)";
    sourceMobile.srcset = product.image.mobile;

    const sourceTablet = document.createElement("source");
    sourceTablet.media = "(max-width: 1023px)";
    sourceTablet.srcset = product.image.tablet;

    const sourceDesktop = document.createElement("source");
    sourceDesktop.media = "(min-width: 1024px)";
    sourceDesktop.srcset = product.image.desktop;

    picture.appendChild(sourceMobile);
    picture.appendChild(sourceTablet);
    picture.appendChild(sourceDesktop);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = product.name;
    img.src = product.image.desktop;

    picture.appendChild(img);
    card.appendChild(picture);

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `
      <h3>${product.name}</h3>
      <p class="price">${product.price.toFixed(2)} ₽</p>
      <p>⭐ ${product.rating} / Категория: ${product.category}</p>
    `;

    card.appendChild(body);
    container.appendChild(card);
  });
}
