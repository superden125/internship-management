require("dotenv/config");

let url = process.env.MONGO_URL;

let options = { useNewUrlParser: true, useUnifiedTopology: true };
if (process.env.MONGO_USER && process.env.MONGO_PWD) {
  options.auth = {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PWD,
  };
}

module.exports = { url, options };
