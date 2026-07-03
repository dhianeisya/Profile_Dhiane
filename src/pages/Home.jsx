import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import ContactForm from '../components/ContactForm';

export default function Home() {
  const location = useLocation();
  const [greeting, setGreeting] = useState('');
  const [roleText, setRoleText] = useState('');
  const [age, setAge] = useState(19);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skills, setSkills] = useState([]);

  // Greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour <= 11) {
      setGreeting('Selamat Pagi');
    } else if (hour >= 12 && hour <= 16) {
      setGreeting('Selamat Siang');
    } else if (hour >= 17 && hour <= 20) {
      setGreeting('Selamat Sore');
    } else {
      setGreeting('Selamat Malam');
    }
  }, []);

  // Typing effect logic
  useEffect(() => {
    const roles = ["Mahasiswa", "Web Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer;

    const tick = () => {
      const current = roles[roleIndex];
      const text = current.slice(0, charIndex);
      setRoleText(text);

      if (!isDeleting) {
        charIndex++;
        if (charIndex > current.length) {
          isDeleting = true;
          timer = setTimeout(tick, 1500);
        } else {
          timer = setTimeout(tick, 100);
        }
      } else {
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          timer = setTimeout(tick, 100);
        } else {
          timer = setTimeout(tick, 50);
        }
      }
    };

    tick();
    return () => clearTimeout(timer);
  }, []);

  // Age calculation
  useEffect(() => {
    const birthdate = new Date("2007-02-11");
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  }, []);

  // Scroll to section based on navigation state
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        // Clear route state to prevent auto-scrolling on reload
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  // Load articles
  useEffect(() => {
    fetchArticles()
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Gagal memuat artikel.');
        setLoading(false);
      });
  }, []);

  // Load skills
  useEffect(() => {
    const savedSkills = JSON.parse(localStorage.getItem('skills'));
    if (savedSkills && Array.isArray(savedSkills) && savedSkills.length > 0) {
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
  }, []);

  return (
    <div>
      <section id="home" className="hero" style={{ marginTop: '60px' }}>
        <div className="overlay"></div>
        <div className="hero-text">
          <h2>{greeting} di Website Saya</h2>
          <p>Mahasiswa Informatika 4A | Web Pemrograman</p>
        </div>
      </section>

      <main>
        <section id="about" className="profile">
          <img src="/foto.jpeg" alt="Foto Profil" />
          <div className="profile-text">
            <h2 className="nama">
              DHIANE ISYA NAA'IMAH <span>{roleText}|</span>
            </h2>
            <p>
              Saya adalah seorang mahasiswa berusia <strong>{age} tahun</strong> yang tinggal di Cilacap.<br />
              Saat ini saya sedang menempuh pendidikan di program studi Informatika di Universitas Nahdlatul Ulama
              Al Ghozali Cilacap.
            </p>
          </div>
        </section>

        <section>
          <h2>Tentang Saya</h2>
          <p>
            Saya termasuk orang yang cukup <strong>rajin</strong> dan suka belajar hal baru.<br />
            Tetapi, saya lebih nyaman untuk fokus mendalami hal yang sudah saya pelajari, terutama yang memang saya
            <em> sukai</em>.
          </p>
          <br />
          <p><strong>MY TOP 3 GOALS</strong></p>
          <ol>
            <li>Lulus dengan nilai terbaik</li>
            <li>Get rich </li>
            <li>Beli Civic </li>
          </ol>

          <p><strong>FAVORITE THINGS</strong></p>
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Favorit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Makanan</td>
                <td>Sop iga</td>
              </tr>
              <tr>
                <td>Warna</td>
                <td>Biru</td>
              </tr>
              <tr>
                <td>Film</td>
                <td>Drakor</td>
              </tr>
              <tr>
                <td>Musik</td>
                <td>K-Pop</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="articles">
          <h2>ARTIKEL</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Memuat artikel...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
              {error}
            </div>
          ) : articles.length === 0 ? (
            <div id="no-articles" style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              Belum ada artikel yang dipublikasikan.
            </div>
          ) : (
            <div className="blog-grid" id="blog-grid">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        <section id="skills">
          <h2>SKILLS</h2>
          <div className="skills-grid" id="skills-grid">
            {skills.map((skill, index) => (
              <div className="skill-item" data-level={skill.level} key={index}>
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-pct">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className={`skill-fill ${index % 2 !== 0 ? 'secondary' : ''}`} 
                    style={{ width: `${skill.level}%`, transition: 'width 1s ease-in-out' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="form-card">
            <h2>Hubungi Saya</h2>
            <p>Isi formulir ini dan saya akan menghubungi Anda dalam 24 jam</p>
            <ContactForm />
          </div>
        </section>
      </main>
    </div>
  );
}
