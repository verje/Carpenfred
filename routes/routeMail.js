var nodeMailer = require('nodemailer');
var express = require('express');
var router = express.Router();
const keys = require('../config/keys');

router.post('/send-email', function(req, resp){
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
        from: 'Carpenfred Sitio WEB',
        sender: 'Desde Formulario de contacto', 
        to: keys.mailOptions.correo,
        subject: 'Carpenfred, ' + req.body.nombre + ' te escribió desde la pagina WEB',
        text: 'Correo enviado desde la pagina WEB de Carpenfred',
        html: req.body.msg + 
        '<br> <h5>Datos de Contacto</h6>' + 
        '<br> Nombre: ' + req.body.nombre +
        '<br> Correo: ' + req.body.correo +
        '<br> Telefono: ' +  req.body.telf
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }
        console.log('Mensaje %s enviado: %s', info.messageId, info.response);
        resp.render('Complements/index.hbs');
    });
});

module.exports = router;