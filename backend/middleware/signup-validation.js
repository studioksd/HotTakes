var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

module.exports = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    var validEmail = emailRegex.test(email);
    var validPass = passwordRegex.test(password);

    if (!validPass) {
        res.status(401).json({ message: 'Mot de passe invalide' });
    } else if (!validEmail) {
        res.status(401).json({ message: 'Email invalide' });
    } else {
        next();
    }
};