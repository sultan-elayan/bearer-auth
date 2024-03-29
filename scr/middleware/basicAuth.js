'use strict';
const base64 = require('base-64')

module.exports = (UserSchema) => (req, res, next) => {
    if (!req.headers['authorization']) {
        next('No Authorization info');
        return;
    }
    let basicHeaderParts = req.headers.authorization.split(' ');
    let encoded = basicHeaderParts.pop();
    let decoded = base64.decode(encoded); 
    let [username, password] = decoded.split(":"); 

    UserSchema.authenticateBasic(username, password).then(validUser=> {
        req.user = validUser;
        next();
    }).catch(err=> next('invalid users'));
}