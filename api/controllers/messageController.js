const Message = require('../models/messageTemplateModel');

const createMessage = (req, res) => {
    const message = new Message({
        name: req.body.name,
        type: req.body.type,
        message: {
            text: req.body.message.text,
            imageUrl: req.body.imageUrl, // Optional for Text-Image type
        },
        workspaceId: req.body.workspaceId,
        createdBy: req.user.userId, 
    });

    message.save()
        .then(result => {
            res.status(201).json({
                message: "Message created successfully",
                message: result,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/message/" + result._id,
                },
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

const getAllMessages = (req, res) => {
    Message.find()
        .then(messages => {
            res.status(200).json({
                message: "Messages retrieved successfully",
                data: messages
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving messages",
                error: err
            });
        });
};

const getMessageById = (req, res) => {
    const messageId = req.params.messageId;
    Message.findById(messageId)
        .then(message => {
            if (!message) {
                return res.status(404).json({ message: "Message not found" });
            }
            res.status(200).json({
                message: "Message retrieved successfully",
                data: message
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

const updateMessage = (req, res) => {
    const messageId = req.params.messageId;
    Message.findByIdAndUpdate(messageId, req.body)
        .then(updatedMessage => {
            if (!updatedMessage) {
                return res.status(404).json({ message: "Message not found" });
            }
            res.status(200).json({
                message: "Message updated successfully",
                data: updatedMessage
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};
const deleteMessage = (req, res) => {
    const messageId = req.params.messageId;
    Message.findByIdAndDelete(messageId)
        .then(deletedMessage => {
            if (!deletedMessage) {
                return res.status(404).json({ message: "Message not found" });
            }
            res.status(200).json({ message: "Message deleted successfully" });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

module.exports = {
    createMessage,
    getAllMessages,
    getMessageById,
    updateMessage,
    deleteMessage
};