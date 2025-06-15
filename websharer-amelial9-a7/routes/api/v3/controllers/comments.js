import express from 'express';

var router = express.Router();

router.get('/', async (req, res) => {
    try {

        const { postID } = req.query;

        if (!postID) {
            return res.status(400).json({ status: "error", error: "missing post ID" })
        }

        const comments = await req.models.Comment.find({ post: postID });
        res.json(comments);

    } catch (error) {
        console.log("Error getting comments: ", error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {

        if (!req.session || !req.session.isAuthenticated) {
            return res.status(401).json({ status: "error", error: "not logged in" });
        }

        const { postID, newComment } = req.body;

        if (!postID || !newComment) {
            return res.status(400).json({ status: "error", error: "missing post ID or comment" })
        }

        const post = await req.models.Post.findById(postID);

        if (!post) {
            return res.status(401).json({ status: "error", error: "Post not found" });
        }

        const username = req.session.account.username;

        const comment = new req.models.Comment({
            username,
            comment: newComment,
            post: postID,
            created_date: new Date()
        });

        await comment.save()

        res.json({ status: "success" });

    } catch (error) {
        console.log("Error saving comments: ", error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

export default router;