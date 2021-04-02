require("dotenv/config");

const adminUser = process.env.ADMIN_USER;
const adminPwd = process.env.ADMIN_PWD;

module.exports = { adminUser, adminPwd };
