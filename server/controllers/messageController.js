const route = require('express').Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../models/chat');
const Message = require('./../models/message');

route.post('/new-message', authMiddleware, async(req, res) => {
    try{
        // store the message in message collection
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        // update the last message in chat collection
        // const currentChat = Chat.findById(req.body.chatId);
        // currentChat.lastMessage = savedMessage._id;
        // await currentChat.save();

        const currentChat = await Chat.findOneAndUpdate({
            _id: req.body.chatId
        }, {
            lastMessage: savedMessage._id,
            $inc: {unreadMessageCount: 1}
        });

        // const updatedChat = await Chat.findByIdAndUpdate(
        //     req.body.chatId, // Use chatId directly
        //     {
        //         lastMessage: savedMessage._id,
        //         $inc: { unreadMessageCount: 1 }
        //     },
        //     {
        //         new: true, // Return the updated document
        //         runValidators: true // Enforce schema validation
        //     }
        // );

        // if (!updatedChat) {
        //     return res.status(404).send({
        //         message: 'Chat not found.',
        //         success: false
        //     });
        // }
        
        res.status(201).send({
            message: 'Message sent successfully!',
            success: true,
            data: savedMessage
        });

    }catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

route.get('/get-all-messages/:chatId', authMiddleware, async(req, res) => {
    try{
        const allMessages = await Message.find({chatId: req.params.chatId}).sort({createdAt: 1});

        res.send({
            message: "All messages fetched successfully",
            success: true,
            data: allMessages
        })
    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
})

module.exports = route;