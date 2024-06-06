const axios = require('axios');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (req, res) => {
  try {
    const response = await axios.get('https://comedy-mothership-api.vercel.app/2024-08-30/2024-09-07');

    if (response.data.length > 0) {
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'wilichowskikyle@gmail.com',
          subject: 'New Shows Found',
          text: `New shows found: ${JSON.stringify(response.data)}`,
          html: `<strong>New shows found:</strong><br>${JSON.stringify(response.data, null, 2)}`
      };

      // await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error checking scraper API:', error);
    res.status(500).json({ error: 'Failed to check dates or send email' });
  }
};
