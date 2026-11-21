const grid = document.getElementById("pokemon-grid");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("type-filter");
const generationFilter = document.getElementById("generation-filter");
const shinyMode = document.getElementById("shiny-mode");
const favoritesOnlyButton = document.getElementById("favorites-only");
const modal = document.getElementById("pokemon-modal");
const modalContent = document.getElementById("modal-content");

let pokemon = [];
let favorites = new Set(JSON.parse(localStorage.getItem("myRegionFavorites") || "[]"));
let favoritesOnly = false;
let showingShiny = false;

const statNames = [
  ["hp", "HP"], ["attack", "Attack"], ["defense", "Defense"],
  ["spAttack", "Sp. Atk"], ["spDefense", "Sp. Def"], ["speed", "Speed"]
];
const typeNames = ["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"];

async function init() {
  try {
    const response = await fetch("data/pokemon.json");
    if (!response.ok) throw new Error("pokemon.json kon niet worden geladen");
    pokemon = await response.json();
    buildFilters();
    updateCounters();
    render();
  } catch (error) {
    grid.innerHTML = `<p class="info-list">De Pokédex-data kon niet worden geladen. Open de website via GitHub Pages of een lokale webserver, niet rechtstreeks als bestand (file://).</p>`;
    console.error(error);
  }
}

