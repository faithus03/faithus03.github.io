export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });
  const token = process.env.TESLA_ACCESS_TOKEN;
  const vin = process.env.TESLA_VIN;
  if (!token || !vin) return res.status(503).json({ error: 'Tesla API is not configured' });
  try {
    const url = 'https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/' + encodeURIComponent(vin) + '/vehicle_data?endpoints=drive_state';
    const response = await fetch(url, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status).json({ error: 'Tesla API request failed', detail: body });
    const location = body?.response?.drive_state;
    if (!Number.isFinite(location?.latitude) || !Number.isFinite(location?.longitude)) return res.status(502).json({ error: 'Tesla location unavailable' });
    return res.status(200).json({ latitude: location.latitude, longitude: location.longitude, fetchedAt: new Date().toISOString() });
  } catch (error) {
    return res.status(502).json({ error: 'Tesla API connection failed', detail: String(error?.message || error) });
  }
}
