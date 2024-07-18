const express = require("express");
const User = require("../models/userModel");
const bcrypt = require('bcrypt')

const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authmiddleware')

router.post("/register", async (req, res) => {
    try{
        const userExists = await User.findOne({email: req.body.email})

        if(userExists){
            res.send({
                success: false,
                message: "User Already Exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashedPassword


        const newUser = new User(req.body)
        await newUser.save()

        res.send({
            success: true,
            message: "user created"
        })
    }
    catch(error){
        res.send(error)
    }

});

router.post("/login", async (req, res) => {
  const user = await User.findOne({email: req.body.email})
  if(!user){
    res.send({
        success: false,
        message: 'User does not exist, please register'
    })
  }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      res.send({
        success: false,
        message: "Invalid Password"
    })
  }

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})

  res.send({
    success: true,
    message: "Login Successful",
    token: token
})


});

//Bearer --> for authentication of user
router.get('/get-current-user', authMiddleware, async(req, res) => {
    try{
        const user = await User.findById(req.body.userId).select('-password');
        res.send({
            message: true,
            message: "You are Authorized",
            data: user
        })
    }
    catch(error){
        res.send({
            message: false,
            message: "You not are Authorized"
        })
    }
})

module.exports = router;