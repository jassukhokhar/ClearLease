import asyncHandler from '../utils/asyncHandler.js';
import LeaseDocument from '../models/LeaseDocument.js';
import Conversation from '../models/Conversation.js';
import { askLeaseQuestion } from '../services/chatService.js';

/**
 * Load a lease and ensure it belongs to the current user.
 */
const getOwnedLease = async (leaseId, userId, res) => {
  const lease = await LeaseDocument.findById(leaseId);
  if (!lease) {
    res.status(404);
    throw new Error('Lease not found');
  }
  if (lease.user.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this lease');
  }
  return lease;
};

/**
 * @desc    Ask the AI assistant a question about a lease.
 * @route   POST /api/chat/:leaseId
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const lease = await getOwnedLease(req.params.leaseId, req.user._id, res);

  // Find or create the conversation for this (user, lease).
  let conversation = await Conversation.findOne({
    user: req.user._id,
    lease: lease._id,
  });
  if (!conversation) {
    conversation = new Conversation({
      user: req.user._id,
      lease: lease._id,
      messages: [],
    });
  }

  const answer = await askLeaseQuestion(
    lease,
    conversation.messages,
    message.trim()
  );

  conversation.messages.push({ role: 'user', content: message.trim() });
  conversation.messages.push({ role: 'assistant', content: answer });
  await conversation.save();

  res.json({ success: true, answer, conversationId: conversation._id });
});

/**
 * @desc    Get the conversation thread for a lease.
 * @route   GET /api/chat/:leaseId
 * @access  Private
 */
export const getConversation = asyncHandler(async (req, res) => {
  await getOwnedLease(req.params.leaseId, req.user._id, res);

  const conversation = await Conversation.findOne({
    user: req.user._id,
    lease: req.params.leaseId,
  });

  res.json({ success: true, messages: conversation?.messages || [] });
});

/**
 * @desc    Recent conversations across all leases (for the dashboard).
 * @route   GET /api/chat
 * @access  Private
 */
export const getRecentConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('lease', 'originalFileName riskLabel');

  const items = conversations
    .filter((c) => c.lease) // skip orphaned (deleted lease)
    .map((c) => {
      const last = c.messages[c.messages.length - 1];
      return {
        _id: c._id,
        leaseId: c.lease._id,
        leaseName: c.lease.originalFileName,
        riskLabel: c.lease.riskLabel,
        messageCount: c.messages.length,
        lastMessage: last ? last.content.slice(0, 120) : '',
        updatedAt: c.updatedAt,
      };
    });

  res.json({ success: true, conversations: items });
});
