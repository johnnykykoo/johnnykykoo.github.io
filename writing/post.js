/* ==========================================================================
   Load Markdown posts (static .md files, client-rendered; no build step)
   ========================================================================== */

(function () {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('p') || params.get('post') || '';
  const slug = raw.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    showError('Missing or invalid post. Pick an essay from the home page.');
    return;
  }

  const statusEl = document.getElementById('writing-status');
  const proseEl = document.getElementById('writing-prose');
  const titleEl = document.getElementById('writing-title');
  const metaSlot = document.getElementById('writing-meta');

  if (typeof marked === 'undefined' || !marked.parse) {
    showError('Could not load the text renderer. Check your connection and try again.');
    return;
  }

  marked.setOptions({ gfm: true, headerIds: true });

  fetch(`posts/${encodeURIComponent(slug)}.md`, { credentials: 'same-origin' })
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.text();
    })
    .then((md) => {
      const html = marked.parse(md);
      proseEl.innerHTML = html;

      const h1 = proseEl.querySelector('h1');
      if (h1) {
        const t = h1.textContent.trim();
        titleEl.textContent = t;
        document.title = `${t} — Johnny Koo`;
        h1.remove();
      }

      const meta = proseEl.querySelector('p.writing-post-meta');
      if (meta) {
        metaSlot.textContent = meta.textContent.trim();
        meta.remove();
      } else {
        metaSlot.textContent = '';
      }

      if (statusEl) statusEl.remove();
    })
    .catch(() => {
      showError('This post could not be loaded. The file may be missing or the link is wrong.');
    });

  function showError(msg) {
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.classList.add('is-error');
    }
    if (proseEl) proseEl.innerHTML = '';
    if (titleEl) titleEl.textContent = 'Writing';
    document.title = 'Writing — Johnny Koo';
  }
})();
