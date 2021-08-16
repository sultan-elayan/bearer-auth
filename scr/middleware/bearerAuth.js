'use strict';

module.exports = (UserSchema) => (req, res, next) => {
    if (!req.headers['authorization']) {
        next('No Authorization info');
        return;
    }
    let basicHeaderParts = req.headers.authorization.split(' ');
    let token = basicHeaderParts.pop();
    UserSchema.authenticateToken(token).then(userObject=> {
        req.user = userObject;
        next();
    }).catch(err=> next('Invalid Token'))
    
}