const session = require("cookie-session");

module.exports = session({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.JWT_SECRET],
});
