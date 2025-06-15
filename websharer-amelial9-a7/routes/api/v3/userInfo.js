import express from 'express';
import models from '../../../models.js';

const router = express.Router();

router.get('/:username', async (req, res) => {
    try {
        console.log('Getting user info for:', req.params.username);
        const userInfo = await models.UserInfo.findOne({ username: req.params.username });
        console.log('Found user info:', userInfo);
        
        if (!userInfo) {
            const newUserInfo = new models.UserInfo({
                username: req.params.username,
                favoriteBobaPlace: '',
                personalWebsite: ''
            });
            await newUserInfo.save();
            console.log('Created new user info:', newUserInfo);
            return res.json(newUserInfo);
        }
        res.json(userInfo);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:username', async (req, res) => {
    try {
        console.log('Updating user info for:', req.params.username);
        console.log('Update data:', req.body);
        
        const { favoriteBobaPlace, personalWebsite } = req.body;
        const userInfo = await models.UserInfo.findOneAndUpdate(
            { username: req.params.username },
            { 
                favoriteBobaPlace,
                personalWebsite,
                lastUpdated: new Date()
            },
            { new: true, upsert: true }
        );
        console.log('Updated user info:', userInfo);
        res.json(userInfo);
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 