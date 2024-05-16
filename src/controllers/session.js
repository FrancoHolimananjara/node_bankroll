const Session = require("../models/session");
const Bankroll = require("../models/bankroll");
const User = require("../models/user");
const { TransactionActionMethode } = require("./transaction");

module.exports = {
  create: async (req, res, next) => {
    try {
      const _userId = req._userId;
      const { start, end, inprogress, buyin, buyout, place } = req.body;

      // update the bankroll bank value
      const bankroll = await Bankroll.findOne({ of: _userId });
      if (!bankroll) {
        // Handle the case where no bankroll is found for the given _userId
        return res.status(404).json({ message: "Bankroll not found" });
      }
      if (bankroll.bank > 0) {
        const session = await Session.create({
          start,
          end,
          inprogress,
          buyin,
          buyout: inprogress && end == null ? 0 : buyout,
          place,
          of: _userId,
        });
        const benef = buyout - buyin;
        const transaction =
          inprogress && end
            ? await TransactionActionMethode(
                bankroll,
                "Transfert",
                buyin,
                place,
                _userId
              )
            : await TransactionActionMethode(
                bankroll,
                "Dépôt",
                benef,
                place,
                _userId
              );
        console.log(transaction);
        // bankroll.bank = bankroll.bank + benef <= 0 ? 0 : bankroll.bank + benef;
        // await bankroll.save();
        // -----
        await User.updateOne(
          { _id: _userId },
          { $push: { ofsessions: { _id: session._id } } },
          { upsert: true }
        );
        return res.status(200).json({
          success: true,
          message:
            inprogress && end == null
              ? "New session in progress "
              : "New session added and your bankroll is updated",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Bank account empty, please make 'depot'",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const _userId = req._userId;
      const { _sessionId } = req.params;
      const session = await Session.find({
        $and: [{ _id: _sessionId }, { of: _userId }],
      });
      return res.status(200).json({ session: session });
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    const _userId = req._userId;
    const { inprogress } = req.query;
    try {
      const sessions = await Session.find(
        inprogress
          ? { $and: [({ of: _userId }, { inprogress })] }
          : { of: _userId }
      ).sort({ createdAt: -1 });
      return res.status(200).json({ sessions: sessions });
    } catch (error) {
      next(error);
    }
  },
  finishSessionInProgress: async (req, res, next) => {
    const _userId = req._userId;
    const { inprogress } = req.query;
    const { _sessionId } = req.params;
    try {
      const session =
        inprogress &&
        (await Session.find({
          $and: [({ _id: _sessionId }, { of: _userId }, { inprogress })],
        }).sort({ createdAt: -1 }));
      session.inprogress = false;

      // const transaction = await TransactionActionMethode();
    } catch (error) {
      next(error);
    }
  },

  deleteSession: async (req, res, next) => {
    try {
      const _userId = req._userId;
      const { _sessionId } = req.params;
      console.log(_sessionId);
      await Session.findOneAndRemove({
        $and: [{ _id: _sessionId }, { of: _userId }],
      });
    } catch (error) {
      next(error);
    }
  },
};
