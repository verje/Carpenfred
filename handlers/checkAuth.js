//it will called from each routes we want to ensure
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
		req.flash('error_msg', 'Debe iniciar sesion nuevamente');
        res.redirect("/login");
    }
  }

  module.exports = checkAuthentication