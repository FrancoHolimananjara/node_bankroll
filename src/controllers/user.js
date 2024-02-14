const User = require("../models/user");

module.exports = {
  // user profile
  profile: async (req, res) => {
    try {
      const _userId = req._userId;
      const userPofile = await User.findOne({ _id: _userId }).select(
        "-password"
      );
      if (userPofile) {
        return res.status(200).json({ success: true, userPofile });
      } else {
        return res
          .status(404)
          .json({
            success: false,
            message: "User not found with this data provided!",
          });
      }
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
};
