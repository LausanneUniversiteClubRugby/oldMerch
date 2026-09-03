/* ------------------------------------------------------------------
   LUC Rugby - Stock Merchandising

   Le site lit directement la mise en page du fichier de gestion :
   chaque produit occupe un bloc de deux colonnes, dans lequel

       ligne 1  marque            (ex. "LUC RUGBY")
       ligne 2  nom du produit    (ex. "Polo Homme")
       ligne 4  prix
       ligne 5  en-tetes          ("Quantite"/"Numero" puis "Taille")
       ligne 6+ le stock

   Aucune transformation n'est demandee au club : on analyse la feuille
   telle qu'elle est tenue. Ajouter un produit en respectant ce schema
   suffit pour qu'il apparaisse ici.
   ------------------------------------------------------------------ */

'use strict';

/* ============ Utilitaires ============ */

/** Minuscules, sans accent : sert a comparer des libelles saisis a la main. */
function norm(s) {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/**
 * CSV -> tableau de lignes. Gere les guillemets, car certaines cellules
 * contiennent des virgules (la liste des numeros du sac duffel bag).
 */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
      continue;
    }

    if (c === '"') { quoted = true; }
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') { field += c; }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  return rows.map(r => r.map(v => v.trim()));
}

/** Rend la grille rectangulaire pour pouvoir indexer sans verifier les bornes. */
function rectangular(grid) {
  const w = grid.reduce((m, r) => Math.max(m, r.length), 0);
  return grid.map(r => {
    const out = r.slice();
    while (out.length < w) out.push('');
    return out;
  });
}

/**
 * "3XL (terre)" -> "3XL". Les notes d'etat entre parentheses ne sont pas
 * affichees, et les retirer permet aussi de regrouper correctement les
 * tailles ("2XL" et "2XL (terre)" sont la meme taille).
 */
function cleanSize(raw) {
  return String(raw || '').replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
}

