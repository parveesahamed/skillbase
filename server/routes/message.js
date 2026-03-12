const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// @route   GET /api/messages/:projectId/:userId
// @desc    Get chat history between logged-in user and another user for a specific project
// @access  Private
router.get('/:projectId/:userId', auth, async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const me = req.user.id;

    const messages = await Message.find({
      project: projectId,
      $or: [
        { sender: me, receiver: userId },
        { sender: userId, receiver: me },
      ],
    })
      .populate('sender', ['name', 'email'])
      .populate('receiver', ['name', 'email'])
      .sort({ createdAt: 1 });

    // Mark unread messages sent to me as read
    await Message.updateMany(
      { project: projectId, sender: userId, receiver: me, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/messages
// @desc    Save a new message
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { receiver, project, content, attachments } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ msg: 'Receiver and content are required' });
    }

    const newMessage = new Message({
      sender: req.user.id,
      receiver,
      project: project || undefined,
      content,
      attachments: attachments || [],
    });

    const message = await newMessage.save();
    await message.populate('sender', ['name', 'email']);
    await message.populate('receiver', ['name', 'email']);

    // Emit via Socket.io to the receiver if online
    const io = req.app.get('io');
    if (io) {
      io.emit('receiveMessage', message);
    }

    res.json(message);
  } catch (err) {
    console.error('Send message error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT /api/messages/read/:messageId
// @desc    Mark a single message as read
// @access  Private
router.put('/read/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    message.read = true;
    await message.save();

    // Notify sender about read receipt via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('messageRead', { messageId: message._id, readBy: req.user.id });
    }

    res.json(message);
  } catch (err) {
    console.error('Mark read error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
