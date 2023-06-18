let ejs = require('ejs'); 
 var express = require('express');
const db = require('../database');
var router = express.Router();
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
var request = require('request');
const ua = require('universal-analytics');

require('dotenv').config()
const visitor = ua('process.env.UA_GA');
const viss = process.env.VISS
const myToken = process.env.MY_TOKEN

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pablo Zerpa,31 786 816, seccion 3',myToken:myToken,viss:viss });
});

visitor.pageview('/page1').send();
visitor.event('Category', 'Action', 'Label', 42).send();

router.post('/', async function(req, res, next) {
  let  name = req.body.name;
  let  email = req.body.email;
  let comment = req.body.comment;
  let date = Date();
  const geoip = require('geoip-lite')
  let ip = req.headers['x-forwarded-for'] ||  req.socket.remoteAddress;
  const myIP =ip.split(',')[0];
  let geo =geoip.lookup(myIP);
  let country =geo.country
  console.log(geo.country);
  
  try {
    
    


    emailSubmit = async () => {
      const config = {
          host : 'smtp.gmail.com',
          port : 587,
          auth : {
              user : process.env.USER,
    
              pass : process.env.PASS
          }
      }
      
  
      const mensaje = {
          from : process.env.USER,
          to : process.env.TO,
          subject : 'formulario programacion2',
          text : ' nombre: ' + name + ' comentario: ' + comment + ' email: ' + email + ' fecha: ' + date + ' la ip: ' + myIP + ' el pais es: ' + country
      }
      const transport = nodemailer.createTransport(config);
      const info = await transport.sendMail(mensaje);
      
      console.log(info);
  } 
  
  emailSubmit();

  db.insert(name, email, comment, date, myIP, country);
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
})


/*
router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    console.log(rows);
  });
  res.send('ok');
});*/















































const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy


router.use(express.urlencoded({extended:true}));

router.use(cookieParser('mi'));

router.use(session({
    secret:'mi',
    resave:true,
    saveUninitialized:true
}));

router.use(passport.initialize());
router.use(passport.session());




passport.use(new PassportLocal(function(username,password,done){
    if (username === process.env.NOMBRE && password === process.env.CONTRASENA) 
    return done(null,{id:1,name:"cody"})
    done(null,false)
}))

passport.serializeUser(function (user,done) {
 done(null,user.id)   
})

passport.deserializeUser(function (id,done) {
  done(null,{id:1,name:"cody"})  
})
/*
router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    res.render('contactos', { title: 'Registros del formulario', rows: rows,myToken:myToken,viss:viss });
  });
});*/
router.get('/contactos',(req,res,next)=>{
  if(req.isAuthenticated()) return next();

  res.redirect("/login")
},(req, res) => {
  db.select(function (rows) {
    res.render('contactos', { title: 'Registros del formulario',rows: rows,myToken:myToken,viss:viss });
  });
});

router.get("/login",(req,res)=>{
  res.render('login', { title: 'login',myToken:myToken,viss:viss });
})

router.post("/login",passport.authenticate('local',{
  successRedirect:"/contactos",
  failureRedirect:"/login"
}))














































































const ic = process.env.ID_CLIENT2
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID);
async function getEmail(datos) {
  // Verificar el token JWT y obtener la información del usuario
  const ticket = await client.verifyIdToken({
    idToken: datos.credential,
    audience: process.env.CLIENT_ID
  });
  // Obtener un objeto con la información del usuario
  const user = ticket.getPayload();
  // Obtener el email del usuario
  const email = user.email;
  // Devolver el email
  return email;
}
router.post('/logueo', function(req, res, next){
  const datos = req.body;
  // Llamar a la función getEmail() para obtener el email del usuario
  getEmail(datos).then(email => {
    if (email == process.env.EMAIL_GOOGLE) {
      db.select(function (rows) {
        res.render('contactos', { title: 'Registros del formulario',rows: rows,myToken:myToken,viss:viss });
      });
    } else {
      res.status(500).send("Error al verificar el token, No eres un usuario autorizado");
    }
    
  })
})

























module.exports = router;