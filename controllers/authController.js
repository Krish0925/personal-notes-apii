const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER USER

exports.register = (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {

    return res.status(400).json({
      message: "Email and Password required"
    });

  }

  bcrypt.hash(password, 10, (err, hash) => {

    if (err) {

      return res.status(500).json(err);

    }

    const sql =
      "INSERT INTO users(email,password) VALUES(?,?)";

    db.query(sql, [email, hash], (err) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.status(201).json({
        message: "User Registered"
      });

    });

  });

};


// LOGIN USER

exports.login = (req, res) => {

  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email=?";

  db.query(sql, [email], async (err, data) => {

    if (err) {

      return res.status(500).json(err);

    }

    if (!data.length) {

      return res.status(404).json({
        message: "User Not Found"
      });

    }

    const valid =
      await bcrypt.compare(
        password,
        data[0].password
      );

    if (!valid) {

      return res.status(401).json({
        message: "Wrong Password"
      });

    }

    const token = jwt.sign(

      { id: data[0].id },

      process.env.JWT_SECRET

    );

    res.status(200).json({

      message: "Login Success",

      token

    });

  });

};