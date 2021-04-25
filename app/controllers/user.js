import User from "../models/user";
import bcryptjs from "bcryptjs";

import {
  adminUser,
  adminPwd
} from "../config/host";

module.exports = {
  login: async (username, password) => {
    // if (username === "") return {
    //   err: "username empty"
    // };
    // if (password === "") return {
    //   err: "password empty"
    // };

    if (username == adminUser && password == adminPwd) {
      return {
        name: 'Administrator',
        role: 'admin'
      };
    }

    let user = await User.findOne({
      $or: [{
          ms: username
        },
        {
          email: username
        }
      ]
    });

    if (!user) return {
      err: "user not found"
    };

    let match = await bcryptjs.compare(password, user.password);
    if (!match) return {
      err: "password not match"
    };

    return {
      name: user.name,
      role: user.role,
      userId: user._id
    };
  },
};