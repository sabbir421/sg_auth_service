const bcrypt = require('bcryptjs');
const saltRounds = 5;

exports.hashPasswordFunc = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    throw err;
  }
};
