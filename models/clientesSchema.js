const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrip = require('bcryptjs');

const clientSchema = new schema({
    name_cli: {type: String, required: true},
    username_cli: {type: String, required: true},
    password_cli: {type: String, required: true},
    email_cli: {type: String, required: true},
    telf_cli: {type: String, required: true},
    role: {type: String, required: true},
});

//(password) is a value received from routes_clientes.js when the client password is setting
clientSchema.methods.encryptPassword = async (param_password) => { 
    const salt = await bcrip.genSalt(10);
    const hash = bcrip.hash(param_password, salt);
    return hash;
 }
 //(password) is a value received from passport.js called by login process (when action="/login" method="POST" occurs)
 clientSchema.methods.matchPassword = async function(password){

     return await bcrip.compare(password, this.password_cli);
 }

module.exports = mongoose.model('clientes', clientSchema);


