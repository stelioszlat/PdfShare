const { Router } = require('express');

const router = Router();

router.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});

router.use((err, req, res, next) => {
    res.json({ message: err.message });
});

module.exports = router;