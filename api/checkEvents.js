const axios = require('axios');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, //ssl
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (req, res) => {
  try {
    const dateRange = '2024-08-30/2024-09-02';
    const response = await axios.get('https://comedy-mothership-api.vercel.app/' + dateRange);

    if (response.data.length > 0) {
      const mailOptions = {
          from: process.env.EMAIL_ADDRESS,
          to: ['wilichowskikyle@gmail.com','biskerton07@gmail.com'],
          subject: `New shows found for ${dateRange.replace('/', ' to ')}`,
          text: `New shows found for ${dateRange.replace('/', ' to ')}`,
          html: `<h2>New shows found:</h2>${response.data.map(event => `<h3>${event.title}</h3><h5>Date: ${event.start.split('T')[0]}</h5><a href="${event.url}">Buy here</a><hr><br>`).join('\n')}`
      };

      await transporter.sendMail(mailOptions).then(console.log);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error checking events or sending email:', error);
    res.status(500).json({ error: 'Failed to check events or send email' });
  }
};
