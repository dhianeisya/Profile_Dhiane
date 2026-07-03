const supabase = require('./supabase');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  try {
    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password }])
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Registrasi berhasil! Silakan login."
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
