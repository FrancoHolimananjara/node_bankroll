const mongoose = require("mongoose");
const Session = require("./session");
const Bankroll = require("./bankroll");
const Transaction = require("./transaction");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
    ofbankroll: { type: mongoose.Schema.Types.ObjectId, ref: "Bankroll" },
    ofsessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    oftransactions: [{ type: mongoose.Schema.ObjectId, ref: "Transaction" }],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre("remove", async function (next) {
  const user = this;
  await Bankroll.deleteMany({ of: user._id });
  await Session.deleteMany({ of: user._id });
  await Transaction.deleteMany({ of: user._id });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
