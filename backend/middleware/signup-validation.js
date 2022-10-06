var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

function validator(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    var validEmail = emailRegex.test(email);
    var validPass = passwordRegex.test(password);
    var parts = email.split("@");
    var domainParts = parts[1].split(".");

    if (!validPass) {
        console.log('Mot de passe invalide')
    } else {
    if (!email) {
        return false;
    } else if(email.length>254) {
        return false;
    } else if(!validEmail) {
        return false;
    } else if(parts[0].length>64) {
        return false;
    } else if(domainParts.some(function(part) { return part.length>63; })) {
        return false;
    } else {
        next();
        return true;
    }
}
};

module.exports = { validator };