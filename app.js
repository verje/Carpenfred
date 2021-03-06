const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const sesion = require('express-session');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
var compression = require('compression');
var routes = require('./routes/routes');
var routes_img = require('./routes/routes_img');
var routes_proy = require('./routes/routes_proyectos');
var routes_clientes = require('./routes/routes_clientes');
var routeCorreo = require ('./routes/routeMail');
var app = express();
const helmet = require('helmet')
var keys = require('./config/keys');
require('./database/conexion');
require('dotenv').config();
require('./config/passport');

// all environments
app.use(helmet())
app.set('port', process.env.PORT || 5500);
app.set('views', __dirname + '/views');

const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), ''),
  partialsDir: path.join(app.get('views'), 'Complements'),
  extname:'.hbs',
  helpers: {
    IsAdmin: function(valor, options){
      if (valor==keys.app.vrole){
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/*app.use(sesion({
  secret: process.env.LICENCIA,
  resave: true,
  saveUninitialized: true,
}));*/

app.use(cookieSession({
  name: 'sesion',
  secret: process.env.LICENCIA,
  keys: [keys.sesion.cookieKey],
  maxAge: 1*60*60*1000
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());


//FLASH PARA MOSTRAR MENSAJES
app.use(flash());
app.use((req, res, next) => {
  res.locals.mensaje = req.flash('mensaje');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})
//RUTAS
app.use(compression()); //Compress all routes
app.use(routes);
app.use(routes_img);
app.use(routes_proy);
app.use(routes_clientes);
app.use(routeCorreo);
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Aplicación iniciada en el puerto ' + app.get('port'));
});

module.exports = app;