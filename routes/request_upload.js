var express = require('express');
var router = express.Router();




router.get('/:token', function (req, res, next) {
    var deviceToken = req.params.token;


});

module.exports = router;