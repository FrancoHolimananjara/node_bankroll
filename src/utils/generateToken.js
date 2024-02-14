const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/secretKey');

const generateToken = ({_id,username}) => {
    return jwt.sign(
    // payload
        {
            _userId : _id,
            username
        },
    // key
        secretKey,
    // delay
        {
            expiresIn: '5min'
        }
    )
}

module.exports = generateToken;