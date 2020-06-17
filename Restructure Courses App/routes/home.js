const express = require('express');
const router = express.Router();

//Home URL
router.get('/', (req, res) => {
    res.send('Hello World !!!');
});

module.exports = router;