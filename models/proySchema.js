const mongoose = require('mongoose');
const schema = mongoose.Schema;

const proySchema = new schema({
    nombre_proy: {type: String, required: true},
    cliente_proy: {type: String, required: true},    
});

module.exports = mongoose.model('proyectos', proySchema);

