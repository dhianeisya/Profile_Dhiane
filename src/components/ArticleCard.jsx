import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  return (
    <div className="blog-card">
      <div className="blog-card-header">
        <h3 className="blog-card-title">{article.judul}</h3>
      </div>
      <div className="blog-card-content">
        <p className="blog-card-excerpt">
          {article.isi ? (article.isi.substring(0, 100) + '...') : ''}
        </p>
      </div>
      <div className="blog-card-footer">
        <Link to={`/artikel/${article.id}`} className="blog-card-readmore">
          Baca Selengkapnya →
        </Link>
      </div>
    </div>
  );
}
