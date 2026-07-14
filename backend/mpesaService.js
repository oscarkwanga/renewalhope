const axios = require('axios');
const moment = require('moment');
const Transaction = require('./models/Transaction');
const { getMpesaToken } = require('./mpesaAuth');
const {getSocket}  = require('./socket'); 
const Users = require('./models/User');
 


 


async function lipaNaMpesa({ phone, amount, reference, description, tenant, property }){
  console.log('[mpesaService] Starting STK Push for', phone, amount, reference,tenant,property);

  let token;
  try {
    token = await getMpesaToken();
  } catch (err) {
    console.error('[mpesaService] Token error:', err.message);
    throw new Error('Unable to obtain access token');
  }

  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerBuyGoodsOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_TILL,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: reference,
    TransactionDesc: description,
  };

  const stkURL = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  console.log('[mpesaService] POST to STK URL:', stkURL);

  try {
    const response = await axios.post(stkURL, payload, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000
    });
    const data = response.data;
    console.log('[mpesaService] STK Push response:', data);

    if (!data.CheckoutRequestID) {
      console.error('[mpesaService] No CheckoutRequestID in response:', data);
      throw new Error(`STK Push failed: ${data.errorCode || 'NoID'} - ${data.errorMessage || 'No errorMessage'}`);
    }

    const transact= new Transaction({ 
      phone,
      amount,
      reference,
      checkoutRequestID: data.CheckoutRequestID,
      merchantRequestID: data.MerchantRequestID,
      status: 'PENDING',
       tenant,
    property
    });
    await transact.save();
 
    
           
    
            // Emit Socket.IO event
               const io=getSocket();
    io.emit('newtransaction',transact)    


    return data;
  } catch (err) {
    console.error('[mpesaService] STK Push request error:', err.response?.data || err.message);
    throw new Error('M-Pesa STK Push request failed');
  }
}


module.exports = { lipaNaMpesa };