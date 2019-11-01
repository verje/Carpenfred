const passport = require('passport');
const estrategia = require('passport-local').Strategy;

const usuarios = require('../models/clientesSchema.js');

passport.use(new estrategia({usernameField: 'username_form', passwordField: 'password_form'}, async (username_arg, password_arg, done)=>{
    const user = await usuarios.findOne({username_cli: username_arg});
    if(!user){
        return done (null, false, {mensaje: 'Usuario no encontrado'});
    } else {
        const match = await user.matchPassword(password_arg);
        if(match){
            return done(null, user);
        } else {
            return done(null, false, {mensaje:'Password incorrecto'});
        }
    }
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    usuarios.findById(id, (err, user)=>{
        done(err, user);
    });
});

module.exports = passport;