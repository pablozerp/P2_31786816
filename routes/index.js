var express = require('express');
const db = require('../database');
var router = express.Router();

const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
require('dotenv').config()



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pablo Zerpa,31 786 816, seccion 3' });
});


router.post('/', async function(req, res, next) {
  let  name = req.body.name;
  let  email = req.body.email;
  let comment = req.body.comment;
  let date = Date();
  let country;
  try {
    const response = await fetch('https://api.ipify.org/?format=json');
    const data = await response.json();
    ip = data.ip;
    console.log('La dirección IP del usuario es: ' + ip);

    const url = 'http://api.ipstack.com/' + ip + '?access_key=470211dbb6394999a95614fd5799d524';
    const response2 = await fetch(url);
    const data2 = await response2.json();
    country = data2.country_name;
    console.log('El país del usuario es: ' + country);


    enviarMail = async () => {
      const config = {
          host : 'smtp.gmail.com',
          port : 587,
          auth : {
              user : 'm4g1c4l033@gmail.com',
              pass : 'ipwuttxclkvqexeb'
          }
      }
  
      const mensaje = {
          from : 'm4g1c4l033@gmail.com',
          to : 'm4g1c4l033@gmail.com',
          subject : 'correo de pruebas',
          text : ' nombre: ' + name + ' comentario: ' + comment + ' email: ' + email + ' fecha: ' + date + ' la ip: ' + ip + ' el pais es: ' + country
      }
      const transport = nodemailer.createTransport(config);
      const info = await transport.sendMail(mensaje);
      console.log(info);
  } 
  
  enviarMail();

  






    db.insert(name, email, comment, date, ip, country);
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
})

   
























router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    console.log(rows);
  });
  res.send('ok');
});


module.exports = router;
