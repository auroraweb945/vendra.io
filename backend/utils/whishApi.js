const axios = require('axios');

const WHISH_API_BASE = process.env.WHISH_API_BASE_URL;

const whishHeaders = {
  channel: process.env.WHISH_CHANNEL,
  secret: process.env.WHISH_SECRET,
  websiteurl: process.env.WHISH_WEBSITE_URL,
  'Content-Type': 'application/json'
};

exports.createWhishPayment = async ({ amount, userId }) => {
  const payload = {
    amount: amount,
    currency: 'USD',
    invoice: 'Subscription Payment',
    externalId: String(userId),
    successRedirectUrl: `${process.env.WHISH_WEBSITE_URL}/dashboard`,
    failureRedirectUrl: `${process.env.WHISH_WEBSITE_URL}/subscribe-failed`,
    successCallbackUrl: `${process.env.WHISH_WEBSITE_URL}/api/subscribe/verify`,
    failureCallbackUrl: `${process.env.WHISH_WEBSITE_URL}/api/subscribe/verify`
  };

  const res = await axios.post(`${WHISH_API_BASE}/payment/collect`, payload, {
    headers: whishHeaders
  });

  return res.data.data.collectUrl;
};

exports.verifyWhishPayment = async (userId) => {
  const payload = {
    externalId: String(userId),
    currency: 'USD'
  };

  const res = await axios.post(`${WHISH_API_BASE}/payment/collect/status`, payload, {
    headers: whishHeaders
  });

  return res.data.data;
};
