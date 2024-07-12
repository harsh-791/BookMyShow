const express = require("express");
const User = require("../models/userModel");
const bcrypt = require('bcrypt')

const router = express.Router();
const jwt = require('jsonwebtoken');

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

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if(!validPassword){
    return res.send({
        success: false,
        message: "Invalid Password"
    })
  }

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})

  return res.send({
    success: true,
    message: "Login Successful",
    token: token
})
});


module.exports = router;