var express = require('express');
var router = express.Router();
const clientes = require ('../models/clientesSchema');
const keys = require('../config/keys');
const checkAuthentication = require('../handlers/checkAuth');


//Incluir
router.get('/register', checkAuthentication, function(req, res){
	res.render('Operations/registro.hbs')
});
router.post('/register', checkAuthentication, async (req, res)=>{
	const {nameClient, usernameClient, passwordClient, pass2Client, emailClient, telfClient} = req.body;
	const errors = [];
	
    if(nameClient.length <= 0){
        errors.push({text: 'El nombre no puede estar vacio'});
	}
    if(usernameClient.length <= 0){
        errors.push({text: 'El username es obligatorio'});
	}	
	const usuarioCliente = await clientes.findOne({username_cli: usernameClient});
	if(usuarioCliente){
		errors.push({text: 'El username ya está registrado. Asigne otro diferente'});
	}	    
    if(passwordClient != pass2Client){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(passwordClient.length < 6){
        errors.push({text: 'La contraseña debe tener al menos 6 caracteres' });
	}
    if(emailClient.length <= 0){
        errors.push({text: 'Introduzca un correo válido'});
	} 
	const mailCliente = await clientes.findOne({email_cli: emailClient});
	if(mailCliente){
		errors.push({text: 'El correo ya está en uso'});
	}	 
	if(telfClient.length <= 0){
        errors.push({text: 'Numero de Teléfono no es correcto'});
    }   
    if(errors.length > 0){
        res.render('Operations/registro.hbs', {errors, nameClient, usernameClient, passwordClient, pass2Client, emailClient, telfClient});
    } else {
		const cliPassword = req.body.passwordClient;
		const newClient = new clientes();
			newClient.name_cli = req.body.nameClient;
			newClient.username_cli = req.body.usernameClient;
			newClient.password_cli = await newClient.encryptPassword(cliPassword);
			newClient.email_cli = req.body.emailClient;
			newClient.telf_cli = req.body.telfClient;
			newClient.role = 'user';
		await newClient.save(function(err, doc){
			if(err) res.json(err);
			else
			req.flash('mensaje','Cliente creado con éxito');

			var nodeMailer = require('nodemailer');
			let transporter = nodeMailer.createTransport({
				host: keys.mailOptions.vhost,
				port: keys.mailOptions.vport,
				secure: true,
				auth: {
					user: keys.mailOptions.correo,
					pass: keys.mailOptions.clave
				}
			});
		
			var mailOptions = {
				from: 'Carpinteria CarpenFred',
				sender: 'Carpinteria CarpenFred', 
				to: req.body.emailClient,
				subject: 'Usuario y clave para Carpenfred WEB',
				text: 'Correo enviado desde la pagina WEB de Carpenfred',
				html: '<h3>Estimado Cliente</h3>' +
				'<br> <p>Hemos creado su información de acceso a Carpenfred WEB, con la cual podrá hacer seguimiento a su proyecto.</p>' +
				'<br> <p>Ingrese a <a href="http://www.carpenfred.com">Carpenfred.com</a> y coloque lo datos que se le facilitan a continuación:</p>' +   
				'<br><h5> Usuario: ' + req.body.usernameClient +
				'<br> Clave: ' +  req.body.passwordClient +
				'</h5><br> Esperamos que disfrute su experiencia en nuestra pagina WEB. ' +
				'<br><br> Atentamente ' +
				'<br> <h4>Equipo CarpenFred </h4>'
			};
		
			transporter.sendMail(mailOptions, (error, info) => {
				if(error) {
					return console.log(error);
				}
				console.log('Mensaje %s enviado: %s', info.messageId, info.response);
				//resp.render('Complements/index.hbs');
			});

			res.redirect('/consultar');
		});
	}
});

//Consultar
router.get('/consultar', checkAuthentication, async (req, res)=>{
//	const registros = await clientes.find({user: req.user.id}).sort({date: 'desc'});
	const registros = await clientes.find({role:'user'}).sort({date: 'desc'});
	//res.render('Operations/consulta.hbs', {registros});
	res.render('Clientes/ListaClientes.hbs', {registros});
})
//Eliminar
router.get('/eliminar/:id', checkAuthentication, async (req, res)=>{
	const registros = await clientes.findById(req.params.id);
    res.render('Operations/Eliminar.hbs' , {registros});
})

router.post('/eliminar/:id', checkAuthentication, async (req, res)=>{
	await clientes.findByIdAndDelete(req.params.id);
	req.flash('mensaje','Registro eliminado con éxito');
    res.redirect('/consultar');
});

//Editar-Modificar
router.get('/modificar/:id', checkAuthentication, async (req, res)=>{
	const registros = await clientes.findById(req.params.id);
    res.render('Operations/Modificar.hbs' , {registros});
})

router.post('/modificar/:id', checkAuthentication, async (req, res)=>{
    const name_cli = req.body.name
    const username_cli=req.body.username
    const email_cli = req.body.email
	const telf_cli = req.body.telf
	await clientes.findByIdAndUpdate(req.params.id, {$set: {name_cli, username_cli, email_cli, telf_cli}}, {useFindAndModify: false}).exec(function(err){
		if(err) {
			console.log(err);
		}
	})
	req.flash('mensaje','La modificación ha sido satisfactoria');
    res.redirect('/consultar');
});

//Paginas Comunes
router.get('/login', function(req, res){
    res.render("Clientes/login.hbs", {layout: 'main_compact'});
});

router.get('/contact', function(req, res){
    res.render("Complements/contacto.hbs", {layout: 'main_compact'});
});

router.get('/', function(req, res){
    res.render("Complements/index.hbs")
});

module.exports = router;