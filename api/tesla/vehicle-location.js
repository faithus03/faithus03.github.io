export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });
  const token = process.env.TESLA_ACCESS_TOKEN;
  const vin = process.env.TESLA_VIN;
  if (!token || !vin) return res.status(503).json({ error: 'Tesla API is not configured' });
  const response = await fetch('https://fleet-api.prd.eu.trafficmanager.net/api/1/vehicles/' + encodeURIComponent(vin) + '/vehicle_data', { headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) return res.status(response.status).json({ error: 'Tesla API request failed', detail: body });
  const location = body?.response?.drive_state;
  if (!Number.isFinite(location?.latitude) || !Number.isFinite(location?.longitude)) return res.status(502).json({ error: 'Tesla location unavailable' });
  return res.status(200).json({ latitude: location.latitude, longitude: location.longitude, fetchedAt: new Date().toISOString() });
}
