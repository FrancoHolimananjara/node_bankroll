const bankrollRoutes = require('express').Router();
const { getHerBankroll } = require('../controllers/bankroll');
const { authMiddleware } = require('../middleware/auth');

bankrollRoutes.get('/', authMiddleware,getHerBankroll);


module.exports = bankrollRoutes;