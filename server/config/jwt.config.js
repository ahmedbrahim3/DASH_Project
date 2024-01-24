const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
module.exports.authenticate = (req, res, next) => {
  jwt.verify(req.cookies.token, secret, (err, payload) => {
    if (err) { 
      res.status(401).json({verified: false});
    } else {
      next();
    }
  });
}

