const mongoose = require("mongoose");
const otpVerificaitonSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    otpString: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: "otpVerifications" }
);
const OtpVerification = mongoose.model(
  "OtpVerificaiton",
  otpVerificaitonSchema
);
module.exports = OtpVerification;
