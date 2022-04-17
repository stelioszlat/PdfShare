const express = require('express');

const router = express.Router();

router.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || res.status || 404).json({message: err.message});
});

module.exports = router;