function toNumber(raw) {
  const n = parseFloat(String(raw).replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', 'TU'];

function sizeRank(size) {
  const i = SIZE_ORDER.indexOf(size.toUpperCase());
  if (i !== -1) return i;
  const n = toNumber(size);
  if (n !== null) return 100 + n;      // pointures / tours de tete
  return 900;                          // libelles inattendus, a la fin
}

/* ============ Analyse d'une feuille ============ */

const QTY_HEADERS = ['quantite', 'quantites', 'qte', 'stock'];
const ID_HEADERS  = ['numero', 'numeros', 'n°'];

/**
 * Localise la ligne d'en-tetes ("Quantite" / "Numero"). Normalement la 5e,
 * mais on cherche pour survivre a l'ajout d'une ligne en haut de la feuille.
 */
function findHeaderRow(grid) {
  for (let r = 0; r < Math.min(grid.length, 12); r++) {
    const hit = grid[r].some(c => {
      const n = norm(c);
      return QTY_HEADERS.includes(n) || ID_HEADERS.includes(n);
    });
    if (hit) return r;
  }
  return -1;
}

function parseSheet(grid, source, manifest) {
  grid = rectangular(grid);
  const h = findHeaderRow(grid);
  if (h < 4) return [];   // il faut 4 lignes au-dessus : marque, nom, photo, prix

  const at = (r, c) => (grid[r] && grid[r][c] != null ? grid[r][c] : '');

  // Positions relatives constantes dans le fichier de gestion.
  const brandRow = h - 4, nameRow = h - 3, priceRow = h - 1;
  const products = [];
  const claimed  = new Set();

  for (let c = 0; c < grid[h].length; c++) {
    const head = norm(at(h, c));
    const isQty = QTY_HEADERS.includes(head);
    const isId  = ID_HEADERS.includes(head);
    if (!isQty && !isId) continue;

    const name = at(nameRow, c);
    if (!name) continue;

    claimed.add(c); claimed.add(c + 1);

    const brandRaw = at(brandRow, c);
    const brand    = norm(brandRaw) === 'ok' ? '' : brandRaw;   // "ok" = marque de controle interne
    const price    = toNumber(at(priceRow, c));

    // La 2e colonne du bloc est une taille, sauf pour le sac duffel bag
    // ou elle liste des numeros de sac.
    const secondIsSize = norm(at(h, c + 1)).startsWith('taille');

    const bySize = new Map();
    const notes  = [];
    let loose = 0;

    for (let r = h + 1; r < grid.length; r++) {
      const a = at(r, c).trim();
      const b = at(r, c + 1).trim();
      if (!a && !b) continue;
      if (!a) continue;                       // annotation isolee dans la 2e colonne

      if (!secondIsSize) {
        const q = toNumber(a);
        if (q !== null) loose += q;
        if (b) notes.push(b);
        continue;
      }

      const size = cleanSize(b) || '—';
      if (!bySize.has(size)) bySize.set(size, { size, qty: 0, numbers: [] });
      const slot = bySize.get(size);

      if (isId) {
        // Une ligne = un maillot physique.
        slot.qty += 1;
        slot.numbers.push(/^\d+$/.test(a) ? a : 'sans n°');
      } else {
        const q = toNumber(a);
        slot.qty += (q === null ? 0 : q);
      }
    }

    const sizes = [...bySize.values()].sort((x, y) => sizeRank(x.size) - sizeRank(y.size));
    sizes.forEach(s => s.numbers.sort((x, y) => (toNumber(x) ?? 1e9) - (toNumber(y) ?? 1e9)));

    products.push({
      type: 'stock',
      kind: isId ? 'numbered' : 'quantity',
      category: source.key,
      categoryLabel: source.label,
      name, brand, price,
      sizes,
      total: secondIsSize ? sizes.reduce((t, s) => t + s.qty, 0) : loose,
      note: notes.length ? notes.join(' · ') : '',
      // Quand la 2e colonne n'est pas une taille, son en-tete explique la note.
      noteLabel: notes.length
        ? (norm(at(h, c + 1)).startsWith('numero') ? 'Numéros' : at(h, c + 1))
        : '',
      images: lookupImages(manifest, source.sheet, name)
    });
  }

  // Blocs sans stock : encart "shop en ligne" et equivalents.
  const nameCells = grid[nameRow] || [];
  for (let c = 0; c < nameCells.length; c++) {
    if (claimed.has(c)) continue;
    const name = at(nameRow, c);
    if (!name) continue;

    let url = '';
    for (let r = h - 1; r < grid.length && !url; r++) {
      for (const cell of [at(r, c), at(r, c + 1)]) {
        const m = String(cell).match(/https?:\/\/\S+/);
        if (m) { url = m[0]; break; }
      }
    }
    if (!url) continue;

    products.push({
      type: 'link',
      category: source.key,
      categoryLabel: source.label,
      name,
      subtitle: at(priceRow, c),
      url,
      images: lookupImages(manifest, source.sheet, name)
    });
  }

  return products;
}

function lookupImages(manifest, sheet, name) {
  const bySheet = manifest && manifest[sheet];
  if (!bySheet) return [];
  if (bySheet[name]) return bySheet[name];
  const key = Object.keys(bySheet).find(k => norm(k) === norm(name));
  return key ? bySheet[key] : [];
}

/* ============ Chargement ============ */

/**
 * Google publie l'UTF-8 sans BOM et n'annonce pas toujours le charset.
 * On decode explicitement pour que les accents restent corrects.
 */
async function fetchCSV(url) {
  const res = await fetch(url, { cache: 'no-store', redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const text = new TextDecoder('utf-8').decode(await res.arrayBuffer());
  if (/^\s*</.test(text)) throw new Error('reponse HTML au lieu de CSV');
  return parseCSV(text.replace(/^\uFEFF/, ''));
}

async function loadJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

/* ============ Etat + rendu ============ */

const state = {
  products: [],
  category: 'all',
  query: '',
  hideSoldOut: !!CONFIG.hideSoldOutByDefault
};

const el = {
  grid:    document.getElementById('grid'),
  tabs:    document.getElementById('tabs'),
  toolbar: document.getElementById('toolbar'),
  empty:   document.getElementById('empty'),
  count:   document.getElementById('result-count'),
  status:  document.getElementById('data-status'),
  search:  document.getElementById('search'),
  hide:    document.getElementById('hide-sold-out'),
  howTo:   document.getElementById('how-to-text'),
  lb:      document.getElementById('lightbox'),
  lbImg:   document.getElementById('lightbox-img'),
  lbClose: document.getElementById('lightbox-close')
};

function money(v) {
  return v === null || v === undefined ? '' : `${CONFIG.currency} ${v}.–`;
}

function visibleProducts() {
  const q = norm(state.query);
  return state.products.filter(p => {
    if (state.category !== 'all' && p.category !== state.category) return false;
    if (state.hideSoldOut && p.type === 'stock' && p.total <= 0) return false;
    if (!q) return true;
    const haystack = norm([
      p.name, p.brand, p.categoryLabel,
      ...(p.sizes || []).map(s => s.size)
    ].join(' '));
    return haystack.includes(q);
  });
}

/**
 * Apres un changement de categorie, on remonte en haut de la liste : sinon,
 * sur telephone, on reste bloque au milieu d'une liste devenue plus courte.
 */
function backToTopOfList() {
  if (window.scrollY <= 0) return;
  const top = el.toolbar.offsetTop;
  window.scrollTo({ top, behavior: 'smooth' });
}

function renderTabs() {
  const counts = { all: state.products.length };
  CONFIG.sources.forEach(s => {
    counts[s.key] = state.products.filter(p => p.category === s.key).length;
  });

  const tabs = [{ key: 'all', label: 'Tout' },
                ...CONFIG.sources.map(s => ({ key: s.key, label: s.label }))];

  el.tabs.innerHTML = tabs.map(t => `
    <button class="tab" role="tab" data-key="${t.key}"
            aria-selected="${state.category === t.key}">
      ${escapeHtml(t.label)}<span class="tab-count">${counts[t.key] || 0}</span>
    </button>`).join('');

  el.tabs.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.key;
      renderTabs();
      renderGrid();
      backToTopOfList();
    });
  });
}

