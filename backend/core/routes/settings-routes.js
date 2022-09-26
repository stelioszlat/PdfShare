const { Router } = require('express');

const Settings = require('../models/settings');

const router = Router();

// /api/settings
router.get('/all', async (req, res, next) => {
    

    try {
        const settings = await Settings.find();

        if (!settings) {
            return res.status(404).json({ message: "Could not find settings."});
        }

        res.status(200).json({ settings });

    } catch (err) {
        return next(err);
    }
});

router.post('/add', async (req, res, next) => {

    const settings = req.body;

    try {

        const result = await Settings.create(settings);

        if (!result) {
            return res.status(400).json({ message: 'Could not create settings'});
        }

        res.status(200).json(settings);
    
    } catch (err) {
        return next(err);
    } 
});

module.exports = router;