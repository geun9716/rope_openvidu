var express = require('express');
var router = express.Router();



 router.get('/', function (req, res, next) {
    res.end('hello');
}) 

module.exports = router;