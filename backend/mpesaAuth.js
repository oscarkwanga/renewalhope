const axios = require('axios');

let cachedToken = null;
let expiresAt = 0;

async function getMpesaToken() {
  if (cachedToken && Date.now() < expiresAt) {
    return cachedToken;
  }

  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const basic = Buffer.from(`${key}:${secret}`).toString('base64');

  const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  console.log('[mpesaAuth] Requesting token from:', url);

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Basic ${basic}` }
    });
    const data = response.data;
    cachedToken = data.access_token;
    expiresAt = Date.now() + (data.expires_in - 300) * 1000;
    console.log('[mpesaAuth] Received token:', cachedToken);
    return cachedToken;
  } catch (err) {
    console.error('[mpesaAuth] Error fetching token:', err.response?.data || err.message);
    throw new Error('Failed to fetch M-Pesa token');
  }
}

module.exports = { getMpesaToken };