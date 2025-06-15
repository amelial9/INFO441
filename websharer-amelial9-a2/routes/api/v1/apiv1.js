import express from 'express'
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hello world!")
})

router.get('/urls/preview', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send("Missing url in query parameter.");
    }

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch URL");
        }

        const html = await response.text();
        const root = parse(html);

        const metaTags = root.querySelectorAll('meta');
        const og = {};
        
        for (const tag of metaTags) {
            const property = tag.getAttribute('property') || tag.getAttribute('name');
            const content = tag.getAttribute('content');
            if (property && content) {
                if (property === 'og:url') og.url = content;
                if (property === 'og:title') og.title = content;
                if (property === 'og:image') og.image = content;
                if (property === 'og:description') og.description = content;
                if (property === 'og:site_name') og.site_name = content;
                if (property === 'author') og.author = content;
            }
        }
        
        if (!og.url) {
            og.url = targetUrl;
        }
        
        if (!og.title) {
            const titleTag = root.querySelector('title');
            og.title = titleTag ? titleTag.text : targetUrl;
        }
        
        let htmlResponse = `<div style="max-width: 300px; border: solid 1px #ccc; padding: 8px; text-align: center; border-radius: 12px; box-shadow: 2px 2px 6px rgba(0,0,0,0.1);">`;

        htmlResponse += `<a href="${og.url}">`;
        htmlResponse += `<p><strong>${og.title}</strong></p>`;
        
        if (og.image) {
            htmlResponse += `<img src="${og.image}" style="max-height: 200px; max-width: 270px; border-radius: 8px;">`;
        }
        htmlResponse += `</a>`;
        
        if (og.author) {
            htmlResponse += `<p><strong>Author:</strong> ${og.author}</p>`;
        }
        
        if (og.description) {
            htmlResponse += `<p>${og.description}</p>`;
        }
        
        if (og.site_name) {
            htmlResponse += `<p>Source: ${og.site_name}</p>`;
        }
        
        htmlResponse += `</div>`;
        
        res.send(htmlResponse);
    } catch (error) {
        res.status(500).send(`Error retrieving preview: ${error.message}`);
    }
});

export default router;