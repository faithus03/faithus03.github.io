export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  try {
    const tokenBody = new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.TESLA_CLIENT_ID, client_secret: process.env.TESLA_CLIENT_SECRET, audience: 'https://fleet-api.prd.na.vn.cloud.tesla.com', scope: 'openid vehicle_device_data vehicle_location' });
    const tokenResponse = await fetch('https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: tokenBody });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok) return res.status(502).json({ error: 'partner token failed', detail: token });
    const registration = await fetch('https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/partner_accounts', { method: 'POST', headers: { Authorization: 'Bearer ' + token.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify({ domain: 'faithus03.github.io' }) });
    const result = await registration.json().catch(() => ({}));
    return res.status(registration.ok ? 200 : registration.status).json(result);
  } catch (error) { return res.status(502).json({ error: 'registration failed', detail: String(error?.message || error) }); }
}
