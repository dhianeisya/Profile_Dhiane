export async function fetchArticles() {
  const res = await fetch('/api/artikel');
  if (!res.ok) throw new Error('Gagal memuat daftar artikel.');
  return res.json();
}

export async function fetchArticleById(id) {
  const res = await fetch(`/api/artikel?id=${id}`);
  if (!res.ok) throw new Error('Gagal memuat detail artikel.');
  return res.json();
}

export async function addArticle(title, content) {
  const res = await fetch('/api/tambahArtikel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ judul: title, isi: content })
  });
  if (!res.ok) throw new Error('Gagal menambahkan artikel baru.');
  return res.json();
}

export async function editArticle(id, title, content) {
  const res = await fetch(`/api/editArtikel?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ judul: title, isi: content })
  });
  if (!res.ok) throw new Error('Gagal mengedit artikel.');
  return res.json();
}

export async function deleteArticle(id) {
  const res = await fetch(`/api/hapusArtikel?id=${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Gagal menghapus artikel.');
  return res.json();
}

export async function login(username, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Gagal masuk.');
  return res.json();
}
