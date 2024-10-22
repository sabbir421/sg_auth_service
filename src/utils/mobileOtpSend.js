const axios = require("axios");
exports.mobileOtp = async ({ userName, otp }) => {
  const greenwebsms = new URLSearchParams();
  greenwebsms.append(
    "token",
    "930215042016799942603064c6b63203838ad38b8f0fc7fcc9cd"
  );
  greenwebsms.append("to", userName);
  greenwebsms.append("message", `Your ontime password is : ${otp}`);
  axios
    .post("https://api.bdbulksms.net/api.php", greenwebsms)
    .then((response) => {
      console.log(response.data);
      return otp;
    });
};
