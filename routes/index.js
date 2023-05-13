var express = require('express');
const db = require('../database');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pablo Zerpa,31 786 816, seccion 3' });
});


router.post('/', function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let comment = req.body.comment;
  let date = Date();
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  db.insert(name, email, comment, date, ip);

  res.redirect('/');
});


router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    console.log(rows);
  });
  res.send('ok');
});


module.exports = router;
