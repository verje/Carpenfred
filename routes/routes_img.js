var express = require('express');
var router = express.Router();
const Img = require('../models/fotoSchema');
const Users = require('../models/clientesSchema');
const Proyectos = require('../models/proySchema');
const cloudinary = require('cloudinary');
require('../handlers/cloudinary');
const checkAuthentication = require('../handlers/checkAuth');
const multer_upload = require('../handlers/multer'); 
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var usuarios = null;
var proyectos = null;
//Administracion de Fotos Carpenfred
router.get('/galeria_admin', checkAuthentication, async (req, resp)=>{
	const username = req.user.username_cli;
	const fotos = await Img.find({}).sort({"created_at": -1});
	resp.render("imagenes/galeria_admin.hbs", {fotos});
});

router.get('/galeria_cliente', checkAuthentication, async (req, resp)=>{
	const username = req.user.username_cli;
	const fotos = await Img.find({user: username}).sort({UpdatedAt: 'desc'});
	resp.render("imagenes/galeria_cliente.hbs", {fotos});
});

router.get('/subirfotos', checkAuthentication, async (req, res) =>{
	usuarios = await Users.find({role: 'user'}).sort({date: 'desc'});
	proyectos = await Proyectos.find({}).sort({date: 'desc'});
    res.render("imagenes/subirFoto.hbs", {usuarios, proyectos});
});

router.post('/subirfotos', multer_upload.single('photo'), checkAuthentication, async (req, res) => {
	const errors = [];
	var user = req.body.user;
	var proyect = req.body.proyect;
	var caption = req.body.caption;

    if(user == 'empty'){
		errors.push({text: 'Seleccione un usuario de la lista'});
	}
    if(proyect == 'empty'){
		errors.push({text: 'Seleccione un Proyecto'});
	}
    if(caption.length <= 0){
        errors.push({text: 'La descripción de la foto no puede estar vacia'});
	}

	if(errors.length > 0){
        res.render('imagenes/subirFoto.hbs', {errors, usuarios, proyectos});
    } else {	
		const result = await cloudinary.v2.uploader.upload(req.file.path)
		const new_img = new Img()
			new_img.caption_img = req.body.caption;
			new_img.user = req.body.user;
			new_img.proyect_name = req.body.proyect;
			new_img.imageURL = result.secure_url;
			new_img.InGallery = req.body.inputcheck;
		await new_img.save();
		req.flash('mensaje','Foto subida con éxito.');
		res.redirect('/galeria_admin');
	}	
});

//ruta publica
router.get('/galeria_publica', async (req, resp)=>{
	//const username = req.user.username_cli;
	const fotos = await Img.find({InGallery: 'si'}).sort({UpdatedAt: 'desc'});
	resp.render("imagenes/galeria_publica.hbs", {fotos});
});

//Tratamiento de fotos para Galeria Publica
//Eliminar por completo de la galeria
router.post('/image/delete/:id', checkAuthentication, async (req, res)=>{
	await Img.findByIdAndDelete(req.params.id);
	req.flash('mensaje','Foto eliminada de la base de datos con éxito');
    res.redirect('/galeria_admin');
});

//Editar-Modificar
router.post('/image/in/:id', checkAuthentication, async (req, res)=>{
    const InGallery = 'si'
	await Img.findByIdAndUpdate(req.params.id, {InGallery}, {useFindAndModify: false});
	req.flash('mensaje','La modificación ha sido satisfactoria');
    res.redirect('/galeria_admin');
});
router.post('/image/out/:id', checkAuthentication, async (req, res)=>{
    const InGallery = 'no'
	await Img.findByIdAndUpdate(req.params.id, {InGallery},  {useFindAndModify: false});
	req.flash('mensaje','La modificación ha sido satisfactoria');
    res.redirect('/galeria_admin');
});

module.exports = router;