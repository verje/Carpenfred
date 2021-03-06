var mongoose = require('mongoose'); 
var keys = require('../config/keys');

db = mongoose.createConnection(keys.mongodb.dbURI, {
  dbName: 'test',
  useNewUrlParser: true,
  useUnifiedTopology: true
});

db.on('error', function () {
  console.log('Error! Database connection failed.');
});

db.once('open', function (argument) {
  console.log('Database connection established!');
})
/*
mongoose.connect(process.env.dbURI); 
// CONNECTION EVENTS
mongoose.connection.on('connected', function () {  
  console.log('Mongoose conexion exitosa');
}); 
// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose conexión error: ' + err);
}); 
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose desconectado'); 
});
// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose desconectado debido a que la app finalizó'); 
    process.exit(0); 
  }); 
}); 
require('./../models/team-esquema');*/
module.exports = db;