function bst(mon) {
  return Object.values(mon.stats || {}).reduce((sum, value) => sum + Number(value || 0), 0);
}
function padId(id) { return String(id).padStart(3, "0"); }
function buildFilters() {
  const usedTypes = [...new Set(pokemon.flatMap(p => p.types || []))].sort((a,b) => typeNames.indexOf(a)-typeNames.indexOf(b));
  usedTypes.forEach(type => typeFilter.add(new Option(type, type)));
  [...new Set(pokemon.map(p => p.generation))].sort((a,b) => a-b).forEach(gen => generationFilter.add(new Option(`Generatie ${gen}`, gen)));
}
function updateCounters() {
  document.getElementById("total-count").textContent = pokemon.length;
  document.getElementById("header-count").textContent = pokemon.length;
  document.getElementById("favorite-count").textContent = favorites.size;
  document.getElementById("generation-count").textContent = new Set(pokemon.map(p => p.generation)).size;
}
function imageMarkup(mon, className = "") {
  const image = showingShiny && mon.shinyImage ? mon.shinyImage : mon.image;
  if (image) return `<img class="${className}" src="${escapeHTML(image)}" alt="${escapeHTML(mon.name)}" onerror="this.style.display='none';this.nextElementSibling?.classList.remove('hidden')"><div class="mon-placeholder hidden" style="--art:${colorFor(mon.types?.[0])}">${escapeHTML(mon.name.slice(0,1).toUpperCase())}</div>`;
  return `<div class="mon-placeholder" style="--art:${colorFor(mon.types?.[0])}">${escapeHTML(mon.name.slice(0,1).toUpperCase())}</div>`;
}
function colorFor(type) {
  return ({Grass:"#9be7b0",Fire:"#ff9d75",Water:"#8dc9ff",Electric:"#ffe17b",Dark:"#9a91b8",Fairy:"#f4b6dc",Psychic:"#f49ab5",Ice:"#a8e7e8",Dragon:"#a99aff"})[type] || "#b5a4ff";
}
function typePills(types) {
  return (types || []).map(t => `<span class="type-pill type-${escapeHTML(t)}">${escapeHTML(t)}</span>`).join("");
}
function render() {
  const query = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  const gen = generationFilter.value;
  const visible = pokemon.filter(mon => {
    const matchesQuery = !query || mon.name.toLowerCase().includes(query) || String(mon.id).includes(query) || (mon.species || "").toLowerCase().includes(query);
    const matchesType = !type || (mon.types || []).includes(type);
    const matchesGen = !gen || String(mon.generation) === gen;
    const matchesFavorite = !favoritesOnly || favorites.has(mon.id);
    return matchesQuery && matchesType && matchesGen && matchesFavorite;
  });
  document.getElementById("result-count").textContent = `${visible.length} resultaat${visible.length === 1 ? "" : "en"}`;
  document.getElementById("empty-state").classList.toggle("hidden", visible.length > 0);
  grid.innerHTML = visible.map(mon => `
    <article class="pokemon-card" data-id="${mon.id}" tabindex="0" role="button" aria-label="Bekijk ${escapeHTML(mon.name)}">
      <div class="card-top"><span>#${padId(mon.id)} · GEN ${mon.generation}</span>
        <button class="favorite-star ${favorites.has(mon.id) ? "is-favorite" : ""}" data-favorite="${mon.id}" aria-label="Favoriet" title="Favoriet">${favorites.has(mon.id) ? "★" : "☆"}</button>
      </div>
      <div class="mon-art">${imageMarkup(mon)}</div>
      <h3 class="mon-name">${escapeHTML(mon.name)}</h3>
      <div class="card-bottom"><div class="type-list">${typePills(mon.types)}</div><span class="bst">BST <b>${bst(mon)}</b></span></div>
    </article>`).join("");
}
function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  localStorage.setItem("myRegionFavorites", JSON.stringify([...favorites]));
  updateCounters(); render();
}
function openDetails(id) {
  const mon = pokemon.find(p => p.id === id);
  if (!mon) return;
  const statsHTML = statNames.map(([key,label]) => {
    const value = Number(mon.stats?.[key] || 0);
    return `<div class="stat-row"><span>${label}</span><b>${value}</b><div class="stat-track"><div class="stat-fill" style="width:${Math.min(value/255*100,100)}%"></div></div></div>`;
  }).join("");
  const movesHTML = (mon.moves || []).length ? `<table class="move-table"><thead><tr><th>Lv.</th><th>Move</th><th>Type</th><th>Cat.</th><th>Power</th></tr></thead><tbody>${mon.moves.map(m => `<tr><td>${escapeHTML(m.level)}</td><td>${escapeHTML(m.name)}</td><td>${escapeHTML(m.type)}</td><td>${escapeHTML(m.category)}</td><td>${escapeHTML(m.power)}</td></tr>`).join("")}</tbody></table>` : `<p class="info-list">Nog geen moves toegevoegd.</p>`;
  const evo = mon.evolution || {};
  const relatedIds = [...(evo.previous || []), mon.id, ...(evo.next || [])];
  const evoHTML = relatedIds.length > 1 ? `<div class="evo-chain">${relatedIds.map((rid,i) => {
    const related = pokemon.find(p => p.id === rid);
    if (!related) return "";
    return `${i ? '<span class="evo-arrow">→</span>' : ""}<button class="evo-node ${rid === mon.id ? "current" : ""}" data-open-evo="${rid}">#${padId(rid)} ${escapeHTML(related.name)}</button>`;
  }).join("")}</div><p class="info-list">${escapeHTML(evo.method || "")}</p>` : `<p class="info-list">${escapeHTML(evo.method || "Geen evolutiegegevens.")}</p>`;
  modalContent.innerHTML = `
    <div class="detail-head">
      <div class="detail-art">${imageMarkup(mon)}</div>
      <div><div class="detail-number">#${padId(mon.id)} · GENERATIE ${mon.generation}</div><h2 class="detail-title" id="modal-name">${escapeHTML(mon.name)}</h2>
      <div class="type-list">${typePills(mon.types)}</div><p class="detail-species">${escapeHTML(mon.species || "Pokémon")}</p>
      <p class="detail-description">${escapeHTML(mon.description || "Nog geen Pokédex-entry toegevoegd.")}</p></div>
    </div>
    <div class="detail-columns">
      <section><h3>Base stats</h3>${statsHTML}<div class="bst-total"><span>TOTALE BST</span><span>${bst(mon)}</span></div></section>
      <section><h3>Gegevens</h3><div class="info-list">Hoogte: ${escapeHTML(mon.height ?? "—")} m<br>Gewicht: ${escapeHTML(mon.weight ?? "—")} kg<br>Abilities: ${escapeHTML((mon.abilities || []).join(", ") || "—")}<br>Hidden ability: ${escapeHTML(mon.hiddenAbility || "—")}</div><div class="detail-section"><h3>Evolutielijn</h3>${evoHTML}</div></section>
    </div>
    <section class="detail-section"><h3>Level-up moves</h3>${movesHTML}</section>
    <button class="favorite-toggle" id="modal-favorite" style="margin-top:20px">${favorites.has(mon.id) ? "★ Verwijder uit favorieten" : "☆ Voeg toe aan favorieten"}</button>`;
  modalContent.querySelector("#modal-favorite").addEventListener("click", () => { toggleFavorite(mon.id); openDetails(mon.id); });
  modalContent.querySelectorAll("[data-open-evo]").forEach(button => button.addEventListener("click", () => openDetails(Number(button.dataset.openEvo))));
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModal() { modal.classList.add("hidden"); document.body.style.overflow = ""; }
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

searchInput.addEventListener("input", render);
typeFilter.addEventListener("change", render);
generationFilter.addEventListener("change", render);
shinyMode.addEventListener("change", () => { showingShiny = shinyMode.checked; render(); });
favoritesOnlyButton.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  favoritesOnlyButton.setAttribute("aria-pressed", String(favoritesOnly));
  favoritesOnlyButton.textContent = favoritesOnly ? "★ Favorieten tonen" : "♡ Alleen favorieten";
  render();
});
grid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) { event.stopPropagation(); toggleFavorite(Number(favoriteButton.dataset.favorite)); return; }
  const card = event.target.closest("[data-id]");
  if (card) openDetails(Number(card.dataset.id));
});
grid.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".pokemon-card")) {
    event.preventDefault(); openDetails(Number(event.target.dataset.id));
  }
});
document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });
init();
