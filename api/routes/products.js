const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({ message: 'GET Request is called' });
});
router.post('/', (req, res) => {
    res.status(200).send({ message: 'POST Request is called' });
});

module.exports = router;