function photoHtml(p) {
  const src = p.images && p.images[0];
  if (!src) return `<div class="card-photo no-photo"><span>Photo à venir</span></div>`;
  return `<button class="card-photo" data-full="${escapeHtml(src)}"
                  aria-label="Agrandir la photo de ${escapeHtml(p.name)}">
            <img src="${escapeHtml(src)}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async">
          </button>`;
}

function sizesHtml(p) {
  const sizes = state.hideSoldOut ? p.sizes.filter(s => s.qty > 0) : p.sizes;
  if (!sizes.length) return '';
  return `<ul class="sizes">${sizes.map(s => `
    <li class="size${s.qty <= 0 ? ' is-out' : ''}">
      <b>${escapeHtml(s.size)}</b>
      <span class="qty">${s.qty <= 0 ? 'épuisé' : '× ' + s.qty}</span>
    </li>`).join('')}</ul>`;
}

function numbersHtml(p) {
  const withNumbers = p.sizes.filter(s => s.numbers.length);
  if (p.kind !== 'numbered' || !withNumbers.length) return '';
  return `<details class="numbers">
    <summary>Numéros disponibles</summary>
    <dl>${withNumbers.map(s => `
      <dt>${escapeHtml(s.size)}</dt>
      <dd>n° ${s.numbers.map(escapeHtml).join(', ')}</dd>`).join('')}</dl>
  </details>`;
}

