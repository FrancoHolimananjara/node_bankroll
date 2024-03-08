const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["Dépôt", "Transfert", "Retrait"],
    },
    to: {
      type: String,
      default: "Moi",
    },
    date: {
      type: Date,
      required: true,
    },
    failed: {
      type: Boolean,
      default: false,
    },
    of: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  {
    collection: "transactions",
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
