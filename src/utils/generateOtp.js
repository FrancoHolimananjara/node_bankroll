const generateOtp = () => {
  try {
    return (otp = `${Math.floor(100000 + Math.random() * 900000)}`);
  } catch (error) {
    throw error;
  }
};
module.exports = generateOtp;
