const supabase = require('./supabase');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle both DELETE and POST for delete
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID artikel diperlukan' });
  }

  try {
    const { data, error } = await supabase
      .from('artikel')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Artikel berhasil dihapus",
      data
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
