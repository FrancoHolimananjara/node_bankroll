const Transaction = require("../models/transaction");
const Bankroll = require("../models/bankroll");

const { Dépôt, Transfert, Retrait } = require("../config/transactionAction");
const User = require("../models/user");

const TransactionActionMethode = async (
  bankroll,
  action,
  amount,
  transfertTo,
  _userId
) => {
  var response = {};
  switch (action) {
    case Dépôt:
      bankroll.bank += amount;
      await bankroll.save();
      const dépôt = await Transaction.create({
        amount,
        action,
        date: Date.now(),
        of: _userId,
      });
      message = `Vous avez deposze ${amount} Ar dans votre compte.\nVotre nouveau solde est ${bankroll.bank} Ar`;
      MettreAJourUserTransaction(_userId, dépôt);
      ChangerLaReponseDuTransactionActionMethode(
        response,
        false,
        message,
        dépôt
      );
      break;
    case Transfert:
      if (bankroll.bank < amount) {
        const transfertFailed = await Transaction.create({
          amount,
          action,
          to: transfertTo,
          date: Date.now(),
          failed: true,
          of: _userId,
        });
        message = `Votre solde est insuffisant.\nVeuillez completer ${
          amount - bankroll.bank
        } Ar pour effectuer ce transfert.`;
        MettreAJourUserTransaction(_userId, transfertFailed);
        ChangerLaReponseDuTransactionActionMethode(
          response,
          true,
          message,
          transfertFailed
        );
      } else {
        bankroll.bank -= amount;
        await bankroll.save();
        const transfertSuccess = await Transaction.create({
          amount,
          action,
          to: transfertTo,
          date: Date.now(),
          of: _userId,
        });
        message = `Vous avez transferé ${amount} Ar vers ${transfertTo}`;
        MettreAJourUserTransaction(_userId, transfertSuccess);
        ChangerLaReponseDuTransactionActionMethode(
          response,
          false,
          message,
          transfertSuccess
        );
      }
      break;
    case Retrait:
      if (bankroll.bank < amount) {
        const retraitFailed = await Transaction.create({
          amount,
          action,
          date: Date.now(),
          failed: true,
          of: _userId,
        });
        message = `Votre solde est insuffisant.\nRecharger ${
          amount - bankroll.bank
        } Ar à votre compte si vous souhaite effectuer ce retrait.`;
        MettreAJourUserTransaction(_userId, retraitFailed);
        ChangerLaReponseDuTransactionActionMethode(
          response,
          true,
          message,
          retraitFailed
        );
      } else {
        bankroll.bank -= amount;
        await bankroll.save();
        const retraitSuccess = await Transaction.create({
          amount,
          action,
          date: Date.now(),
          of: _userId,
        });
        message = `Vous avez rétiré ${amount} Ar de votre compte`;
        MettreAJourUserTransaction(_userId, retraitSuccess);
        ChangerLaReponseDuTransactionActionMethode(
          response,
          false,
          message,
          retraitSuccess
        );
      }
      break;

    default:
      response.message = "Veillez choisissez le bon action!";
      break;
  }
  return response;
};

const MettreAJourUserTransaction = async (_userId, transaction) => {
  await User.findOneAndUpdate(
    { _id: _userId },
    { $push: { oftransactions: { _id: transaction._id } } },
    { upsert: true }
  );
};

const ChangerLaReponseDuTransactionActionMethode = (
  response,
  failed,
  message,
  transactionType
) => {
  response.failed = failed;
  response.message = message;
  response.transactionType = transactionType;
};

module.exports = {
  add: async (req, res) => {
    const _userId = req._userId;
    const { amount, action, transfertTo } = req.body;
    console.log(req.body);
    const bankroll = await Bankroll.findOne({ of: _userId });
    if (!bankroll) {
      // Handle the case where no bankroll is found for the given _userId
      return res.status(404).json({ message: "Bankroll not found" });
    }
    const response = await TransactionActionMethode(
      bankroll,
      action,
      amount,
      transfertTo != null ? transfertTo : "",
      _userId
    );
    return res.status(200).json(response);
  },
  getOne: async (req, res) => {
    const _userId = req._userId;
    const { _transactionId } = req.params;
    const transaction = await Transaction.findOne({
      $and: [{ _id: _transactionId }, { of: _userId }],
    });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Unknown transaction",
      });
    }
    return res.status(200).json({
      transaction,
    });
  },
  getAll: async (req, res) => {
    const _userId = req._userId;
    const { action } = req.query;
    const transactions = action
      ? await Transaction.find({ of: _userId, action }).sort({
          createdAt: -1,
        })
      : await Transaction.find({ of: _userId }).sort({
          createdAt: -1,
        });
    return res.status(200).json({ transactions });
  },
  TransactionActionMethode: TransactionActionMethode, // Exporting the method
};
