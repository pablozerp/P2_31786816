var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pablo Zerpa,31 786 816, seccion 3' });
});

module.exports = router;
