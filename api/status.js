const { kv } = require('@vercel/kv');

// Bir şey daha eklenirse/çıkarılırsa burada da güncelle (id -> varsayılan durum)
const DEFAULT_STATUSES = {
  1: 'completed',
  2: 'completed',
  3: 'completed',
  4: 'completed',
  5: 'completed',
  6: 'in_progress',
  7: 'pending',
  8: 'pending',
  9: 'pending',
  10: 'pending',
  11: 'pending',
  12: 'pending',
  13: 'pending'
};

const VALID_STATUSES = new Set(['pending', 'in_progress', 'completed']);
const STORAGE_KEY = 'organizasyongo_roadmap_phase_statuses';

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const stored = await kv.get(STORAGE_KEY);
      return res.status(200).json(stored || DEFAULT_STATUSES);
    }

    if (req.method === 'POST') {
      const { id, status } = req.body || {};
      if (!id || !VALID_STATUSES.has(status)) {
        return res.status(400).json({ error: 'Geçersiz id veya status' });
      }
      const current = (await kv.get(STORAGE_KEY)) || DEFAULT_STATUSES;
      const updated = { ...current, [id]: status };
      await kv.set(STORAGE_KEY, updated);
      return res.status(200).json(updated);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    return res.status(500).json({ error: 'Sunucu hatası', detail: String(err) });
  }
};