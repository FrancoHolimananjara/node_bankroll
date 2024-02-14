const sessionRoutes = require('express').Router();
const { create,getOne,getAll,deleteSession } = require('../controllers/session');
const { authMiddleware } = require('../middleware/auth');


sessionRoutes.get('/', authMiddleware,getAll)
                .post('/', authMiddleware ,create)
                .get('/:_sessionId', authMiddleware , getOne)
                .delete('/:_sessionId', authMiddleware , deleteSession);

module.exports = sessionRoutes;