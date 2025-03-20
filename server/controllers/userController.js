const router = require('express').Router();
const User = require('./../models/user');
const authMiddleware = require('./../middlewares/authMiddleware');
const cloudinary = require('./../../server/cloudinary');

// GET logged-in user details
router.get('/get-logged-user',authMiddleware, async(req, res) => {
    try{
        const user = await User.findOne({_id: req.body.userId});
        res.send({
            message: 'user fetched successfully.',
            success: true,
            data: user
        })
    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
    
})

router.get('/get-all-users',authMiddleware, async(req, res) => {
    try{
        const userid = req.body.userId;
        const allUsers = await User.find({_id: {$ne: userid}});
        res.send({
            message: 'All users fetched successfully.',
            success: true,
            data: allUsers
        })
    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
    
})

router.post('/upload-profile-pic', authMiddleware, async(req, res) => {
    try {
        const image = req.body.image;

        // upload the image to cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: 'chat-app'
        })

        //  update the user model & set the profile pic property
        const user = await User.findByIdAndUpdate(
            { _id: req.body.userId },
            { profilePic: uploadedImage.secure_url },
            { new: true }
        )

        res.send({
            message: 'Profile picture uploaded successfully',
            success: true,
            data: user
        })

    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})

module.exports = router;