export default async function handler(req, res) {
  const code = req.query?.code;
  if (!code) return res.status(400).send('Missing authorization code');
  const redirectURI = 'https://tesla-relay-api.vercel.app/api/tesla/oauth/callback';
  const body = new URLSearchParams({ grant_type: 'authorization_code', client_id: process.env.TESLA_CLIENT_ID, client_secret: process.env.TESLA_CLIENT_SECRET, code, redirect_uri: redirectURI });
  const tokenResponse = await fetch('https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const tokens = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok) return res.status(502).json({ error: 'Tesla token exchange failed', detail: tokens });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send('<h2>Tesla 인증 완료</h2><p>Access Token을 Vercel 환경변수 TESLA_ACCESS_TOKEN에 저장하세요. 이 페이지를 공유하지 마세요.</p><pre>' + JSON.stringify(tokens, null, 2).replaceAll('&', '&amp;').replaceAll('<', '&lt;') + '</pre>');
}
