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
        let { url, description, posterName } = req.body;

        if (!url || !description || !posterName) {
          return res.status(400).json({ status: "error", error: "Missing URL, description, or poster name" });
        }

        description = escapeHTML(description);
        posterName = escapeHTML(posterName);
    
        const newPost = new req.models.Post({
          url,
          description,
          posterName,
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
        const posts = await req.models.Post.find({});

        let postData = await Promise.all(
            posts.map(async (post) => {
                try {
                    const preview = await getURLPreview(post.url);
                    return {
                        description: post.description,
                        posterName: post.posterName,
                        htmlPreview: preview
                    };
                } catch (error) {
                    return {
                        description: post.description,
                        posterName: post.posterName,
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