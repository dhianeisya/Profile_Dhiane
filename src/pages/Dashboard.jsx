import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchArticles, addArticle, editArticle, deleteArticle } from '../services/api';
import Toast from '../components/Toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [toast, setToast] = useState({ message: '', type: '' });
  
  // Articles CRUD States
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  
  // Skills States
  const [skills, setSkills] = useState([]);

  // Profile Form States
  const [profile, setProfile] = useState({
    fullName: "DHIANE ISYA NAA'IMAH",
    birthDate: "2007-02-11",
    university: "Universitas Nahdlatul Ulama Al Ghozali Cilacap",
    major: "Informatika",
    aboutText: "Saya adalah seorang mahasiswa berusia 19 tahun yang tinggal di Cilacap. Saat ini saya sedang menempuh pendidikan di program studi Informatika di Universitas Nahdlatul Ulama Al Ghozali Cilacap.",
    favoriteFood: "Sop iga",
    favoriteColor: "Biru",
    favoriteFilm: "Drakor",
    favoriteMusic: "K-Pop",
    goals: "1. Lulus dengan nilai terbaik\n2. Get rich\n3. Beli Civic"
  });

  // Settings Form States
  const [settings, setSettings] = useState({
    siteTitle: "Dhiane Profile",
    siteDescription: "Website profile Dhiane Isya Na'imah - Mahasiswa Informatika",
    email: "dhiane@example.com",
    maintenanceMode: "false"
  });

  // Authentication check
  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!loggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Load articles
  const loadArticlesData = async () => {
    setArticlesLoading(true);
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal memuat artikel.', type: 'error' });
    } finally {
      setArticlesLoading(false);
    }
  };

  useEffect(() => {
    loadArticlesData();
  }, []);

  // Load skills
  const loadSkillsData = () => {
    const savedSkills = JSON.parse(localStorage.getItem('skills'));
    if (savedSkills && Array.isArray(savedSkills)) {
      setSkills(savedSkills);
    } else {
      const defaultSkills = [
        { name: 'HTML5', level: 90 },
        { name: 'CSS3', level: 75 },
        { name: 'JavaScript', level: 55 }
      ];
      localStorage.setItem('skills', JSON.stringify(defaultSkills));
      setSkills(defaultSkills);
    }
  };

  useEffect(() => {
    loadSkillsData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    setToast({ message: 'Logout berhasil! Mengalihkan...', type: 'success' });
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Article handlers
  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setToast({ message: 'Judul dan konten tidak boleh kosong.', type: 'error' });
      return;
    }
    try {
      await addArticle(newTitle.trim(), newContent.trim());
      setToast({ message: 'Artikel berhasil ditambahkan!', type: 'success' });
      setNewTitle('');
      setNewContent('');
      setShowAddForm(false);
      loadArticlesData();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal menambahkan artikel.', type: 'error' });
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        await deleteArticle(id);
        setToast({ message: 'Artikel berhasil dihapus!', type: 'success' });
        loadArticlesData();
      } catch (err) {
        console.error(err);
        setToast({ message: 'Gagal menghapus artikel.', type: 'error' });
      }
    }
  };

  const handleEditArticle = async (id) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    const newTitlePrompt = window.prompt("Edit Judul Artikel:", article.judul);
    const newContentPrompt = window.prompt("Edit Isi Artikel:", article.isi);

    if (newTitlePrompt === null || newContentPrompt === null) return;
    if (!newTitlePrompt.trim() || !newContentPrompt.trim()) {
      setToast({ message: 'Judul dan isi tidak boleh kosong.', type: 'error' });
      return;
    }

    try {
      await editArticle(id, newTitlePrompt.trim(), newContentPrompt.trim());
      setToast({ message: 'Artikel berhasil diperbarui!', type: 'success' });
      loadArticlesData();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal memperbarui artikel.', type: 'error' });
    }
  };

  // Profile save
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Profile berhasil disimpan!', type: 'success' });
  };

  // Settings save
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Settings berhasil disimpan!', type: 'success' });
  };

  // Skills handlers
  const handleUpdateSkill = (index, value) => {
    const nextSkills = [...skills];
    nextSkills[index].level = Math.max(0, Math.min(100, parseInt(value) || 0));
    setSkills(nextSkills);
    localStorage.setItem('skills', JSON.stringify(nextSkills));
  };

  const handleDeleteSkill = (index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus skill ini?')) {
      const nextSkills = skills.filter((_, i) => i !== index);
      setSkills(nextSkills);
      localStorage.setItem('skills', JSON.stringify(nextSkills));
      setToast({ message: 'Skill berhasil dihapus!', type: 'success' });
    }
  };

  const handleAddNewSkill = () => {
    const skillName = window.prompt('Nama Skill:');
    if (skillName && skillName.trim()) {
      const nextSkills = [...skills, { name: skillName.trim(), level: 50 }];
      setSkills(nextSkills);
      localStorage.setItem('skills', JSON.stringify(nextSkills));
      setToast({ message: 'Skill baru berhasil ditambahkan!', type: 'success' });
    }
  };

  return (
    <div className="cms-page" style={{ minHeight: '100vh', padding: '20px 0' }}>
      <div className="cms-container">
        <div className="cms-header">
          <h1>Content Management System</h1>
          <div className="cms-nav">
            <span style={{ cursor: 'pointer', color: '#2ea3c9', fontWeight: '600' }} onClick={() => navigate('/')}>
              ← Kembali ke Website
            </span>
            <span style={{ cursor: 'pointer', color: 'red', marginLeft: '20px', fontWeight: '600' }} onClick={handleLogout}>
              Logout
            </span>
          </div>
        </div>

        <div className="cms-grid">
          <div className="cms-sidebar">
            <ul className="cms-menu">
              <li>
                <span 
                  className={activeSection === 'dashboard' ? 'active' : ''} 
                  onClick={() => setActiveSection('dashboard')}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  Dashboard
                </span>
              </li>
              <li>
                <span 
                  className={activeSection === 'profile' ? 'active' : ''} 
                  onClick={() => setActiveSection('profile')}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  Edit Profile
                </span>
              </li>
              <li>
                <span 
                  className={activeSection === 'articles' ? 'active' : ''} 
                  onClick={() => setActiveSection('articles')}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  Articles
                </span>
              </li>
              <li>
                <span 
                  className={activeSection === 'skills' ? 'active' : ''} 
                  onClick={() => setActiveSection('skills')}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  Edit Skills
                </span>
              </li>
              <li>
                <span 
                  className={activeSection === 'projects' ? 'active' : ''} 
                  onClick={() => setActiveSection('projects')}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  Edit Projects
                </span>
              </li>
              <li>
                <span 
                  className={activeSection === 'settings' ? 'active' : ''} 
                  onClick={() => setActiveSection('settings')}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  Settings
                </span>
              </li>
            </ul>
          </div>

          <div className="cms-content">
            {activeSection === 'dashboard' && (
              <div className="cms-section active">
                <h2>Dashboard</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">1,234</div>
                    <div className="stat-label">Total Visitors</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">89</div>
                    <div className="stat-label">Profile Views</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{articles.length}</div>
                    <div className="stat-label">Articles Published</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">95%</div>
                    <div className="stat-label">Uptime</div>
                  </div>
                </div>
                <h3>Recent Activity</h3>
                <div className="alert alert-success">
                  <strong>Success!</strong> Profile dan dashboard berjalan lancar terhubung ke database.
                </div>
                <p style={{ marginTop: '10px' }}>
                  Selamat datang di CMS dashboard Anda. Di sini Anda dapat melakukan manajemen data dan konten website profile Anda.
                </p>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="cms-section active">
                <h2>Edit Profile</h2>
                <form id="profile-form" onSubmit={handleProfileSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="full-name">Nama Lengkap</label>
                      <input 
                        type="text" 
                        id="full-name" 
                        value={profile.fullName} 
                        onChange={e => setProfile({ ...profile, fullName: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="birth-date">Tanggal Lahir</label>
                      <input 
                        type="date" 
                        id="birth-date" 
                        value={profile.birthDate} 
                        onChange={e => setProfile({ ...profile, birthDate: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="university">Universitas</label>
                      <input 
                        type="text" 
                        id="university" 
                        value={profile.university} 
                        onChange={e => setProfile({ ...profile, university: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="major">Jurusan</label>
                      <input 
                        type="text" 
                        id="major" 
                        value={profile.major} 
                        onChange={e => setProfile({ ...profile, major: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="about-text">Tentang Saya</label>
                    <textarea 
                      id="about-text" 
                      rows="6" 
                      value={profile.aboutText} 
                      onChange={e => setProfile({ ...profile, aboutText: e.target.value })} 
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="favorite-food">Makanan Favorit</label>
                      <input 
                        type="text" 
                        id="favorite-food" 
                        value={profile.favoriteFood} 
                        onChange={e => setProfile({ ...profile, favoriteFood: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="favorite-color">Warna Favorit</label>
                      <input 
                        type="text" 
                        id="favorite-color" 
                        value={profile.favoriteColor} 
                        onChange={e => setProfile({ ...profile, favoriteColor: e.target.value })} 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                </form>
              </div>
            )}

            {activeSection === 'articles' && (
              <div className="cms-section active">
                <h2>Manage Articles</h2>
                
                {articlesLoading ? (
                  <p>Memuat daftar artikel...</p>
                ) : articles.length === 0 ? (
                  <p style={{ margin: '20px 0' }}>Belum ada artikel dipublikasikan.</p>
                ) : (
                  <div className="articles-list" style={{ marginBottom: '20px' }}>
                    {articles.map(article => (
                      <div className="article-item" key={article.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                        <h4>{article.judul}</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                          {article.isi ? article.isi.substring(0, 120) + '...' : ''}
                        </p>
                        <div className="article-actions" style={{ marginTop: '10px' }}>
                          <button className="btn btn-secondary" onClick={() => handleEditArticle(article.id)} style={{ marginRight: '10px' }}>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDeleteArticle(article.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!showAddForm ? (
                  <button className="btn btn-success" onClick={() => setShowAddForm(true)}>
                    Tambah Artikel Baru
                  </button>
                ) : (
                  <div id="article-form" style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <h3>Tambah Artikel Baru</h3>
                    <form onSubmit={handleAddArticle}>
                      <div className="form-group">
                        <label htmlFor="article-title">Judul Artikel</label>
                        <input 
                          type="text" 
                          id="article-title" 
                          value={newTitle} 
                          onChange={e => setNewTitle(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="article-content">Konten Lengkap</label>
                        <textarea 
                          id="article-content" 
                          rows="8" 
                          value={newContent} 
                          onChange={e => setNewContent(e.target.value)} 
                          placeholder="Tulis artikel di sini..." 
                          required 
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" className="btn btn-primary">Simpan Artikel</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Batal</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="cms-section active">
                <h2>Edit Skills</h2>
                <div className="skills-editor" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  {skills.map((skill, index) => (
                    <div className="skill-item" key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="text" value={skill.name} className="skill-name" style={{ flex: '2' }} readOnly />
                      <input 
                        type="number" 
                        value={skill.level} 
                        className="skill-level" 
                        style={{ flex: '1' }} 
                        min="0" 
                        max="100" 
                        onChange={e => handleUpdateSkill(index, e.target.value)}
                      />
                      <button className="btn btn-danger" onClick={() => handleDeleteSkill(index)}>Hapus</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-success" style={{ marginTop: '20px' }} onClick={handleAddNewSkill}>
                  Tambah Skill Baru
                </button>
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="cms-section active">
                <h2>Edit Projects</h2>
                <div className="projects-list">
                  <div className="project-item">
                    <h4>Personal Website</h4>
                    <p><strong>Deskripsi:</strong> Website profile pribadi dengan React + Vite</p>
                    <p><strong>Teknologi:</strong> React, Supabase, Vercel Serverless</p>
                    <p><strong>Status:</strong> Completed</p>
                    <div className="project-actions" style={{ marginTop: '10px' }}>
                      <button className="btn btn-secondary" style={{ marginRight: '10px' }} onClick={() => alert('Fitur edit project simulasi')}>Edit</button>
                      <button className="btn btn-danger" onClick={() => alert('Fitur hapus project simulasi')}>Delete</button>
                    </div>
                  </div>
                </div>
                <button className="btn btn-success" style={{ marginTop: '20px' }} onClick={() => alert('Fitur tambah project simulasi')}>Tambah Project Baru</button>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="cms-section active">
                <h2>Settings</h2>
                <form id="settings-form" onSubmit={handleSettingsSubmit}>
                  <div className="form-group">
                    <label htmlFor="site-title">Site Title</label>
                    <input 
                      type="text" 
                      id="site-title" 
                      value={settings.siteTitle} 
                      onChange={e => setSettings({ ...settings, siteTitle: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="site-description">Site Description</label>
                    <textarea 
                      id="site-description" 
                      rows="3" 
                      value={settings.siteDescription} 
                      onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Contact</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={settings.email} 
                      onChange={e => setSettings({ ...settings, email: e.target.value })} 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Simpan Settings</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast.message && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ message: '', type: '' })} 
        />
      )}
    </div>
  );
}
