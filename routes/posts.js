const express = require("express");
const User = require("../models/users");
const Post = require("../models/post");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const router = express.Router();
const secret = "RESTAPI";


router.post("/", async (req, res) => {
  const posts = await Post.create(req.body);
  res.json({
    status: "Success",
    posts
  })

})
router.put("/:postId", async (req, res) => {
  try {
    const posts = await Post.updateOne({ _id: req.params.postId }, req.body);
    res.json({
      status: "Success",
      posts
    })
  } catch {
    res.status(404).json({
      status: "failed",
      message: "post not found"
    })
  }
})
router.delete("/:postId", async (req, res) => {
  try {
    const posts = await Post.deleteOne({ _id: req.params.postId });
    res.json({
      status: "Success",
      posts
    })
  } catch {
    res.status(404).json({
      status: "failed",
      message: "post not found"
    })
  }
})

module.exports = router;