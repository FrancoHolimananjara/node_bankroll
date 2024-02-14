const jwt = require('jsonwebtoken');

const parseAuthorization =(authorization)=> {
    return (authorization!=null)?authorization.replace('Bearer ',''):null;
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader){
        return res.status(401).json({error:'Not Authenticated ! No Header'})
    }
    const token = parseAuthorization(authHeader);
    let decodedToken;
    try{
        decodedToken = jwt.verify(token ,process.env.JWT_SECRET_KEY);
    }catch (e) {
        if (e.name=="JsonWebTokenError") {
            return res.status(498).json({error:e.message})
        }
        if (e.name=="TokenExpiredError") {
            return res.status(498).json({error:e.message})
        }
    }
    if (!decodedToken) {
        return res.status(401).json({error:'Not Authenticated ! No decode'})
    }
    req.isAuthenticated = true;
    req._userId = decodedToken._userId;
    next();
}

module.exports = { authMiddleware };