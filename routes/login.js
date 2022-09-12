const express = require("express");
const User = require("../models/users");
const Post = require("../models/post");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const router = express.Router();
const secret = "RESTAPI";



router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).json({
          status: "failed",
          message: err.message
        })
      }
      const user = await User.create({
        name,
        email,
        password: hash
      });
      res.status(200).json({
        status: "sucess",
        data: user
      })
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await User.findOne({ email })

    if (!data) {
      return res.status(400).json({
        status: "failed",
        message: "User is not registerd"
      })
    }

    bcrypt.compare(password, data.password, function (err, result) {

      if (result) {
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
          data: data._id
        }, secret);

        res.status(200).json({
          token: token
        });
      } else {
        return res.status(500).json({
          status: "failed",
          message: "incorrect password"
        })
      }


    });

  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message
    });
  };
});
module.exports = router;