var express = require('express');
var router = express.Router();



router.get('/api-login/login', function (req, res, next) {
    res.send("hello");
})


module.exports = router;