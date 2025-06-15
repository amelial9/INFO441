import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here

const escapeHTML = str =>
    String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));  

router.post('/', async (req, res) => {
    try {

        if (!req.session || !req.session.isAuthenticated) {
            return res.status(401).json({ status: "error", error: "not logged in" })
        }

        let { url, description } = req.body;

        let username = escapeHTML(req.session.account.username);

        if (!url || !description || !username) {
          return res.status(400).json({ status: "error", error: "Missing URL, description, or poster name" });
        }

        description = escapeHTML(description);

        const newPost = new req.models.Post({
          url,
          description,
          username,
          created_date: new Date()
        });
    
        await newPost.save();
    
        res.json({ status: "success" });
      } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ status: "error", error: error.message });
      }
});

router.get('/', async (req, res) => {
    try {
        const query = {}

        if (req.query.username) {
            query.username = req.query.username;
        }

        const posts = await req.models.Post.find(query);

        let postData = await Promise.all(
            posts.map(async (post) => {
                try {
                    const preview = await getURLPreview(post.url);
                    return {
                        description: post.description,
                        username: post.username,
                        htmlPreview: preview
                    };
                } catch (error) {
                    return {
                        description: post.description,
                        username: post.username,
                        htmlPreview: `Error generating preview ${error.message}`
                    };
                }
            })
        );
        res.json(postData);
    } catch (error) {
        console.error("Error retrieving posts:", error);
        res.status(500).json({ status: "error", error: error_message });
    }
});

export default router;