const axios = require('axios');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
  try {
    const response = await axios.get(
      'https://your-vercel-deployment-url.vercel.app/scrape'
    );

    if (response.data.length > 0) {
      const msg = {
        to: 'your-email@example.com',
        from: 'your-email@example.com',
        subject: 'New Shows Found',
        text: `New shows found: ${JSON.stringify(response.data)}`,
        html: `<strong>New shows found:</strong><br>${JSON.stringify(
          response.data,
          null,
          2
        )}`,
      };

      await sgMail.send(msg);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error checking scraper API:', error);
    res.status(500).json({ error: 'Failed to check scraper API' });
  }
};
