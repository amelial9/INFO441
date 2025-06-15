import express from 'express';

var router = express.Router();

router.get('/myIdentity', (req, res) => {
    if (!req.session || !req.session.isAuthenticated || !req.session.account) {
        return res.json({ status: "loggedout"});
    }

    const { name, username } = req.session.account;
    
    res.json({
        status: "loggedin",
        userInfo: { name, username }
    });
});

export default router;