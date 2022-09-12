const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users");
const bodyParser = require("body-parser");
const loginRoutes = require("./routes/login");
const postRoutes = require("./routes/posts");
mongoose.connect("mongodb://localhost/assignment");
var jwt = require('jsonwebtoken');
const secret = "RESTAPI";

const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.use("/posts", async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("test ")[1];

    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        res.status(500).json({
          status: "failed",
          message: "Not Authenticated"
        })
      }
      const user = await User.findOne({ _id: decoded.data });
      req.user = user._id;
      next();
    });
  } else {
    return res.status(500).json({
      status: "failed",
      message: "Invalid token"
    })
  }
});

app.use("/", loginRoutes);
app.use("/posts", postRoutes);



app.listen(3000, () => console.log("The server is up at 3000 port"));