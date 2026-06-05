const Router = require('express');
const { extract, uploader } = require('../util/extract-util');

const router = Router();

router.post('/upload', uploader.single('file'), extract);
router.get('/download', (req, res, next) => {
    return next();
});

module.exports = router;