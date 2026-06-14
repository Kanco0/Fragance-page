const PRODUCTS = [
  {
    id: "bleu",
    name: "Bleu de Chanel",
    image: "images/blue.png",
    family: "Aromatic / Woody",
    intensity: "Moderate",
    longevity: "6-8 Hours",
    bestUse: "Office / Daily",
    notes: "Lemon, Mint, Ginger, Incense"
  },
  {
    id: "sauvage",
    name: "Dior Sauvage",
    image: "images/dior.png",
    family: "Spicy / Fresh",
    intensity: "Bold",
    longevity: "8+ Hours",
    bestUse: "Night Out / Events",
    notes: "Bergamot, Pepper, Ambroxan"
  },
  {
    id: "aventus",
    name: "Creed Aventus",
    image: "images/creed.png",
    family: "Fruity / Chypre",
    intensity: "Bold",
    longevity: "7-9 Hours",
    bestUse: "Versatile / Formal",
    notes: "Pineapple, Birch, Musk"
  },
  {
    id: "acqua",
    name: "Acqua Di Giò",
    image: "images/acqua.png",
    family: "Aquatic / Fresh",
    intensity: "Light",
    longevity: "4-5 Hours",
    bestUse: "Summer / Day",
    notes: "Sea Notes, Lime, Jasmine"
  }
];

const selected = new Set();

const catalogue = document.getElementById("catalogue");
const compareBar = document.getElementById("compareBar");
const compareCount = document.getElementById("compareCount");
const compareChips = document.getElementById("compareChips");
const compareBtn = document.getElementById("compareBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const dossierTable = document.getElementById("dossierTable");

function renderCatalogue() {
  catalogue.innerHTML = PRODUCTS.map(p => `
    <article class="card" data-id="${p.id}">
      <div class="card-image">
        <img src="${p.image}" alt="${p.name} bottle" loading="lazy">
      </div>
      <div class="card-body">
        <span class="card-family">${p.family}</span>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-notes">${p.notes}</p>
        <div class="card-footer">
          <span class="card-meta">Lasts <strong>${p.longevity}</strong></span>
          <label class="select-toggle">
            <input type="checkbox" data-id="${p.id}" class="select-input">
            <span class="checkbox-box"></span>
            <span class="toggle-label">Compare</span>
          </label>
        </div>
      </div>
    </article>
  `).join("");
}

function toggleSelection(id, checked) {
  if (checked) {
    selected.add(id);
  } else {
    selected.delete(id);
  }

  const card = catalogue.querySelector(`.card[data-id="${id}"]`);
  card.classList.toggle("is-selected", checked);

  updateCompareBar();
}

function updateCompareBar() {
  const count = selected.size;
  compareCount.textContent = count;

  compareChips.innerHTML = [...selected]
    .map(id => {
      const product = PRODUCTS.find(p => p.id === id);
      return `<span class="chip">${product.name}</span>`;
    })
    .join("");

  if (count >= 2) {
    compareBar.classList.add("is-visible");
  } else {
    compareBar.classList.remove("is-visible");
  }
}

function buildDossier() {
  const chosen = PRODUCTS.filter(p => selected.has(p.id));

  const rows = [
    { label: "Scent Family", key: "family" },
    { label: "Intensity", key: "intensity" },
    { label: "Longevity", key: "longevity" },
    { label: "Best Use", key: "bestUse" },
    { label: "Key Notes", key: "notes" }
  ];

  let html = "<thead><tr><th></th>";
  chosen.forEach(p => {
    html += `
      <th class="product-head">
        <div class="product-head-inner">
          <img src="${p.image}" alt="${p.name} bottle">
          <span class="p-name">${p.name}</span>
          <span class="p-family">${p.family}</span>
        </div>
      </th>`;
  });
  html += "</tr></thead><tbody>";

  rows.forEach(row => {
    html += `<tr><th class="row-label">${row.label}</th>`;
    chosen.forEach(p => {
      const isMono = row.key === "longevity" || row.key === "intensity";
      html += `<td class="value">${isMono ? `<span class="mono">${p[row.key]}</span>` : p[row.key]}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody>";
  dossierTable.innerHTML = html;
}

function openModal() {
  buildDossier();
  modalOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

catalogue.addEventListener("change", e => {
  if (e.target.classList.contains("select-input")) {
    toggleSelection(e.target.dataset.id, e.target.checked);
  }
});

compareBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) {
    closeModal();
  }
});

renderCatalogue();