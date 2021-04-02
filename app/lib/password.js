"user strict";

import bcrypt from "bcryptjs";

const password = {
  validatePassword: (password) => {
    if (typeof password !== "string") {
      return false;
    }
    return password.length >= 8 && password.length <= 32;
  },
  hashPassword: (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(pwd, salt);
    return hashPass;
  },
  genRandomString: (length)=>{
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let str = "";
    for(let i = 0; i<length; i++){
      str +=charset.charAt(Math.floor(Math.random()*charset.length)) 
    }
    return str;
  }
};

module.exports = password;
