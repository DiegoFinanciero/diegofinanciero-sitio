// ── Diego Financiero — Content Loader ──────────────────────────────────────
// Fetches .md files from /content/ folders, parses frontmatter and markdown,
// then renders cards dynamically in the page.
// No build step. No framework. Pure fetch + DOM.

const DFContent = (function() {

// ── Frontmatter parser ──────────────────────────────────────────────────
function parseFrontmatter(text) {
const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
if (!match) return { data: {}, body: text };
const data = {};
match[1].split('\n').forEach(line => {
const m = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
if (m) {
let val = m[2].trim();
if (val === 'true') val = true;
else if (val === 'false') val = false;
else if (!isNaN(val) && val !== '') val = Number(val);
data[m[1]] = val;
}
});
return { data, body: match[2] };
}

// ── Simple markdown → HTML ──────────────────────────────────────────────
function mdToHtml(md) {
if (!md) return '';
return md
.replace(/^### (.+)$/gm, '<h3>$1</h3>')
.replace(/^## (.+)$/gm, '<h2>$1</h2>')
.replace(/^# (.+)$/gm, '<h1>$1</h1>')
.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
.replace(/\*(.+?)\*/g, '<em>$1</em>')
.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
.replace(/^- (.+)$/gm, '<li>$1</li>')
.replace(/(<li>.*<\/li>\n?)+/g, s => '<ul>' + s + '</ul>')
.replace(/\n\n/g, '</p><p>')
.trim();
}

// ── Fetch a single .md file ──────────────────────────────────────────────
async function fetchMd(url) {
const res = await fetch(url + '?t=' + Date.now());
if (!res.ok) throw new Error('Not found: ' + url);
return parseFrontmatter(await res.text());
}

// ── Load all posts from a folder using manifest.json ───────────────────
async function loadCollection(folder) {
try {
const res = await fetch(folder + 'manifest.json?t=' + Date.now());
if (res.ok) {
const files = await res.json();
const posts = await Promise.all(
files.map(f => fetchMd(folder + f).catch(() => null))
);
return posts.filter(Boolean).map(p => ({ ...p.data, _body: p.body })).filter(p => p.publicado !== false);
}
} catch(e) {}
return [];
}

// ── Category labels ──────────────────────────────────────────────────────
const CAT = {
tributacion:'Tributación', finanzas:'Finanzas PYME',
emprendimiento:'Emprendimiento', renta:'Operación Renta',
sii:'SII', tips:'Tips'
};
const TIPO_LABEL = { free:'GRATIS', pro:'PATREON', soon:'PRÓXIMAMENTE' };
const TIPO_CLASS = { free:'free', pro:'pro', soon:'soon' };

// ── Render blog cards ────────────────────────────────────────────────────
function renderBlogCards(posts, limit) {
if (!posts.length) return '<div class="blog-loading">No hay artículos publicados aún.</div>';
const emojis = ['📊','🧾','💰','📈','🏢','💡','📋','⚡'];
return posts.slice(0, limit).map((p, i) => `
<div class="blog-card reveal" onclick="DFContent.openPost('${encodeURIComponent(JSON.stringify(p))}')">
<div class="blog-card-img">
${p.imagen ? '<img src="' + p.imagen + '" alt="' + p.title + '" loading="lazy">' : emojis[i % emojis.length]}
</div>
<div class="blog-card-body">
<span class="blog-cat">${CAT[p.categoria] || p.categoria || 'Blog'}</span>
<h3>${p.title}</h3>
<p>${p.resumen || ''}</p>
<span class="blog-meta">${p.date ? new Date(p.date).toLocaleDateString('es-CL',{year:'numeric',month:'long',day:'numeric'}) : ''}</span>
</div>
</div>
`).join('');
}

// ── Render tool cards ────────────────────────────────────────────────────
function renderToolCards(tools) {
if (!tools.length) return '';
return tools.sort((a,b) => (a.orden||99)-(b.orden||99)).map(t => `
<div class="tool-cell reveal">
<span class="tool-badge ${TIPO_CLASS[t.tipo]||'free'}">${TIPO_LABEL[t.tipo]||'GRATIS'}</span>
<div class="tool-icon-lg">${t.icono || '🔧'}</div>
<h3>${t.title}</h3>
<p>${t.descripcion || ''}</p>
${t.url
? '<a href="' + t.url + '" target="_blank" class="btn-ghost">Abrir →</a>'
: (t.tipo === 'soon'
? '<span style="font-size:.82rem;color:var(--gray);font-weight:600">En desarrollo</span>'
: '<button class="btn-ghost" onclick="DFContent.openTool(\'' + encodeURIComponent(JSON.stringify(t)) + '\')">Usar ahora →</button>'
)
}
</div>
`).join('');
}

// ── Render episode cards ─────────────────────────────────────────────────
function renderEpisodeCards(eps) {
if (!eps.length) return '';
return eps.sort((a,b) => (a.numero||0)-(b.numero||0)).map(e => {
const link = e.youtube || e.spotify || e.apple || '';
const label = e.youtube ? '▶️ Ver en YouTube' : '🎧 Escuchar';
const inner = `
<div class="ep-n">${String(e.numero||'?').padStart(2,'0')}</div>
<div class="ep-info">
<h4>${e.title}</h4>
<p>${e.descripcion || ''}${e.invitado ? ' <em>· ' + e.invitado + '</em>' : ''}</p>
</div>
<div class="ep-meta">
${link ? '<span class="ep-yt">' + label + '</span>' : '<span class="ep-badge">Próximamente</span>'}
${e.duracion || ''}
</div>
`;
return link
? `<a class="ep-card reveal" href="${link}" target="_blank" rel="noopener">${inner}</a>`
: `<div class="ep-card reveal">${inner}</div>`;
}).join('');
}

// ── Open blog post in modal ──────────────────────────────────────────────
function openPost(encoded) {
const p = JSON.parse(decodeURIComponent(encoded));
const modal = document.getElementById('blog-modal');
if (!modal) return;
document.getElementById('modal-title').textContent = p.title;
document.getElementById('modal-cat').textContent = CAT[p.categoria] || p.categoria || '';
document.getElementById('modal-date').textContent = p.date ? new Date(p.date).toLocaleDateString('es-CL',{year:'numeric',month:'long',day:'numeric'}) : '';
document.getElementById('modal-body').innerHTML = '<p>' + mdToHtml(p._body || p.resumen || '') + '</p>';
modal.classList.add('open');
document.body.style.overflow = 'hidden';
}

// ── Open tool in modal ───────────────────────────────────────────────────
function openTool(encoded) {
const t = JSON.parse(decodeURIComponent(encoded));
const modal = document.getElementById('tool-modal');
if (!modal) return;
document.getElementById('tool-modal-icon').textContent = t.icono || '🔧';
document.getElementById('tool-modal-title').textContent = t.title;
document.getElementById('tool-modal-body').innerHTML = '<p>' + mdToHtml(t._body || t.descripcion || '') + '</p>';
modal.classList.add('open');
document.body.style.overflow = 'hidden';
}

// ── Open episode links ───────────────────────────────────────────────────
function openEpisode(encoded) {
const e = JSON.parse(decodeURIComponent(encoded));
if (e.spotify) { window.open(e.spotify, '_blank'); return; }
if (e.apple) { window.open(e.apple, '_blank'); return; }
if (e.youtube) { window.open(e.youtube, '_blank'); return; }
}

function closeModal() {
['blog-modal','tool-modal'].forEach(id => {
const m = document.getElementById(id);
if (m) m.classList.remove('open');
});
document.body.style.overflow = '';
}

// ── Main load functions ──────────────────────────────────────────────────
async function loadBlog(containerId, limit) {
const grid = document.getElementById(containerId);
if (!grid) return;
grid.innerHTML = '<div class="blog-loading"><span class="loading-dots">Cargando artículos</span></div>';
try {
const posts = await loadCollection('/content/blog/');
grid.innerHTML = posts.length
? renderBlogCards(posts, limit || 99)
: '<div class="blog-loading">Próximamente — el blog está en construcción. ¡Vuelve pronto!</div>';
if (typeof initReveal === 'function') initReveal();
} catch(e) {
grid.innerHTML = '<div class="blog-loading">Próximamente — el blog está en construcción.</div>';
}
}

async function loadTools(containerId) {
const grid = document.getElementById(containerId);
if (!grid) return;
try {
const tools = await loadCollection('/content/herramientas/');
if (tools.length) {
grid.innerHTML = renderToolCards(tools);
if (typeof initReveal === 'function') initReveal();
}
} catch(e) { /* keep static fallback */ }
}

async function loadEpisodes(containerId) {
const list = document.getElementById(containerId);
if (!list) return;
try {
const eps = await loadCollection('/content/podcast/');
const published = eps.filter(e => e.publicado !== false);
if (published.length) {
list.innerHTML = renderEpisodeCards(published);
if (typeof initReveal === 'function') initReveal();
}
} catch(e) { /* keep static fallback */ }
}

// ── Init: load all grids automatically on DOMContentLoaded ──────────────
function init() {
loadBlog('blog-grid', 3);
loadBlog('blog-grid-full', 99);
loadTools('tools-grid-dynamic');
loadEpisodes('ep-list-dynamic');
}

document.addEventListener('DOMContentLoaded', init);

return { loadBlog, loadTools, loadEpisodes, openPost, openTool, openEpisode, closeModal, mdToHtml, init };

})();