function cardHtml(p) {
  if (p.type === 'link') {
    return `<article class="card is-link">
      ${photoHtml(p)}
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        ${p.subtitle ? `<p class="card-total">${escapeHtml(p.subtitle)}</p>` : ''}
        <a class="card-link" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">
          Voir la boutique
        </a>
      </div>
    </article>`;
  }

  const out = p.total <= 0;
  return `<article class="card">
    ${photoHtml(p)}
    <div class="card-body">
      ${p.brand ? `<span class="card-brand">${escapeHtml(p.brand)}</span>` : ''}
      <div class="card-title-row">
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        ${p.price !== null ? `<span class="card-price">${money(p.price)}</span>` : ''}
      </div>
      <p class="card-total${out ? ' out' : ''}">
        ${out ? 'Épuisé' : p.total + (p.total > 1 ? ' pièces disponibles' : ' pièce disponible')}
      </p>
      ${sizesHtml(p)}
      ${numbersHtml(p)}
      ${p.note ? `<p class="card-note">${
        p.noteLabel ? `<b>${escapeHtml(p.noteLabel)} :</b> ` : ''
      }${escapeHtml(p.note)}</p>` : ''}
    </div>
  </article>`;
}

function renderGrid() {
  const list = visibleProducts();
  el.grid.innerHTML = list.map(cardHtml).join('');
  el.empty.hidden = list.length > 0;

  const pieces = list.reduce((t, p) => t + (p.type === 'stock' ? Math.max(p.total, 0) : 0), 0);
  el.count.textContent = list.length
    ? `${list.length} article${list.length > 1 ? 's' : ''} · ${pieces} pièce${pieces > 1 ? 's' : ''} en stock`
    : '';

  el.grid.querySelectorAll('.card-photo[data-full]').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(btn.dataset.full, btn.querySelector('img').alt));
  });
}

/* ============ Visionneuse ============ */

function openLightbox(src, alt) {
  el.lbImg.src = src;
  el.lbImg.alt = alt || '';
  el.lb.hidden = false;
  el.lbClose.focus();
}
function closeLightbox() { el.lb.hidden = true; el.lbImg.src = ''; }

el.lbClose.addEventListener('click', closeLightbox);
el.lb.addEventListener('click', e => { if (e.target === el.lb) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ============ Demarrage ============ */

function setStatus(text, cls) {
  el.status.textContent = text;
  el.status.className = 'data-status' + (cls ? ' ' + cls : '');
}

async function init() {
  el.howTo.textContent = CONFIG.howToOrder;
  el.hide.setAttribute('aria-pressed', String(state.hideSoldOut));

  el.search.addEventListener('input', () => { state.query = el.search.value; renderGrid(); });
  el.hide.addEventListener('click', () => {
    state.hideSoldOut = !state.hideSoldOut;
    el.hide.setAttribute('aria-pressed', String(state.hideSoldOut));
    renderGrid();
  });

  const manifest = await loadJSON('data/image-manifest.json').catch(() => ({}));
  const snapshot = await loadJSON('data/snapshot.json').catch(() => null);

  const results = await Promise.all(CONFIG.sources.map(async src => {
    try {
      if (!src.url) throw new Error('URL absente');
      return { src, grid: await fetchCSV(src.url), live: true };
    } catch (err) {
      const grid = snapshot && snapshot.sheets && snapshot.sheets[src.sheet];
      console.warn(`[${src.label}] lecture en direct impossible :`, err.message);
      return { src, grid: grid || null, live: false };
    }
  }));

  state.products = results.flatMap(r =>
    r.grid ? parseSheet(r.grid, r.src, manifest) : []);

  const failed = results.filter(r => !r.live);

  if (!state.products.length) {
    setStatus('Stock indisponible pour le moment. Réessayez plus tard.', 'is-error');
  } else if (!failed.length) {
    const t = new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });
    setStatus(`Stock à jour, lu dans le fichier du club à ${t}.`);
  } else {
    const which = failed.map(r => r.src.label).join(', ');
    const when = snapshot && snapshot.generated ? ` (chiffres du ${snapshot.generated})` : '';
    setStatus(`Lecture en direct impossible pour : ${which}. Affichage de la dernière sauvegarde${when}.`, 'is-stale');
  }

  renderTabs();
  renderGrid();
}

init();
