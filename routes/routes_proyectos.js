var express = require('express');
var router = express.Router();
const proyecto = require ('../models/proySchema');
const Users = require ('../models/clientesSchema');
const checkAuthentication = require('../handlers/checkAuth');
//Incluir
var usuarios = null;
router.get('/proyectos/incluir', checkAuthentication, async (req, res)=>{
    usuarios = await Users.find({role: 'user'}).sort({date: 'desc'});
    res.render("proyectos/registroProy.hbs", {usuarios});
});
router.post('/proyectos/incluir', checkAuthentication, function(req, res){
	const errors = [];
	const {nombre_proy, cliente_proy} = req.body;
	var cliente = req.body.cliente_proy;

    if(nombre_proy.length <= 0){
        errors.push({text: 'Escriba un nombre para el proyecto'});
	}
    if(cliente == 'empty'){
		errors.push({text: 'Seleccione un usuario de la lista'});
	}
	if(errors.length > 0){
        res.render('proyectos/registroProy.hbs', {errors, usuarios, nombre_proy});
    } else {	
		new proyecto({
			nombre_proy : req.body.nombre_proy,
			cliente_proy  : req.body.cliente_proy,			
		}).save(function(err, doc){
			if(err) 
				res.json(err);
			else
				req.flash('mensaje','Proyecto registrado con éxito');
				res.redirect('/proyectos/ver_proyectos');
		});
	}
});

//Consultar
router.get('/proyectos/ver_proyectos', checkAuthentication, async (req, res)=>{
//	const registros = await proyectos.find({user: req.user.id}).sort({date: 'desc'});
    const registros = await proyecto.find().sort({date: 'desc'});
    res.render('Proyectos/ver_proyectos.hbs', {registros});
})
//Eliminar
router.get('/proyectos/eliminar/:id', checkAuthentication, async (req, res)=>{
	const registros = await proyecto.findById(req.params.id);
    res.render('Proyectos/EliminarProy.hbs' , {registros});
})

router.post('/proyectos/eliminar/:id', checkAuthentication, async (req, res)=>{
	await proyecto.findByIdAndDelete(req.params.id);
	req.flash('mensaje','Proyecto eliminado con éxito');
    res.redirect('/proyectos/ver_proyectos');
});

//Editar-Modificar
router.get('/proyectos/modificar/:id', checkAuthentication, async (req, res)=>{
	const registros = await proyecto.findById(req.params.id);
    res.render('Proyectos/ModificarProy.hbs' , {registros});
})

router.post('/proyectos/modificar/:id', checkAuthentication, async (req, res)=>{
    const {nombre_proy, cliente_proy, email_cliente}=req.body;
	await proyecto.findByIdAndUpdate(req.params.id, {nombre_proy, cliente_proy, email_cliente});
	req.flash('mensaje','Proyecto modificado con éxito');
    res.redirect('/proyectos/ver_proyectos');
});

module.exports = router;