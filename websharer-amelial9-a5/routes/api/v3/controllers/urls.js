import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';
import { DESTRUCTION } from 'dns';

//TODO: Add handlers here

router.get('/preview', async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({ status: "error", error: "Missing URL" });
        }
        const htmlPreview = await getURLPreview(url);
        res.send(htmlPreview);

    } catch (error) {
        onsole.error("Error generating URL preview:", error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

export default router;