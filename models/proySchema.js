const mongoose = require('mongoose');
const schema = mongoose.Schema;
require ('../database/conexion');

const proySchema = new schema({
    nombre_proy: {type: String, required: true},
    cliente_proy: {type: String, required: true},    
});

module.exports = db.model('proyectos', proySchema);

