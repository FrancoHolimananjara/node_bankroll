const User = require("../models/user");
const Bankroll = require("../models/bankroll");
const OtpVerification = require("../models/otpVerification");

// utils
const hashData = require("../utils/hashData");
const compareData = require("../utils/compareData");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");

module.exports = {
  /**
   * REGISTER
   * @returns
   */
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = await createNewUser({ username, email, password });
      // send otp
      const responseData = await sendOtp(newUser);
      console.log(responseData);
      const bankroll = await Bankroll.create({ of: newUser._id });
      await newUser.updateOne(
        { $push: { ofbankroll: { _id: bankroll._id } } },
        { upsert: true }
      );
      return res.status(200).json({
        success: true,
        message: `Account created ${newUser.username}`,
        data: responseData,
      });
    } catch (error) {
      next(error);
    }
  },
  /**
   * LOGIN
   * @returns
   */
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const checkLog = await loginUser({ username, password });

      if (typeof checkLog === "object") {
        return res.status(200).json(checkLog);
      } else {
        return res.status(400).json({ success: false, message: checkLog });
      }
    } catch (error) {
      next(error);
    }
  },
  /**
   * VERIFY OTP
   * @returns
   */
  verifyOtp: async (req, res, next) => {
    try {
      const { _id } = req.params;
      const { otp } = req.body;
      console.log(_id);

      if (!_id || !otp) {
        throw errorHandler(400, "Empty user details are not allowed.");
      } else {
        const otpVerificationRecord = await OtpVerification.findOne({
          userId: _id,
        });
        if (!otpVerificationRecord) {
          // No record found
          throw errorHandler(
            404,
            "Account record doesn't exist or has been verified already. Please sign up or log in."
          );
        }
        // otp record exists
        const { expiresAt } = otpVerificationRecord;
        const hashedOtp = otpVerificationRecord.otpString;

        if (expiresAt < Date(Date.now())) {
          // User otp record has expired
          await OtpVerification.deleteMany({ where: {} });
          throw errorHandler(404, "code has expired. Please request again.");
        } else {
          const validOtp = await compareData(otp, hashedOtp);
          if (!validOtp) {
            // supplied otp is wrong
            throw errorHandler(400, "Invalid code passed. Check your inbox.");
          } else {
            await User.findOneAndUpdate(
              { _id },
              { $set: { isVerified: true } },
              { new: false, upsert: true }
            );
            await OtpVerification.deleteOne({ userId: _id });
            return res.status(201).json({
              success: true,
              message: "User email verified successfully.",
            });
          }
        }
      }
    } catch (error) {
      next(error);
    }
  },
};

/**
 * CREATE NEW USER ACCOUNT
 */
const createNewUser = async (data) => {
  try {
    const { username, email, password } = data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw Error("User with the provided data is already exist!");
    }
    // hash password
    const hashedPassword = await hashData(password);
    // create new user data object
    const newUser = new User({ username, email, password: hashedPassword });
    // store user data
    const user = await newUser.save();
    return user;
  } catch (error) {
    throw error;
  }
};
/**
 * VERIFY USER LOGIN
 */
const loginUser = async (data) => {
  try {
    const { username, password } = data;
    if (username !== "" || password !== "") {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        const hashedPassword = existingUser.password;
        // compare password
        const match = await compareData(password, hashedPassword);
        if (match) {
          return {
            token: generateToken(existingUser),
            ...existingUser._doc,
          };
        } else {
          return "Invalid password!";
        }
      } else {
        return "User not exist!";
      }
    }
  } catch (error) {
    return error;
  }
};

/**
 * SEND OTP VERIFICATION
 */
const sendOtp = async ({ _id, email }) => {
  try {
    const otp = generateOtp();
    // hash the otp
    const hashOtp = await hashData(otp);
    const newOtpVerification = new OtpVerification({
      userId: _id,
      otpString: hashOtp,
      expiresAt: Date.now() + 90000,
    });
    // save the otp record
    await newOtpVerification.save();
    //await sendEmail(mailOptions);
    return { userId: _id, email, otp };
  } catch (error) {
    throw error;
  }
};
