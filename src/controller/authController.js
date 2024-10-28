const { uuid } = require("uuidv4");
const { hashPasswordFunc } = require("../utils/hashPassword");
const jwt = require("jsonwebtoken");
const {
  insertUser,
  findUserById,
  findRole,
  userRoleSet,
  getAllApointment,
  getUserRole,
  findRoleById,
  changeUserPassword,
} = require("../model/authModel");

const { mobileOtp } = require("../utils/mobileOtpSend");
const bcrypt = require("bcryptjs");
const errorResponseHandler = require("../utils/errorResponseHandler");
const otpCache = {};
exports.signup = async (req, res) => {
  console.log(req.body);

  try {
    const {
      tenantId,
      userName,
      name,
      surname,
      email,
      emailConfirmed,
      phoneNumber,
      phoneNumberConfirmed,
      isActive,
      lockoutEnabled,
      lockoutEnd,
      role,
      password,
      otp,
    } = req.body;
    let mobileotp=""
    if (typeof otp === "string") {
      mobileotp = parseInt(otp,10);
    }
    if(typeof otp==="number"){
      mobileotp=otp
    }
    console.log("--------otp--------", mobileotp);

    const cachedOTP = otpCache[userName];
    if (otp) {
      if (
        !cachedOTP ||
        otp !== cachedOTP.otp ||
        Date.now() > cachedOTP.timestamp
      ) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }

    const PasswordHash = await hashPasswordFunc(password);
    const isUserExist = await findUserById({ email, userName });
    if (isUserExist) {
      return res
        .status(400)
        .json({ message: "User already exist by user name" });
    }

    const Id = uuid();

    const normalizedUserName = userName.toUpperCase();
    const normalizedEmail = email.toUpperCase();
    const data = {
      Id,
      tenantId: null,
      userName,
      name,
      surname,
      email,
      emailConfirmed,
      phoneNumber,
      phoneNumberConfirmed,
      twoFactorEnabled: false,
      isActive,
      isExternal: false,
      normalizedUserName,
      normalizedEmail,
      securityStamp: "asdf",
      deletionTime: null,
      deleterId: null,
      isDeleted: false,
      extraProperties: null,
      concurrencyStamp: null,
      creationTime: new Date(),
      lastModificationTime: new Date(),
      lockoutEnabled,
      lockoutEnd,
      role,
      accessFailedCount: false,
      PasswordHash,
      entityVersion: 1,
      shouldChangePasswordOnNextLogin: true,
    };
    const result = await insertUser(data);
    const getRole = await findRole(role);
    const roleData = {
      UserId: Id,
      RoleId: getRole?.Id,
      TanentId: null,
    };
    await userRoleSet(roleData);
    const userData = {
      userId: result?.Id,
      userName: result?.UserName,
      name: result?.Name,
      email: result?.Email,
      phoneNumber: result?.PhoneNumber,
      isActive: result?.IsActive,
      success: true,
      message: "Signup success",
    };
    return res.status(200).json({ userData, message: "Signup success" });
  } catch (err) {
    console.log(err);

    errorResponseHandler(res, err);
  }
};

exports.generateOtp = async (req, res) => {
  try {
    const { userName, type } = req.body;
    const user = await findUserById({ userName });
    if (type === "login") {
      if (!user) {
        return res.status(404).json({ message: "Invalid user name" });
      }
    }
    if (type === "signup") {
      if (user) {
        return res.status(400).json({ message: "User already exist" });
      }
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    otpCache[userName] = { otp, timestamp: Date.now() + 300000 };
    await mobileOtp({ userName, otp });
    res.status(200).json({ otp, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);

    errorResponseHandler(res, error);
  }
};

exports.login = async (req, res) => {
  try {
    const { userName, password, otp } = req.body;
    const user = await findUserById({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid user name" });
    }
    const userRole = await getUserRole(user?.Id);
    let token = "";
    const role = await findRoleById(userRole?.RoleId);
    if (role?.Name === "Patient") {
      const cachedOTP = otpCache[userName];

      if (
        !cachedOTP ||
        otp !== cachedOTP.otp ||
        Date.now() > cachedOTP.timestamp
      ) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      token = jwt.sign(
        {
          id: user?.Id,
          email: user?.email,
          role: user?.UserName,
          mobile: user?.mobile,
        },
        "soowgoodauthSecret",
        { expiresIn: "2160h" }
      );
    } else {
      const isMatch = await bcrypt.compare(password, user.PasswordHash);

      if (!isMatch) {
        return res.status(400).json({ message: "Password does not match" });
      }
      token = jwt.sign(
        {
          id: user?.Id,
          email: user?.email,
          role: user?.UserName,
          mobile: user?.mobile,
        },
        "soowgoodauthSecret",
        { expiresIn: "2160h" }
      );
    }

    const loginData = {
      userId: user?.Id,
      userName: user?.UserName,
      roleName: role?.Name,
      token: token,
    };
    res.status(200).json({ loginData, message: "Login success" });
  } catch (error) {
    console.log("");

    errorResponseHandler(res, error);
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await findUserById({ userName });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const PasswordHash = await hashPasswordFunc(password);

    const result = await changeUserPassword(user?.Id, PasswordHash);
    return res
      .status(200)
      .json({ result, message: "Password change successfully" });
  } catch (error) {
    errorResponseHandler(res, error);
  }
};

exports.appointment = async (req, res) => {
  try {
    const appoin = await getAllApointment();
    res.status(200).json({ appoin, message: "appointment list" });
  } catch (error) {
    errorResponseHandler(res, error);
  }
};
