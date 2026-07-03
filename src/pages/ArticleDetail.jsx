import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleById } from '../services/api';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('ID Artikel tidak valid.');
      setLoading(false);
      return;
    }

    fetchArticleById(id)
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Artikel tidak ditemukan atau terjadi kesalahan server.');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="article-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="article-container" style={{ width: '100%', maxWidth: '800px' }}>
        <Link to="/" className="back-btn">← Kembali ke Profile</Link>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Memuat artikel...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            {error}
          </div>
        ) : (
          <article>
            <h1 className="article-title">{article.judul}</h1>
            <div className="article-meta">
              Dipublikasikan pada: {new Date(article.tanggal || article.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="article-content" style={{ whiteSpace: 'pre-wrap' }}>
              {article.isi}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
