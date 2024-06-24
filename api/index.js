const express = require('express');
const axios = require('axios');
const { load } = require('cheerio');

const app = express();
const PORT = 8080;
const website = 'https://comedymothership.com/shows';

async function getEvents() {
  const res = await axios.get(website);
  const html = res.data;
  const $ = load(html);
  const el = $("script#__NEXT_DATA__");
  const siteData = JSON.parse(el.text());
  return siteData.props.pageProps.data.events;
}

app.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});
app.get('/:date', async (req, res) => {
  const events = await getEvents();
  const { date } = req.params;
  const d = new Date(date);
  const match = events.find(event => (new Date(event.start)).getTime() === d.getTime());
  res.json(match);
});
app.get('/:startDate/:endDate', async (req, res) => {
  const events = await getEvents();
  const { startDate, endDate } = req.params;
  const from = new Date(startDate);
  const to = new Date(endDate);
  const eventStartTime = (e) => (new Date(e.start.split('T')[0])).getTime();
  const matches = events.filter(event => (eventStartTime(event) >= from.getTime() && eventStartTime(event) <= to.getTime()));
  res.json(matches);
});

app.listen(PORT, () => console.log(`server is running on PORT:${PORT}`));

module.exports = app;