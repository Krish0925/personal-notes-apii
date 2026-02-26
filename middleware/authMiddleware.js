const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const header = req.headers.authorization;

  if (!header) {

    return res.status(401).json({
      message: "No Token Provided"
    });

  }

  const token = header.split(" ")[1];

  jwt.verify(

    token,

    process.env.JWT_SECRET,

    (err, user) => {

      if (err) {

        return res.status(401).json({
          message: "Invalid Token"
        });

      }

      req.user = user;

      next();

    }

  );

};