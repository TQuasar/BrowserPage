const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/fetch-meta', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        const title = $('title').text();
        const icon = $('link[rel$="icon"]').attr('href');
        const description = $('meta[name="description"]').attr('content') || '';

        res.json({ title, icon, description });
    } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).json({ error: 'Failed to fetch URL' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});