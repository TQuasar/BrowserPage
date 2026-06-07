const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use((req, res, next) => {
    console.log(`收到请求: ${req.method} ${req.url}`);
    next();
});

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

/*app.get('/translate', async (req, res) => {
    const { word } = req.query;

    const response = await axios.post(`https://fanyi.baidu.com/mtpe-individual/transText?query=${word}&lang=en2zh`);
    const html = response.data;

    const $ = cheerio.load(html);

    const Chinese = $('#trans-selection').children().first().children().first().text();
    res.json({ html });
});*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});