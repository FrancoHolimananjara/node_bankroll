const User = require("../models/user");
const Bankroll = require("../models/bankroll");

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
      const otp = sendOtp(newUser);
      console.log(otp);
      const bankroll = await Bankroll.create({ of: newUser._id });
      const updateNewUser = await newUser.updateOne(
        { $push: { ofbankroll: { _id: bankroll._id } } },
        { upsert: true }
      );
      return res.status(200).json({
        success: true,
        message: `Account created ${newUser.username}`,
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
const sendOtp = ({ id, email }) => {
  try {
    const otp = generateOtp();
    return otp;
  } catch (error) {
    throw error;
  }
};
