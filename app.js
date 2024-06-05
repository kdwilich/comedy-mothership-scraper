const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const PORT = process.env.PORT || 3000;

const website = 'https://comedymothership.com/shows';

try {
  axios(website).then((res) => {
    const html = res.data;
    const $ = cheerio.load(html);

    const el = $("script#__NEXT_DATA__");
    const siteData = JSON.parse(el.text());
    const events = siteData.props.pageProps.data.events;

    app.get('/', (req, res) => {
      res.json(events);
    });
    app.get('/byDate/:date', (req, res) => {
      const { date } = req.params;
      const d = new Date(date);
      const match = events.find(event => (new Date(event.start)).getTime() === d.getTime());
      res.json(match || 'no matches');
    });
    app.get('/byDate/:startDate/:endDate', (req, res) => {
      const { startDate, endDate } = req.params;
      const from = new Date(startDate);
      const to = new Date(endDate);
      const matches = events.filter(event => ((new Date(event.start)).getTime() >= from.getTime() && (new Date(event.start)).getTime() <= to.getTime()));
      res.json(matches.length ? matches : 'no matches');
    });
  });
} catch (error) {
  console.log(error, error.message);
}

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});