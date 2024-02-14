const transactionRoutes = require('express').Router();
const { add,getAll,getOne } = require('../controllers/transaction');
const { authMiddleware } = require('../middleware/auth');

transactionRoutes.get('/', authMiddleware ,getAll);
transactionRoutes.post('/', authMiddleware ,add);
transactionRoutes.get('/:_transactionId', authMiddleware ,getOne);

module.exports = transactionRoutes;