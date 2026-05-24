const axios = require('axios');

// Add a customer to Mailchimp list
async function syncMailchimp({ email, name }) {
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) return;
  const [key, dc] = process.env.MAILCHIMP_API_KEY.split('-');
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`;
  await axios.post(url, {
    email_address: email,
    status: 'subscribed',
    merge_fields: { FNAME: name || '' },
  }, {
    auth: { username: 'any', password: process.env.MAILCHIMP_API_KEY },
  }).catch(() => {});
}

module.exports = syncMailchimp;
