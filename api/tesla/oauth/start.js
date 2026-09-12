export default function handler(req, res) {
  const redirectURI = 'https://tesla-relay-api.vercel.app/api/tesla/oauth/callback';
  const params = new URLSearchParams({
    client_id: process.env.TESLA_CLIENT_ID,
    redirect_uri: redirectURI,
    response_type: 'code',
    scope: 'openid offline_access vehicle_location',
    state: crypto.randomUUID()
  });
  res.writeHead(302, { Location: 'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/authorize?' + params.toString() });
  res.end();
}
