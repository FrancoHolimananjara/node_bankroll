const Session = require("../models/session");
const Bankroll = require("../models/bankroll");
const User = require("../models/user");

module.exports = {
  create: async (req, res, next) => {
    try {
      const _userId = req._userId;
      const { start, end, buyin, buyout, place } = req.body;
      const session = await Session.create({
        start,
        end,
        buyin,
        buyout,
        place,
        of: _userId,
      });
      const benef = buyout - buyin;
      // update the bankroll bank value
      const bankroll = await Bankroll.findOne({ of: _userId });
      bankroll.bank = bankroll.bank + benef <= 0 ? 0 : bankroll.bank + benef;
      await bankroll.save();
      // -----
      await User.updateOne(
        { _id: _userId },
        { $push: { ofsessions: { _id: session._id } } },
        { upsert: true }
      );
      return res.status(200).json({
        success: true,
        message: "New session added and your bankroll is updated",
      });
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
      if (session) {
        return res.status(200).json({ session });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Session not found" });
      }
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const _userId = req._userId;
      const sessions = await Session.find({ of: _userId });
      if (sessions.length > 0) {
        return res.status(200).json({ sessions });
      } else {
        return res.status(200).json([]);
      }
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