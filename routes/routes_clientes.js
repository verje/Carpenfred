var express = require('express');
var router = express.Router();
const passport = require('passport');
const keys = require('../config/keys')
const checkAuthentication = require('../handlers/checkAuth');
//Clientes

router.get('/Clientes', checkAuthentication, function(req, res){
    res.render("Clientes/login.hbs")
});

router.post('/Clientes', passport.authenticate('local' , {
	//successRedirect: '/galeria_cliente',
	failureRedirect: '/login',
	failureFlash: {type: 'error_msg', message: 'Usuario o password incorrecto'},
	successFlash: {type: 'mensaje', message: 'Bienvenido. Su opción de menú personalizado, a la derecha en la esquina superior'}
}), (req, res) => {
	if (req.user.role == keys.app.vrole) {
		res.redirect('/galeria_admin');
	} else {
		res.redirect('/galeria_cliente');
	}
});

router.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});

module.exports = router;