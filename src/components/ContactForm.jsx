import React, { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    country_code: '+62',
    phone: '',
    purpose: 'Pilih Keperluan',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!form.email.includes('@') || !form.email.includes('.')) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let messages = JSON.parse(localStorage.getItem('porto_messages')) || [];
    messages.push({
      name: form.name,
      email: form.email,
      phone: form.country_code + form.phone,
      purpose: form.purpose,
      message: form.message,
      date: new Date().toISOString()
    });
    localStorage.setItem('porto_messages', JSON.stringify(messages));

    setSuccess('Mengalihkan ke WhatsApp...');

    const waNumber = '6285860911022';
    const waText = `Halo Dhiane! Saya ${form.name}.\nEmail: ${form.email}\nNo. HP: ${form.country_code}${form.phone}\nKeperluan: ${form.purpose}\n\nPesan:\n${form.message}`;
    const encodedText = encodeURIComponent(waText);

    setTimeout(() => {
      window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
      setForm({
        name: '',
        email: '',
        country_code: '+62',
        phone: '',
        purpose: 'Pilih Keperluan',
        message: ''
      });
      setSuccess('');
    }, 1000);
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit}>
      <div>
        <input 
          type="text" 
          name="name" 
          placeholder="Nama Anda" 
          value={form.name} 
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span id="err-name" style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
      </div>

      <div>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span id="err-email" style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
      </div>

      <div className="row-grid">
        <div className="phone">
          <span>🇮🇩 
            <select 
              name="country_code" 
              value={form.country_code} 
              onChange={handleChange}
              style={{ width: '60px', border: 'none', background: 'transparent' }}
            >
              <option value="+62">+62</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
          </span>
          <input 
            type="text" 
            name="phone" 
            placeholder="Nomor Telepon" 
            value={form.phone} 
            onChange={handleChange}
          />
        </div>
        <select name="purpose" value={form.purpose} onChange={handleChange}>
          <option value="Pilih Keperluan">Pilih Keperluan</option>
          <option value="Tanya-tanya">Tanya-tanya</option>
          <option value="Kerjasama">Kerjasama</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <textarea 
          name="message" 
          placeholder="Tulis pesan Anda di sini..." 
          value={form.message} 
          onChange={handleChange}
          className={errors.message ? 'error' : ''}
        ></textarea>
        {errors.message && <span id="err-questions" style={{ color: 'red', fontSize: '12px' }}>{errors.message}</span>}
      </div>

      <button type="submit">Kirim</button>
      {success && <span id="form-success" style={{ color: 'green', fontSize: '12px', display: 'block', marginTop: '10px' }}>{success}</span>}
    </form>
  );
}
