const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const user = require('./../models/user');


router.post('/signup', async(req,res) => {
    try{
        // if user already exists
        const user = await User.findOne({email: req.body.email});

        // sending error message that user exists
        if(user){
            return res.send({
                message: "User already exists!",
                success: false
            })
        }

        // encrypting the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        // creating new user and adding in DB
        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).send({
            message: "User created successfully!",
            success: true
        })

    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
})

router.post('/login', async(req,res) => {
    try{
        // check if user exists
        const user = await User.findOne({email: req.body.email}).select('password');
        if(!user){
            return res.send({
                message: 'User does not exist!',
                success: false
            })
        }
        // check if password is correct
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if(!isValid){
            return res.send({
                message: 'Invalid password',
                success: false
            })
        }

        // if user exists and password is correct, assign a JWT
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY,{expiresIn: "1d"});
        res.send({
            message: 'User logged-in successfully!',
            success: true,
            token: token
        })

    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
})

module.exports = router;