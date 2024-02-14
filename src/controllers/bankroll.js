const Bankroll = require('../models/bankroll');

module.exports = {
    getHerBankroll: async (req,res) => {
        try {
            const _userId = req._userId;
            const bankroll = await Bankroll.findOne({of: _userId}).select("-of");
            if (bankroll) {
                return res.status(200).json({bankroll});
            }else{
                return res.status(200).json([]);
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error });
        }
    },
    /**
     * update bankroll value
     * MANAO DEPOT AM MVOLA OATRA
     */
    
}