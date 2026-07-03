const supabase = require('./supabase');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    if (id) {
      // Fetch single article details
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    } else {
      // Fetch all articles
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .order('tanggal', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
