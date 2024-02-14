const router = require('express').Router();

const authRoutes = require('./auth');
const bankrollRoutes = require('./bankroll');
const sessionRoutes = require('./session');
const transactionRoutes = require('./transaction');
const userRoutes = require('./user');

router.use('/auth',authRoutes);
router.use('/bankroll',bankrollRoutes);
router.use('/transaction',transactionRoutes);
router.use('/session',sessionRoutes);
router.use('/user',userRoutes);

module.exports = router;